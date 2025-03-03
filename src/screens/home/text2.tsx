// import React, {useEffect, useMemo, useRef, useState} from 'react';
// import {View, ScrollView, RefreshControl, Platform, Linking, Alert} from 'react-native';
// import GetLocation from 'react-native-get-location';
// import {getDistance} from 'geolib';
// import useMapStore from '@utils/store/mapStore';
// import useAuthStore from '@utils/store/authStore';
// import CustomText from '@components/Ui/CustomText';
// import {home} from '@assets/css/home';
// import {AddRiderLocation} from '@utils/store/fireStore/firebaseStore';
// import usePlaceOrder from '@utils/store/placeOrderStore';
// import ActiveOrders from './components/ActiveOrders';
// import BookingLoader from './components/BookingLoader'
// import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
// import Geolocation from '@react-native-community/geolocation';

// const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
// const MINIMUM_DISTANCE = 1; // 1 meter

// const Home = () => {
//   const {user, token} = useAuthStore();
//   const {getUserOrders, orders} = usePlaceOrder();
//   const data: any = useMapStore();
//   const {fetchAddress, setRiderLocation, riderLocation, setHeading, heading} = data;  
//   const locationRequestRef = useRef<NodeJS.Timeout | null>(null);
//   const lastRecordedLocation = useRef<any>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [locationReady, setLocationReady] = useState(false);

//   useEffect(() => {
//     checkLocationAndGPS();
//   }, []);

//   const getLocationPermission = () => {
//     return Platform.OS === 'ios' 
//       ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
//       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
//   };

//   const requestLocationPermission = async () => {
//     const permission = getLocationPermission();
//     const result = await request(permission);
//     if (result === RESULTS.GRANTED) {
//       return true;
//     } else {
//       Alert.alert('Permission Required', 'Please enable location permission from settings.', [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Open Settings', onPress: () => openSettings() }
//       ]);
//       return false;
//     }
//   };

//   const checkGpsStatus = async () => {
//     Geolocation.getCurrentPosition(
//       () => setLocationReady(true),
//       (error:any) => {
//         if (error.code === 2 
//           // || error.code === 3
//         ) {
//           Alert.alert('GPS Required', 'Enable GPS to proceed.', [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Open Settings', onPress: () => openGpsSettings() }
//           ]);
//         } else {
//           setLocationReady(true);
//         }
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   const openGpsSettings = () => {
//     if (Platform.OS === 'android') {
//       Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
//     } else if (Platform.OS === 'ios') {
//       Linking.openURL('App-Prefs:Privacy&path=LOCATION');
//     }
//   };

//   const checkLocationAndGPS = async () => {
//     const permissionGranted = await requestLocationPermission();
//     if (permissionGranted) {
//       setLocationReady(true);
//       checkGpsStatus();
//     }
//   };

//   const filteredOrders = useMemo(
//     () => orders?.filter((val: any) => val.orderStatus <= 5 || val.orderStatus === 10) ?? [],
//     [orders],
//   );

//   const updateRiderLocation = async (newLocation: { latitude: number; longitude: number }) => {

//     if (!user?.id) return;

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

//           if (deltaX !== 0 || deltaY !== 0) {
//             const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//             const calculatedHeading = head >= 0 ? head : head + 360;
//             setHeading(calculatedHeading);
//           }

//           setRiderLocation(newLocation);
//           fetchAddress(newLocation.latitude, newLocation.longitude, false);
//           await updateRiderLocation(newLocation);
//           lastRecordedLocation.current = newLocation;
//         }
//       } else {
//         // First location update
//         setRiderLocation(newLocation);
//         fetchAddress(newLocation.latitude, newLocation.longitude, false);
//         await updateRiderLocation(newLocation);
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


//   if (!locationReady) return <View style={home.container}><CustomText>Checking location settings...</CustomText></View>;

//   return (
//     <ScrollView
//       style={home.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
//       }>
//       {/* Header Section */}
//       <View style={home.headerContainer}>
//         <CustomText style={home.welcomeText}>Welcome, {user?.name}!</CustomText>
//         <View style={home.statsContainer}>
//           <View style={home.statBox}>
//             <CustomText style={home.statLabel}>Cash Collection</CustomText>
//             <CustomText isBold={true} style={home.statValue}>
//               Rs. 550
//             </CustomText>
//           </View>
//           <View style={home.statBox}>
//             <CustomText style={home.statLabel}>Today</CustomText>
//             <View style={home.bookingText}>
//               <CustomText isBold={true} style={home.statValue}>
//                 {filteredOrders.length}
//               </CustomText>
//               <View>
//                 <CustomText style={home.statLabelSmall}>Bookings to</CustomText>
//                 <CustomText style={home.statLabelSmall}>Deliver</CustomText>
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