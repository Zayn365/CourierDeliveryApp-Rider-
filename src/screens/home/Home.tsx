// // import React, { useEffect, useMemo, useRef, useState } from 'react';
// // import { View, ScrollView, RefreshControl, Platform, Linking, Alert, AppState } from 'react-native';
// // import GetLocation from 'react-native-get-location';
// // import { getDistance } from 'geolib';
// // import useMapStore from '@utils/store/mapStore';
// // import useAuthStore from '@utils/store/authStore';
// // import CustomText from '@components/Ui/CustomText';
// // import { home } from '@assets/css/home';
// // import { AddRiderLocation } from '@utils/store/fireStore/firebaseStore';
// // import usePlaceOrder from '@utils/store/placeOrderStore';
// // import ActiveOrders from './components/ActiveOrders';
// // import BookingLoader from './components/BookingLoader'
// // import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
// // import Geolocation from '@react-native-community/geolocation';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import CustomButton from '@components/Ui/CustomButton';

// // const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
// // const MINIMUM_DISTANCE = 1; // 1 meter
// // // Keys for persistent storage
// // const GPS_STATUS_KEY = 'gps_status_verified';
// // const LAST_GPS_CHECK_TIME = 'last_gps_check_time';
// // const GPS_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

// // // Global variables to persist across re-renders
// // let isGpsAlertShowing = false;
// // let isCheckingGps = false;
// // let gpsStatusVerified = false;

// // const Home = () => {
// //   const { user, token } = useAuthStore();
// //   const { getUserOrders, orders } = usePlaceOrder();
// //   const data: any = useMapStore();
// //   const { fetchAddress, setRiderLocation, riderLocation, setHeading, heading } = data;
// //   const locationRequestRef = useRef<NodeJS.Timeout | null>(null);
// //   const lastRecordedLocation = useRef<any>(null);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [locationUIState, setLocationUIState] = useState('loading'); // 'loading', 'gps_needed', 'ready'
// //   const mountTimeRef = useRef(Date.now());

// //   // Inside the Home component
// // useEffect(() => {
// //   const handleAppStateChange = (nextAppState: string) => {
// //     if (nextAppState === 'active') {
// //       checkGpsWithoutAlert(); // Check GPS status when app is foregrounded
// //     }
// //   };

// //   const subscription = AppState.addEventListener('change', handleAppStateChange);

// //   return () => {
// //     subscription.remove();
// //   };
// // }, []);

// //   // Persistent GPS status check - load from storage on mount
// //   useEffect(() => {
// //     async function loadGpsStatus() {
// //       try {
// //         const savedGpsStatus = await AsyncStorage.getItem(GPS_STATUS_KEY);
// //         const lastCheckTime = await AsyncStorage.getItem(LAST_GPS_CHECK_TIME);

// //         if (savedGpsStatus === 'true' && lastCheckTime) {
// //           const timeSinceLastCheck = Date.now() - parseInt(lastCheckTime);

// //           // If we've checked GPS recently, use the stored value
// //           if (timeSinceLastCheck < GPS_CHECK_INTERVAL) {
// //             gpsStatusVerified = true;
// //             setLocationUIState('ready');
// //             return;
// //           }
// //         }

// //         // Otherwise, need to check GPS
// //         initLocationChecks();
// //       } catch (error) {
// //         console.error('Error loading GPS status:', error);
// //         initLocationChecks();
// //       }
// //     }

// //     loadGpsStatus();
// //   }, []);

// //   const initLocationChecks = async () => {
// //     const permissionResult = await checkLocationPermission();
// //     if (permissionResult) {
// //       checkGpsWithoutAlert();
// //     } else {
// //       setLocationUIState('gps_needed');
// //     }
// //   };

// //   // Function to save GPS status to persistent storage
// //   const saveGpsStatus = async (status: boolean) => {
// //     try {
// //       await AsyncStorage.setItem(GPS_STATUS_KEY, status.toString());
// //       await AsyncStorage.setItem(LAST_GPS_CHECK_TIME, Date.now().toString());
// //       gpsStatusVerified = status;
// //     } catch (error) {
// //       console.error('Error saving GPS status:', error);
// //     }
// //   };

