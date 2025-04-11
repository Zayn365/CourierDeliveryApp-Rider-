// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { View, ScrollView, RefreshControl } from 'react-native';
// import GetLocation from 'react-native-get-location';
// import { getDistance } from 'geolib';
// import useMapStore from '@utils/store/mapStore';
// import useAuthStore from '@utils/store/authStore';
// import CustomText from '@components/Ui/CustomText';
// import { home } from '@assets/css/home';
// import { AddRiderLocation } from '@utils/store/fireStore/firebaseStore';
// import usePlaceOrder from '@utils/store/placeOrderStore';
// import ActiveOrders from './components/ActiveOrders';
// import BookingLoader from './components/BookingLoader';

// const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
// const MINIMUM_DISTANCE = 1; // 1 meter

// const Home = () => {
//   const { user, token } = useAuthStore();
//   const { getUserOrders, orders } = usePlaceOrder();
//   const data: any = useMapStore();
//   const { fetchAddress, setRiderLocation, riderLocation, setHeading, heading } = data;
//   const [refreshing, setRefreshing] = useState(false);

//   const locationRequestRef = useRef<NodeJS.Timeout | null>(null);
//   const lastRecordedLocation = useRef<any>(null);
//   const locationRequestInProgress = useRef(false);

//     // console.log("ORDERS FROM HS ==========> : ",orders);

//   const filteredOrders = useMemo(
//     () => orders?.filter((val: any) => val.orderStatus <= 5 || val.orderStatus === 10) ?? [],
//     [orders],
//   );

//   // Filter orders delivered today
// // New filter for orders delivered 
// const ordersDeliveredToday = useMemo(() => {
//   const today = new Date(); // Gets current date dynamically
//   today.setHours(0, 0, 0, 0); // Set to start of current day
  
//   return orders?.filter((val: any) => {
//     const updatedAt = new Date(val.updatedAt);
//     const isDelivered = val.orderStatus === 6; // 6 = DELIVERED
//     const isToday = updatedAt.toDateString() === today.toDateString();
    
//     return isDelivered && isToday;
//   }) ?? [];
// }, [orders]);

//   const updateRiderLocation = async (newLocation: { latitude: number; longitude: number }) => {
//     // if (!user?.id) return;
//     if (!user?.userId) return;
//     // console.log("USER ==========> : ",user);
//     try {
//       await AddRiderLocation(
//         // user.id,
//         user.userId,
//         newLocation.latitude,
//         newLocation.longitude,
//         heading
//       );
//     } catch (error) {
//       console.error('Error updating rider location:', error);
//     }
//   };

//   const getCurrentLocation = async () => {

//     // // Skip if a request is already in progress
//     // if (locationRequestInProgress.current) {
//     //   return;
//     // }

//     // locationRequestInProgress.current = true;

//     try {
//       const location = await GetLocation.getCurrentPosition({
//         enableHighAccuracy: true,
//         timeout: 60000,
//       });

//       const newLocation = {
//         latitude: location.latitude,
//         longitude: location.longitude,
//       };

//       // Calculate heading only if we've moved
//       if (lastRecordedLocation.current) {
//         const distance = getDistance(lastRecordedLocation.current, newLocation);

//         if (distance >= MINIMUM_DISTANCE) {
//           const deltaY = newLocation.latitude - lastRecordedLocation.current.latitude;
//           const deltaX = newLocation.longitude - lastRecordedLocation.current.longitude;

//           // if (deltaX !== 0 || deltaY !== 0) {
//           //   const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//           //   const calculatedHeading = head >= 0 ? head : head + 360;
//           //   setHeading(calculatedHeading);
//           // }
//         if (deltaX !== 0 || deltaY !== 0) {
//             const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//             const calculatedHeading = head >= 0 ? head : head + 360;
//             setHeading(calculatedHeading);
//           } else {
//             setHeading((prevHeading: any) => prevHeading ?? 300);
//           }


//           setRiderLocation(newLocation);

//           console.log("RIDERS NEW LOCATION UPDATE FROM HS ==========> : ",newLocation);

//           fetchAddress(newLocation.latitude, newLocation.longitude, false);
//           await updateRiderLocation(newLocation);

//           console.log("RIDERS NEW LOCATION UPDATE FOR FIREBASE UPLOAD ==========> : ",newLocation);

//           lastRecordedLocation.current = newLocation;
//         }
//       } else {
//         // First location update
//         setRiderLocation(newLocation);

//         console.log("RIDERS NEW FIRST LOCATION UPDATE FROM HS ==========> : ",newLocation);
        
