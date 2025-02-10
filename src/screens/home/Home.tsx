/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import GetLocation from 'react-native-get-location';
import {getDistance} from 'geolib';
import useMapStore from '@utils/store/mapStore';
import useAuthStore from '@utils/store/authStore';
import CustomText from '@components/Ui/CustomText';
import {home} from '@assets/css/home';
import {AddRiderLocation} from '@utils/store/fireStore/firebaseStore';
import usePlaceOrder from '@utils/store/placeOrderStore';
import ActiveOrders from './components/ActiveOrders';
import BookingLoader from './components/BookingLoader';

const Home = () => {
  const {user, token}: any = useAuthStore();
  const {getUserOrders, orders}: any = usePlaceOrder();
  const data: any = useMapStore();
  const {fetchAddress, setRiderLocation, riderLocation, setHeading, heading} =
    data;
  const filteredOrders = useMemo(
    () =>
      orders?.length
        ? orders.filter(
            (val: any) => val.orderStatus <= 5 || val.orderStatus === 10,
          )
        : [],
    [orders],
  );

  let lastRecordedLocation: any = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const getCurrentLocation = async () => {
    try {
      const location: any = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      const {latitude, longitude} = location;

      // Calculate heading based on movement
      let calculatedHeading = null;
      const newLocation = {
        latitude: latitude,
        longitude: longitude,
      };

      if (lastRecordedLocation.current) {
        const {latitude: lastLat, longitude: lastLng} =
          lastRecordedLocation.current;
        const deltaY = latitude - lastLat;
        const deltaX = longitude - lastLng;

        if (deltaX !== 0 || deltaY !== 0) {
          const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          calculatedHeading = head >= 0 ? head : head + 360;

          setHeading(calculatedHeading);
        }
      }

      if (lastRecordedLocation.current) {
        const distance = getDistance(lastRecordedLocation.current, newLocation);
        if (distance >= 1) {
          setRiderLocation(newLocation);
          fetchAddress(newLocation.latitude, newLocation.longitude, false);
          lastRecordedLocation.current = newLocation;
          AddRiderLocation(
            riderLocation.latitude,
            riderLocation.longitude,
            user.id,
            heading,
          );
        }
      } else {
        setRiderLocation(newLocation);
        fetchAddress(newLocation.latitude, newLocation.longitude, false);
        lastRecordedLocation.current = newLocation;
      }
    } catch (error: any) {
      console.error('Error fetching location:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await getUserOrders(token);
      getCurrentLocation();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getUserOrders(token);
      AddRiderLocation(
        user.userId,
        riderLocation.latitude,
        riderLocation.longitude,
        heading,
      );
    }, 5000);
  }, [riderLocation, user, token, getUserOrders]);

  useEffect(() => {
    getCurrentLocation();
    const locationInterval = setInterval(() => {
      getCurrentLocation();
    }, 5000);
    return () => clearInterval(locationInterval);
  }, []);

  return (
    <ScrollView
      style={home.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
      }>
      {/* Header Section */}
      <View style={home.headerContainer}>
        <CustomText style={home.welcomeText}>Welcome, {user.name}!</CustomText>
        <View style={home.statsContainer}>
          <View style={home.statBox}>
            <CustomText style={home.statLabel}>Cash Collection</CustomText>
            <CustomText isBold={true} style={home.statValue}>
              Rs. 550
            </CustomText>
          </View>
          <View style={home.statBox}>
            <CustomText style={home.statLabel}>Today</CustomText>
            <View style={home.bookingText}>
              <CustomText isBold={true} style={home.statValue}>
                {filteredOrders ? filteredOrders.length : 0}
              </CustomText>
              <View>
                <CustomText style={home.statLabelSmall}>Bookings to</CustomText>
                <CustomText style={home.statLabelSmall}>Deliver</CustomText>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Section */}
      {orders && filteredOrders?.length > 0 ? (
        <ActiveOrders orders={filteredOrders} />
      ) : orders ? (
        <View style={home.containerNoOrder}>
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