// //   const getLocationPermission = () => {
// //     return Platform.OS === 'ios'
// //       ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
// //       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
// //   };

// //   const checkLocationPermission = async (): Promise<boolean> => {
// //     try {
// //       const permission = getLocationPermission();
// //       const result = await check(permission);

// //       if (result === RESULTS.GRANTED) {
// //         return true;
// //       } else if (result === RESULTS.DENIED) {
// //         const requestResult = await request(permission);
// //         return requestResult === RESULTS.GRANTED;
// //       }
// //       return false;
// //     } catch (error) {
// //       console.error('Error checking location permission:', error);
// //       return false;
// //     }
// //   };

// //   // Silent GPS check - no alerts
// //   const checkGpsWithoutAlert = async () => {
// //     if (isCheckingGps) return;
// //     isCheckingGps = true;

// //     try {
// //       const location = await GetLocation.getCurrentPosition({
// //         enableHighAccuracy: true,
// //         timeout: 8000,
// //       });

// //       // GPS is working
// //       setLocationUIState('ready');
// //       saveGpsStatus(true);

// //       // Initialize with first location
// //       const newLocation = {
// //         latitude: location.latitude,
// //         longitude: location.longitude,
// //       };

// //       setRiderLocation(newLocation);
// //       lastRecordedLocation.current = newLocation;
// //       fetchAddress(newLocation.latitude, newLocation.longitude, false);

// //     } catch (error: any) {
// //       console.log('GPS verification error:', error);
// //       setLocationUIState('gps_needed');
// //       saveGpsStatus(false);
// //     } finally {
// //       isCheckingGps = false;
// //     }
// //   };

// //   // Only show GPS alert if explicitly requested and not already showing
// //   const showGpsAlert = () => {
// //     if (isGpsAlertShowing) return;
// //     isGpsAlertShowing = true;