//         fetchAddress(newLocation.latitude, newLocation.longitude, false);
//         await updateRiderLocation(newLocation);

//         console.log("RIDERS NEW FIRST LOCATION UPDATE FOR FIREBASE UPLOAD ==========> : ",newLocation);

//         lastRecordedLocation.current = newLocation;
//       }
//     } catch (error: any) {
//       if (error.message !== 'Location cancelled by another request') {
//         console.error('Error fetching location:', error);
//       }
//     }
//   };

//   const refreshData = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         getUserOrders(token),
//         getCurrentLocation(),
//       ]);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Set up location polling
//   useEffect(() => {
//     getCurrentLocation();

//     locationRequestRef.current = setInterval(getCurrentLocation, LOCATION_UPDATE_INTERVAL);

//     return () => {
//       if (locationRequestRef.current) {
//         clearInterval(locationRequestRef.current);
//       }
//     };
//   }, []);

//   // Fetch orders periodically
//   useEffect(() => {
//     const orderInterval = setInterval(() => {
//       getUserOrders(token);
//     }, LOCATION_UPDATE_INTERVAL);

//     return () => clearInterval(orderInterval);
//   }, [token, getUserOrders]);

//   return (
//     <ScrollView
//       style={home.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
//       }>
//       {/* Header Section */}
//       <View style={home.headerContainer}>
//         <CustomText style={home.welcomeText1}>Welcome, <CustomText style={home.welcomeText2}>{user?.name || 'User'}!</CustomText> </CustomText>
//         <View style={home.statsContainer}>
//           <View style={home.statBox}>
//             <CustomText style={home.statLabel}>CASH DEPOSIT DUE</CustomText>
//             <CustomText isBold={true} style={home.priceStatValue}>
//               Rs. 550
//             </CustomText>
//           </View>
//           <View style={home.statBox}>
//             <CustomText style={home.statLabel}>TODAY</CustomText>
//             <View style={home.bookingText}>
//               <CustomText isBold={true} style={home.statValue}>
//                 {/* {filteredOrders ? filteredOrders.length : 0} */}
//                {ordersDeliveredToday ? ordersDeliveredToday.length : 0}
//               </CustomText>
//               <View style={{}}>
//                 <CustomText style={home.statLabelSmall}>Bookings</CustomText>
//                 <CustomText style={home.statLabelSmall}>Delivered</CustomText>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Main Section */}
//       {orders && filteredOrders.length > 0 ? (
//         <ActiveOrders orders={filteredOrders} />
//       ) : orders ? (
//         <View style={home.containerNoOrder}>
//           <CustomText style={home.customNoOrder}>
//             No orders available at the moment.
//           </CustomText>
//         </View>
//       ) : (
//         <BookingLoader />
//       )}
//     </ScrollView>
//   );
// };

// export default Home;

import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
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

const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
const MINIMUM_DISTANCE = 1; // 1 meter

const Home = () => {
  const { user, token } = useAuthStore();
  const { getUserOrders, orders } = usePlaceOrder();
  const data: any = useMapStore();
  const { fetchAddress, setRiderLocation, riderLocation, setHeading, heading } = data;  
  const [refreshing, setRefreshing] = useState(false);

  const locationRequestRef = useRef<NodeJS.Timeout | null>(null);
  const lastRecordedLocation = useRef<any>(null);

  const filteredOrders = orders?.filter((val: any) => val.orderStatus <= 5 || val.orderStatus === 10) ?? [];

  const updateRiderLocation = async (newLocation: { latitude: number; longitude: number; heading: number }) => {
    if (!user?.userId) return;
    try {
      console.log("Uploading to Firestore:", user.userId, newLocation.latitude, newLocation.longitude, heading);
      // await AddRiderLocation(user.userId, newLocation.latitude, newLocation.longitude, heading);
    } catch (error) {
      console.error('Error updating rider location:', error);
    }
  };

  const getCurrentLocation = async () => {
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
      } else {
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
    const orderInterval = setInterval(() => getUserOrders(token), LOCATION_UPDATE_INTERVAL);
    return () => clearInterval(orderInterval);
  }, [token, getUserOrders]);

  // Rest of your Home component remains the same...
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
              Rs. 550
            </CustomText>
          </View>
          <View style={home.statBox}>
            <CustomText style={home.statLabel}>TODAY</CustomText>
            <View style={home.bookingText}>
              <CustomText isBold={true} style={home.statValue}>
                {filteredOrders ? filteredOrders.length : 0}
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
