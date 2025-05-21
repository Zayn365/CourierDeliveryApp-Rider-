
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { getDistance } from 'geolib';
import useMapStore from '@utils/store/mapStore';
import useAuthStore from '@utils/store/authStore';
import CustomText from '@components/Ui/CustomText';
import { home } from '@assets/css/home';
import { AddRiderLocation } from '@utils/store/fireStore/firebaseStore';
import usePlaceOrder from '@utils/store/placeOrderStore';
import ActiveOrders from './components/ActiveOrders';
import BookingLoader from './components/BookingLoader';
import NativeLocationTracking from './../../../specs/NativeLocationTracking';
import { requestLocationPermission } from '@utils/permissions/locationPermission';
import useDepositStore from '@utils/store/depositStore';
import { errorToast } from '@components/Ui/CustomToast';
import GetLocation from 'react-native-get-location';
import useBackgroundLocationTracking from '@utils/store/useBackgroundLocationTracking';
import LottieView from 'lottie-react-native';
import noOrdersFound from '@assets/lottieFiles/noOrdersFound.json';
import lottie2 from '@assets/lottieFiles/lottie2.json';
import lottie3 from '@assets/lottieFiles/lottie3.json';


const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
const MINIMUM_DISTANCE = 1; // 1 meter

interface Payment {
  id: number;
  orderId: number;
  riderId: string;
  amountReceivedRider: number;
  amountPaidRider: number;
  commission: number;
  refund: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  order: any;
  consignmentNumber?: string; // Optional, added for future API update
}