// //     Alert.alert(
// //       'GPS Required',
// //       'Enable GPS to proceed.',
// //       [
// //         {
// //           text: 'Cancel',
// //           style: 'cancel',
// //           onPress: () => {
// //             isGpsAlertShowing = false;
// //           }
// //         },
// //         {
// //           text: 'Open Settings',
// //           onPress: () => {
// //             openGpsSettings();
// //             isGpsAlertShowing = false;
// //             // Set a timeout to recheck GPS after user returns from settings
// //             setTimeout(checkGpsWithoutAlert, 5000);
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   const openGpsSettings = () => {
// //     if (Platform.OS === 'android') {
// //       Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
// //     } else if (Platform.OS === 'ios') {
// //       Linking.openURL('App-Prefs:Privacy&path=LOCATION');
// //     }
// //   };

// //   const filteredOrders = useMemo(
// //     () => orders?.filter((val: any) => val.orderStatus <= 5 || val.orderStatus === 10) ?? [],
// //     [orders],
// //   );

// //   const updateRiderLocation = async (newLocation: { latitude: number; longitude: number }) => {
// //     if (!user?.id && !user?.userId) return;

// //     try {
// //       await AddRiderLocation(
// //         user.userId,
// //         newLocation.latitude,
// //         newLocation.longitude,
// //         heading
// //       );
// //     } catch (error) {
// //       console.error('Error updating rider location:', error);
// //     }
// //   };

// //   const getCurrentLocation = async () => {
// //     // Skip if not ready or if GPS not verified
// //     if (locationUIState !== 'ready' || !gpsStatusVerified) return;

// //     try {
// //       const location = await GetLocation.getCurrentPosition({
// //         enableHighAccuracy: true,
// //         timeout: 60000,
// //       });

// //       const newLocation = {
// //         latitude: location.latitude,
// //         longitude: location.longitude,
// //       };

// //       // Calculate heading only if we've moved
// //       if (lastRecordedLocation.current) {
// //         const distance = getDistance(lastRecordedLocation.current, newLocation);

// //         if (distance >= MINIMUM_DISTANCE) {
// //           const deltaY = newLocation.latitude - lastRecordedLocation.current.latitude;
// //           const deltaX = newLocation.longitude - lastRecordedLocation.current.longitude;

// //           if (deltaX !== 0 || deltaY !== 0) {
// //             const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
// //             const calculatedHeading = head >= 0 ? head : head + 360;
// //             setHeading(calculatedHeading);
// //           }

// //           setRiderLocation(newLocation);
// //           fetchAddress(newLocation.latitude, newLocation.longitude, false);
// //           await updateRiderLocation(newLocation);
// //           lastRecordedLocation.current = newLocation;
// //         }
// //       } else {
// //         // First location update
// //         setRiderLocation(newLocation);
// //         fetchAddress(newLocation.latitude, newLocation.longitude, false);
// //         await updateRiderLocation(newLocation);
// //         lastRecordedLocation.current = newLocation;
// //       }
// //     } catch (error: any) {
// //       if (error.message !== 'Location cancelled by another request') {
// //         console.error('Error in getCurrentLocation:', error);

// //         // If location fails and we're more than 30 seconds from mount,
// //         // check GPS status again
// //         if (Date.now() - mountTimeRef.current > 30000) {
// //           checkGpsWithoutAlert();
// //         }
// //       }
// //     }
// //   };

// //   const refreshData = async () => {
// //     setRefreshing(true);
// //     try {
// //       if (locationUIState === 'ready') {
// //         await Promise.all([
// //           getUserOrders(token),
// //           getCurrentLocation(),
// //         ]);
// //       } else {
// //         await checkGpsWithoutAlert();
// //         getUserOrders(token);
// //       }
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   // Set up location polling when location is ready
// //   useEffect(() => {
// //     if (locationUIState === 'ready' && gpsStatusVerified) {
// //       getCurrentLocation();

// //       locationRequestRef.current = setInterval(getCurrentLocation, LOCATION_UPDATE_INTERVAL);

// //       return () => {
// //         if (locationRequestRef.current) {
// //           clearInterval(locationRequestRef.current);
// //         }
// //       };
// //     }
// //   }, [locationUIState]);

// //   // Fetch orders periodically
// //   useEffect(() => {
// //     if (token) {
// //       getUserOrders(token);

// //       const orderInterval = setInterval(() => {
// //         getUserOrders(token);
// //       }, LOCATION_UPDATE_INTERVAL);

// //       return () => clearInterval(orderInterval);
// //     }
// //   }, [token, getUserOrders]);

// //   if (locationUIState === 'loading') {
// //     return (
// //       <View style={[home.container,{alignItems:'center', justifyContent:'center', padding:10}]}>
// //         <CustomText>Checking location settings...</CustomText>
// //       </View>
// //     );
// //   }

// //   if (locationUIState === 'gps_needed') {
// //     return (
// //       <View 
// //       style={{
// //         backgroundColor: 'rgba(255, 0, 0, 0.1)',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         paddingHorizontal:10,
// //         paddingVertical:20
// //       }}>
// //         <CustomText style={{ marginBottom: 20 }}>Please enable GPS to continue</CustomText>
// //         <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
// //           <CustomText 
// //             style={{
// //               color: '#FFF', 
// //               padding: 10,
// //               backgroundColor: 'rgba(255, 0, 0, 1)', 
// //               borderRadius:10, 
// //               fontSize:12, 
// //               fontWeight:'700'
// //             }}
// //             onPress={showGpsAlert}>
// //             Open GPS Settings
// //           </CustomText> 
// //           <CustomText 
// //             style={{
// //               color: '#FFF', 
// //               padding: 10,
// //               backgroundColor: 'rgba(255, 0, 0, 1)', 
// //               borderRadius:10, 
// //               fontSize:12, 
// //               fontWeight:'700'
// //             }}
// //             onPress={checkGpsWithoutAlert}
// //             >
// //             Retry Location Check
// //           </CustomText>

// //         </View>
// //       </View>
// //     );
// //   }

// //   return (
// //     <ScrollView
// //       style={home.container}
// //       refreshControl={
// //         <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
// //       }>
// //       {/* Header Section */}
// //       <View style={home.headerContainer}>
// //         <CustomText style={home.welcomeText}>Welcome, {user?.name}!</CustomText>
// //         <View style={home.statsContainer}>
// //           <View style={home.statBox}>
// //             <CustomText style={home.statLabel}>Cash Collection</CustomText>
// //             <CustomText isBold={true} style={home.statValue}>
// //               Rs. 550
// //             </CustomText>
// //           </View>
// //           <View style={home.statBox}>
// //             <CustomText style={home.statLabel}>Today</CustomText>
// //             <View style={home.bookingText}>
// //               <CustomText isBold={true} style={home.statValue}>
// //                 {filteredOrders.length}
// //               </CustomText>
// //               <View>
// //                 <CustomText style={home.statLabelSmall}>Bookings to</CustomText>
// //                 <CustomText style={home.statLabelSmall}>Deliver</CustomText>
// //               </View>
// //             </View>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Main Section */}
// //       {orders && filteredOrders.length > 0 ? (
// //         <ActiveOrders orders={filteredOrders} />
// //       ) : orders ? (
// //         <View style={home.containerNoOrder}>
// //           <CustomText style={home.customNoOrder}>
// //             No orders available at the moment.
// //           </CustomText>
// //         </View>
// //       ) : (
// //         <BookingLoader />
// //       )}
// //     </ScrollView>
// //   );
// // };

// // export default Home;

// // /* eslint-disable react-hooks/exhaustive-deps */
// // import React, {useEffect, useMemo, useRef, useState} from 'react';
// // import {View, ScrollView, RefreshControl} from 'react-native';
// // import GetLocation from 'react-native-get-location';
// // import {getDistance} from 'geolib';
// // import useMapStore from '@utils/store/mapStore';
// // import useAuthStore from '@utils/store/authStore';
// // import CustomText from '@components/Ui/CustomText';
// // import {home} from '@assets/css/home';
// // import {AddRiderLocation} from '@utils/store/fireStore/firebaseStore';
// // import usePlaceOrder from '@utils/store/placeOrderStore';
// // import ActiveOrders from './components/ActiveOrders';
// // import BookingLoader from './components/BookingLoader';

// // const Home = () => {
// //   const {user, token}: any = useAuthStore();
// //   const {getUserOrders, orders}: any = usePlaceOrder();
// //   const data: any = useMapStore();
// //   const {fetchAddress, setRiderLocation, riderLocation, setHeading, heading} =
// //     data;
// //   const filteredOrders = useMemo(
// //     () =>
// //       orders?.length
// //         ? orders.filter(
// //             (val: any) => val.orderStatus <= 5 || val.orderStatus === 10,
// //           )
// //         : [],
// //     [orders],
// //   );

// //   let lastRecordedLocation: any = useRef(null);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const getCurrentLocation = async () => {
// //     try {
// //       const location: any = await GetLocation.getCurrentPosition({
// //         enableHighAccuracy: true,
// //         timeout: 60000,
// //       });
// //       const {latitude, longitude} = location;

// //       // Calculate heading based on movement
// //       let calculatedHeading = null;
// //       const newLocation = {
// //         latitude: latitude,
// //         longitude: longitude,
// //       };

//       // if (lastRecordedLocation.current) {
//       //   const {latitude: lastLat, longitude: lastLng} =
//       //     lastRecordedLocation.current;
//       //   const deltaY = latitude - lastLat;
//       //   const deltaX = longitude - lastLng;

//       //   if (deltaX !== 0 || deltaY !== 0) {
//       //     const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//       //     calculatedHeading = head >= 0 ? head : head + 360;

//       //     setHeading(calculatedHeading);
//       //   }
//       // }

// //       if (lastRecordedLocation.current) {
// //         const distance = getDistance(lastRecordedLocation.current, newLocation);
// //         if (distance >= 1) {
// //           setRiderLocation(newLocation);
// //           fetchAddress(newLocation.latitude, newLocation.longitude, false);
// //           lastRecordedLocation.current = newLocation;
// //           // AddRiderLocation(
// //           //   riderLocation.latitude,
// //           //   riderLocation.longitude,
// //           //   user.id,
// //           //   heading,
// //           // );
// //           AddRiderLocation(
// //             user.userId,
// //             riderLocation.latitude,
// //             riderLocation.longitude,
// //             heading,
// //           );
// //         }
// //       } else {
// //         setRiderLocation(newLocation);
// //         fetchAddress(newLocation.latitude, newLocation.longitude, false);
// //         lastRecordedLocation.current = newLocation;
// //       }
// //     } catch (error: any) {
// //       console.error('Error fetching location:', error);
// //     }
// //   };

// //   const refreshData = async () => {
// //     setRefreshing(true);
// //     try {
// //       await getUserOrders(token);
// //       getCurrentLocation();
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   useEffect(() => {
// //     setTimeout(() => {
// //       getUserOrders(token);
// //       AddRiderLocation(
// //         user.userId,
// //         riderLocation.latitude,
// //         riderLocation.longitude,
// //         heading,
// //       );
// //     }, 5000);
// //   }, [riderLocation, user, token, getUserOrders]);

// //   useEffect(() => {
// //     getCurrentLocation();
// //     const locationInterval = setInterval(() => {
// //       getCurrentLocation();
// //     }, 5000);
// //     return () => clearInterval(locationInterval);
// //   }, []);

// //   return (
// //     <ScrollView
// //       style={home.container}
// //       refreshControl={
// //         <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
// //       }>
// //       {/* Header Section */}
// //       <View style={home.headerContainer}>
// //         <CustomText style={home.welcomeText}>Welcome, {user.name}!</CustomText>
// //         <View style={home.statsContainer}>
// //           <View style={home.statBox}>
// //             <CustomText style={home.statLabel}>Cash Collection</CustomText>
// //             <CustomText isBold={true} style={home.statValue}>
// //               Rs. 550
// //             </CustomText>
// //           </View>
// //           <View style={home.statBox}>
// //             <CustomText style={home.statLabel}>Today</CustomText>
// //             <View style={home.bookingText}>
// //               <CustomText isBold={true} style={home.statValue}>
// //                 {filteredOrders ? filteredOrders.length : 0}
// //               </CustomText>
// //               <View>
// //                 <CustomText style={home.statLabelSmall}>Bookings to</CustomText>
// //                 <CustomText style={home.statLabelSmall}>Deliver</CustomText>
// //               </View>
// //             </View>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Main Section */}
// //       {orders && filteredOrders?.length > 0 ? (
// //         <ActiveOrders orders={filteredOrders} />
// //       ) : orders ? (
// //         <View style={home.containerNoOrder}>
// //           <CustomText style={home.customNoOrder}>
// //             No orders available at the moment.
// //           </CustomText>
// //         </View>
// //       ) : (
// //         <BookingLoader />
// //       )}
// //     </ScrollView>
// //   );
// // };

// // export default Home;

// /* eslint-disable react-hooks/exhaustive-deps */
// import React, {useEffect, useMemo, useRef, useState} from 'react';
// import {View, ScrollView, RefreshControl} from 'react-native';
// import GetLocation from 'react-native-get-location';
// import {getDistance} from 'geolib';
// import useMapStore from '@utils/store/mapStore';
// import useAuthStore from '@utils/store/authStore';
// import CustomText from '@components/Ui/CustomText';
// import {home} from '@assets/css/home';
// import {AddRiderLocation} from '@utils/store/fireStore/firebaseStore';
// import usePlaceOrder from '@utils/store/placeOrderStore';
// import ActiveOrders from './components/ActiveOrders';
// import BookingLoader from './components/BookingLoader';

// const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds
// const MINIMUM_DISTANCE = 1; // 1 meter

// const Home = () => {
//   const {user, token}: any = useAuthStore();
//   const {getUserOrders, orders}: any = usePlaceOrder();
//   const data: any = useMapStore();
//   const {fetchAddress, setRiderLocation, riderLocation, setHeading, heading} = data;

//   const lastRecordedLocation = useRef<any>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const locationRequestInProgress = useRef(false);

//   const filteredOrders = useMemo(
//     () =>
//       orders?.length
//         ? orders.filter(
//             (val: any) => val.orderStatus <= 5 || val.orderStatus === 10,
//           )
//         : [],
//     [orders],
//   );

//   const getCurrentLocation = async () => {
//     // Skip if a request is already in progress
//     if (locationRequestInProgress.current) {
//       return;
//     }

//     locationRequestInProgress.current = true;

//     try {
//       const location: any = await GetLocation.getCurrentPosition({
//         enableHighAccuracy: true,
//         timeout: 60000,
//       });

//       const {latitude, longitude} = location;
//       const newLocation = {
//         latitude: latitude,
//         longitude: longitude,
//       };

//       // Calculate heading based on movement
//       if (lastRecordedLocation.current) {
//         const {latitude: lastLat, longitude: lastLng} = lastRecordedLocation.current;
//         const deltaY = latitude - lastLat;
//         const deltaX = longitude - lastLng;

//         // if (deltaX !== 0 || deltaY !== 0) {
//         //   const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//         //   const calculatedHeading = head >= 0 ? head : head + 360;
//         //   setHeading(calculatedHeading);
//         // }

//         if (deltaX !== 0 || deltaY !== 0) {
//           const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//           const calculatedHeading = head >= 0 ? head : head + 360;
//           setHeading(calculatedHeading);
//         } else {
//           setHeading((prevHeading: any) => prevHeading ?? 0); // Keep last heading or default to 0
//         }

//         const distance = getDistance(lastRecordedLocation.current, newLocation);

//         if (distance >= MINIMUM_DISTANCE) {
//           // Update state with new location
//           setRiderLocation(newLocation);

//           // Fetch address for the new location
//           fetchAddress(newLocation.latitude, newLocation.longitude, false);

//           // Upload the new location to Firebase
//           if (user?.userId) {
//             console.log(
//               "USER ID : =====> ",user.userId,
//               "LAT ID : =====> ",newLocation.latitude,
//               "LONG : =====> ",newLocation.longitude,
//               "HEADING : =====> ",heading
//             )
//             await AddRiderLocation(
//               user.userId,
//               newLocation.latitude,
//               newLocation.longitude,
//               heading,
//             );
//           }

//           // Update the last recorded location reference
//           lastRecordedLocation.current = newLocation;
//         }
//       } else {
//         // First location update
//         setRiderLocation(newLocation);
//         fetchAddress(newLocation.latitude, newLocation.longitude, false);

//         // Upload initial location
//         if (user?.userId) {
//           await AddRiderLocation(
//             user.userId,
//             newLocation.latitude,
//             newLocation.longitude,
//             heading,
//           );
//         }

//         lastRecordedLocation.current = newLocation;
//       }
//     } catch (error: any) {
//       // Only log errors that aren't cancellation errors
//       if (error.message !== 'Location cancelled by another request') {
//         console.error('Error fetching location:', error);
//       }
//     } finally {
//       locationRequestInProgress.current = false;
//     }
//   };

//   const refreshData = async () => {
//     setRefreshing(true);
//     try {
//       await getUserOrders(token);
//       await getCurrentLocation();
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Set up location polling
//   useEffect(() => {
//     // Initial location request
//     getCurrentLocation();

//     // Single interval for location updates
//     const locationInterval = setInterval(() => {
//       getCurrentLocation();
//     }, LOCATION_UPDATE_INTERVAL);

//     return () => clearInterval(locationInterval);
//   }, []);

//   // Fetch orders periodically
//   useEffect(() => {
//     if (token) {
//       getUserOrders(token);

//       const orderInterval = setInterval(() => {
//         getUserOrders(token);
//       }, LOCATION_UPDATE_INTERVAL);

//       return () => clearInterval(orderInterval);
//     }
//   }, [token, getUserOrders]);

//   return (
//     <ScrollView
//       style={home.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
//       }>
// {/* Header Section */}
// <View style={home.headerContainer}>
//   <CustomText style={home.welcomeText1}>Welcome, <CustomText style={home.welcomeText2}>{user?.name || 'User'}!</CustomText> </CustomText>
//   <View style={home.statsContainer}>
//     <View style={home.statBox}>
//       <CustomText style={home.statLabel}>CASH DEPOSIT DUE</CustomText>
//       <CustomText isBold={true} style={home.priceStatValue}>
//         Rs. 550
//       </CustomText>
//     </View>
//     <View style={home.statBox}>
//       <CustomText style={home.statLabel}>TODAY</CustomText>
//       <View style={home.bookingText}>
//         <CustomText isBold={true} style={home.statValue}>
//           {filteredOrders ? filteredOrders.length : 0}
//         </CustomText>
//         <View style={{}}>
//           <CustomText style={home.statLabelSmall}>Bookings</CustomText>
//           <CustomText style={home.statLabelSmall}>Delivered</CustomText>
//         </View>
//       </View>
//     </View>
//   </View>
// </View>

//       {/* Main Section */}
//       {orders && filteredOrders?.length > 0 ? (
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


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import GetLocation from 'react-native-get-location';
import { getDistance } from 'geolib';
import useMapStore from '@utils/store/mapStore';
import useAuthStore from '@utils/store/authStore';
import CustomText from '@components/Ui/CustomText';
import { home } from '@assets/css/home';
import { AddRiderLocation } from '@utils/store/fireStore/firebaseStore';
import usePlaceOrder from '@utils/store/placeOrderStore';
import ActiveOrders from './components/ActiveOrders';
import BookingLoader from './components/BookingLoader';

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
  const locationRequestInProgress = useRef(false);



  const filteredOrders = useMemo(
    () => orders?.filter((val: any) => val.orderStatus <= 5 || val.orderStatus === 10) ?? [],
    [orders],
  );

  const updateRiderLocation = async (newLocation: { latitude: number; longitude: number }) => {
    // if (!user?.id) return;
    if (!user?.userId) return;
    // console.log("USER ==========> : ",user);
    try {
      await AddRiderLocation(
        // user.id,
        user.userId,
        newLocation.latitude,
        newLocation.longitude,
        heading
      );
    } catch (error) {
      console.error('Error updating rider location:', error);
    }
  };

  const getCurrentLocation = async () => {

    // // Skip if a request is already in progress
    // if (locationRequestInProgress.current) {
    //   return;
    // }

    // locationRequestInProgress.current = true;

    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      const newLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      // Calculate heading only if we've moved
      if (lastRecordedLocation.current) {
        const distance = getDistance(lastRecordedLocation.current, newLocation);

        if (distance >= MINIMUM_DISTANCE) {
          const deltaY = newLocation.latitude - lastRecordedLocation.current.latitude;
          const deltaX = newLocation.longitude - lastRecordedLocation.current.longitude;

          if (deltaX !== 0 || deltaY !== 0) {
            const head = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            const calculatedHeading = head >= 0 ? head : head + 360;
            setHeading(calculatedHeading);
          }

          setRiderLocation(newLocation);

          console.log("RIDERS NEW LOCATION UPDATE FROM HS ==========> : ",newLocation);

          fetchAddress(newLocation.latitude, newLocation.longitude, false);
          await updateRiderLocation(newLocation);

          console.log("RIDERS NEW LOCATION UPDATE FOR FIREBASE UPLOAD ==========> : ",newLocation);

          lastRecordedLocation.current = newLocation;
        }
      } else {
        // First location update
        setRiderLocation(newLocation);

        console.log("RIDERS NEW FIRST LOCATION UPDATE FROM HS ==========> : ",newLocation);
        
        fetchAddress(newLocation.latitude, newLocation.longitude, false);
        await updateRiderLocation(newLocation);

        console.log("RIDERS NEW FIRST LOCATION UPDATE FOR FIREBASE UPLOAD ==========> : ",newLocation);

        lastRecordedLocation.current = newLocation;
      }
    } catch (error: any) {
      if (error.message !== 'Location cancelled by another request') {
        console.error('Error fetching location:', error);
      }
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getUserOrders(token),
        getCurrentLocation(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // Set up location polling
  useEffect(() => {
    getCurrentLocation();

    locationRequestRef.current = setInterval(getCurrentLocation, LOCATION_UPDATE_INTERVAL);

    return () => {
      if (locationRequestRef.current) {
        clearInterval(locationRequestRef.current);
      }
    };
  }, []);

  // Fetch orders periodically
  useEffect(() => {
    const orderInterval = setInterval(() => {
      getUserOrders(token);
    }, LOCATION_UPDATE_INTERVAL);

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