const Home = () => {
  const { user, token } = useAuthStore();
  const { getUserOrders, orders } = usePlaceOrder();
  const data: any = useMapStore();
  const { fetchAddress, setRiderLocation, riderLocation, setHeading, heading } = data;
  const [refreshing, setRefreshing] = useState(false);

  // Use background location tracking hook
  useBackgroundLocationTracking();

  const {
    dashBoardDepositDue,
    todayPayments,
    pastPayments,
    fetchDashBoardDepositDue,
    fetchTodayPayments,
    fetchPastPayments
  } = useDepositStore();
  // let todayPaymentsData=todayPayments;
  let totalTodayPayments = todayPayments.reduce((sum, item) => sum + item.amountReceivedRider, 0);;
  // let cashDepositDue = totalTodayPayments + pastPayments.total;
  let cashDepositDue = dashBoardDepositDue;

  const getDeliveredTodayCount = (orders: any) => {
    const today = new Date(); // Current date: 2025-04-15

    return (orders ?? []).filter((order: any) => {
      // Check if order is delivered
      if (order.orderStatusString !== "DELIVERED") return false;

      // Check if updatedAt is today
      const updatedDate = new Date(order.updatedAt);
      return (
        updatedDate.getFullYear() === today.getFullYear() &&
        updatedDate.getMonth() === today.getMonth() &&
        updatedDate.getDate() === today.getDate()
      );
    }).length;
  };

  let count = getDeliveredTodayCount(orders);

  const locationRequestRef = useRef<NodeJS.Timeout | null>(null);
  const lastRecordedLocation = useRef<any>(null);

  const filteredOrders = orders?.filter((val: any) => val.orderStatus <= 5 || val.orderStatus === 10 || val.orderStatus === 11) ?? [];
  // console.log("Orders:", orders);
  // console.log("Filtered Orders:", filteredOrders);


  const updateRiderLocation = async (newLocation: { latitude: number; longitude: number; heading: number }) => {
    if (!user?.userId) return;
    try {
      console.log("Uploading to Firestore:", user.userId, newLocation.latitude, newLocation.longitude, heading);
      await AddRiderLocation(user.userId, newLocation.latitude, newLocation.longitude, heading);
    } catch (error) {
      console.error('Error updating rider location:', error);
    }
  };

  const getCurrentLocation = async () => {
    // try {
    //   const location: any = await GetLocation.getCurrentPosition({
    //     enableHighAccuracy: true,
    //     timeout: 60000,
    //   });
    //   const { latitude, longitude } = location;
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }
      if (!NativeLocationTracking) {
        console.log('NativeLocationTracking not available');
        return;
      }
      const location = await NativeLocationTracking.getCurrentPosition();
      const newLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        heading: heading, // Will update below
      };

      if (lastRecordedLocation.current) {
        const distance = getDistance(lastRecordedLocation.current, newLocation);
        if (distance >= MINIMUM_DISTANCE) {
          const deltaY = newLocation.latitude - lastRecordedLocation.current.latitude;
          const deltaX = newLocation.longitude - lastRecordedLocation.current.longitude;
          if (deltaX !== 0 || deltaY !== 0) {
            const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            const calculatedHeading = head >= 0 ? head : head + 360;
            setHeading(calculatedHeading);
            newLocation.heading = calculatedHeading;
          }
          setRiderLocation(newLocation);
          fetchAddress(newLocation.latitude, newLocation.longitude, false);
          // await updateRiderLocation(newLocation);
          lastRecordedLocation.current = newLocation;
        }
      }

      // if (lastRecordedLocation.current) {
      //   const distance = getDistance(lastRecordedLocation.current, newLocation);
      //   if (distance >= MINIMUM_DISTANCE) {
      //     // Calculate heading using spherical bearing formula
      //     const toRadians = (deg: number) => (deg * Math.PI) / 180;
      //     const toDegrees = (rad: number) => (rad * 180) / Math.PI;

      //     const φ1 = toRadians(lastRecordedLocation.current.latitude);
      //     const φ2 = toRadians(newLocation.latitude);
      //     const Δλ = toRadians(newLocation.longitude - lastRecordedLocation.current.longitude);

      //     const y = Math.sin(Δλ) * Math.cos(φ2);
      //     const x =
      //       Math.cos(φ1) * Math.sin(φ2) -
      //       Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      //     const θ = Math.atan2(y, x);

      //     const calculatedHeading = (toDegrees(θ) + 360) % 360; // Normalize to 0–360°

      //     if (!isNaN(calculatedHeading)) {
      //       setHeading(calculatedHeading);
      //       newLocation.heading = calculatedHeading;
      //     }

      //     setRiderLocation(newLocation);
      //     fetchAddress(newLocation.latitude, newLocation.longitude, false);
      //     await updateRiderLocation(newLocation);
      //     lastRecordedLocation.current = newLocation;
      //   }
      // }

      else {
        setRiderLocation(newLocation);
        fetchAddress(newLocation.latitude, newLocation.longitude, false);
        // await updateRiderLocation(newLocation);
        lastRecordedLocation.current = newLocation;
      }
    } catch (error: any) {
      console.error('Error fetching location:', error.code, error.message);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([getUserOrders(token), getCurrentLocation()]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    locationRequestRef.current = setInterval(getCurrentLocation, LOCATION_UPDATE_INTERVAL);
    return () => {
      if (locationRequestRef.current) clearInterval(locationRequestRef.current);
    };
  }, []);

  useEffect(() => {
    if (token === null) {
      errorToast("Authentication token is missing.");
      // Alert.alert("Error", "Authentication token is missing.");
    } else {
      fetchDashBoardDepositDue(token);
      fetchTodayPayments(token);
      fetchPastPayments(token);
    }
  }, [token, count]);

  useEffect(() => {
    const orderInterval = setInterval(() => getUserOrders(token), LOCATION_UPDATE_INTERVAL);
    return () => clearInterval(orderInterval);
  }, [token, getUserOrders]);

  return (
    <ScrollView
      style={home.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
      }>
      {/* Header Section */}
      <View style={home.headerContainer}>
        <CustomText style={home.welcomeText1}>Welcome, <CustomText style={home.welcomeText2}>{user?.name || 'User'}!</CustomText> </CustomText>
        <View style={home.statsContainer}>
          <View style={home.statBox}>
            <CustomText style={home.statLabel}>CASH DEPOSIT DUE</CustomText>
            <CustomText isBold={true} style={home.priceStatValue}>
              {/* Rs. {cashDepositDue} */}
              Rs. {Math.round(cashDepositDue).toLocaleString()}
            </CustomText>
          </View>
          <View style={home.statBox}>
            <CustomText style={home.statLabel}>TODAY</CustomText>
            <View style={home.bookingText}>
              <CustomText isBold={true} style={home.statValue}>
                {count}
              </CustomText>
              <View style={{}}>
                <CustomText style={home.statLabelSmall}>Bookings</CustomText>
                <CustomText style={home.statLabelSmall}>Delivered</CustomText>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Section */}
      {orders && filteredOrders.length > 0 ? (
        <ActiveOrders orders={filteredOrders} />
      ) : orders ? (
        <View style={home.containerNoOrder}>
          <LottieView
            source={lottie3}
            autoPlay
            loop={true}
            // duration={5500}
            style={{ width: 200, height: 200, alignSelf:'center' }} // adjust size as needed
          />
          <CustomText style={home.customNoOrder}>
            No orders available at the moment.
          </CustomText>
        </View>
      ) : (
        <BookingLoader />
      )}
    </ScrollView>
  );
};
export default Home;
