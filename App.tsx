// import * as React from 'react';
// import { SafeAreaView, StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
// import {
//   NavigationContainer,
//   NavigationContainerRef,
//   Route,
// } from '@react-navigation/native';
// import SplashScreen from './src/screens/splashScreen/SplashScreen';
// import AuthRouter from './src/navigation/AuthRouter';
// import MainRouter from './src/navigation/MainRouter';
// import useAuthStore from './src/utils/store/authStore';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import messaging from '@react-native-firebase/messaging';
// import useChatStore from './src/utils/store/chatStore';
// import Header from './src/components/Ui/Header';
// import HeaderOther from './src/components/Ui/HeaderOther';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import SystemNavigationBar from 'react-native-system-navigation-bar';
// import { Toast, toastConfig } from '@components/Ui/CustomToast';
// import { useLocationService } from '@utils/store/useLocationService';
// import LocationRequirementsScreen from '@screens/locationRequirements/LocationRequirementsScreen';
// // @ts-ignore
// import { BatteryOptEnabled, OpenOptimizationSettings } from 'react-native-battery-optimization-check';
// import { Platform } from 'react-native';

// export default function App() {
//   const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
//   const [splashOn, setSplashOn] = React.useState<boolean>(false);
//   const { user, initializeUser, isLoading } = useAuthStore();
//   const { setNotification } = useChatStore();
//   const [notificationTemp, setTempNotification] = React.useState<any[]>([]);
//   const [activeScreen, setActiveScreen] = React.useState<string>('');
//   const [isBatteryOptEnabled, setIsBatteryOptEnabled] = React.useState<boolean | null>(null);
//   const [showBatteryOptScreen, setShowBatteryOptScreen] = React.useState<boolean>(false);

//   // initialize user & chat on mount
//   React.useEffect(() => {
//     initializeUser();
//   }, [initializeUser]);

//   // request background messages token & handler
//   React.useEffect(() => {
//     messaging().getToken().then(token => console.log('[FCM] token:', token));
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('[FCM] BG message:', remoteMessage);
//     });
//   }, []);

//   // Battery optimization check (Android only)
//   React.useEffect(() => {
//     // if (Platform.OS === 'android' && Platform.Version >= 23 && user && splashOn && !isLoading) {
//       checkBatteryOptimization();
//     // }
//   }, [user, splashOn, isLoading]);

//   // Function to check battery optimization status
//   const checkBatteryOptimization = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const isEnabled = await BatteryOptEnabled();
//         console.log('[Battery Optimization] Status:', isEnabled ? 'enabled' : 'disabled');
//         setIsBatteryOptEnabled(isEnabled);
//         setShowBatteryOptScreen(isEnabled);
//       } catch (error) {
//         console.error('[Battery Optimization] Error checking status:', error);
//         setIsBatteryOptEnabled(null);
//       }
//     }
//   };

//   // Function to open battery optimization settings
//   const openBatterySettings = () => {
//     if (Platform.OS === 'android') {
//       OpenOptimizationSettings();
//     }
//   };

//   // notification permissions and foreground handling
//   React.useEffect(() => {
//     async function requestPermission() {
//       const settings = await notifee.requestPermission();
//       console.log('Notification Permission:', settings);
//     }
//     requestPermission();

//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('[FCM] FG message:', remoteMessage);
//       if (remoteMessage?.notification) {
//         const newNotifications = [...notificationTemp, remoteMessage.notification];
//         setTempNotification(newNotifications);
//         setNotification(newNotifications);
        
//         const channelId = await notifee.createChannel({
//           id: 'default',
//           name: 'Default Channel',
//           importance: AndroidImportance.HIGH,
//         });
        
//         await notifee.displayNotification({
//           title: remoteMessage.notification.title,
//           body: remoteMessage.notification.body,
//           android: { channelId, importance: AndroidImportance.HIGH, smallIcon: 'ic_notification' },
//         });
//       }
//     });

//     return unsubscribe;
//   }, [notificationTemp, setNotification]);

//   // splash & nav bar color
//   React.useEffect(() => {
//     SystemNavigationBar.setNavigationColor('#ED1C24');
//     setTimeout(() => {
//       setSplashOn(true);
//       SystemNavigationBar.setNavigationColor('#fff');
//     }, 3000);
//   }, []);

//   // location service hook (enabled after user sign-in & splash)
//   const {
//     hasLocationPermission,
//     isGpsEnabled,
//     requestLocationPermission,
//     checkGpsStatus,
//   } = useLocationService(!!user && splashOn && !isLoading);

//   // Render appropriate header based on active screen
//   const renderHeaderComponent = () => {
//     if (activeScreen === 'HomeScreen' || activeScreen === '') {
//       return <Header />;
//     } else if (activeScreen !== 'Map') {
//       return <HeaderOther headerName={activeScreen === 'ParcelDetails' ? 'Consignment Details' :activeScreen} />;
//     }
//     return null;
//   };

//   // Component for Battery Optimization screen
//   const BatteryOptimizationScreen = () => (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
//       <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
//         Battery Optimization
//       </Text>
//       <Text style={{ textAlign: 'center', marginBottom: 20 }}>
//         To ensure this app works properly in the background, please disable battery optimization for this app.
//       </Text>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
//         <View style={{ 
//           backgroundColor: '#ED1C24',
//           paddingVertical: 12,
//           paddingHorizontal: 24,
//           borderRadius: 8,
//         }}>
//           <Text 
//             style={{ color: '#fff', fontWeight: 'bold' }}
//             onPress={() => {
//               openBatterySettings();
//               // We'll recheck after settings are opened
//               setTimeout(checkBatteryOptimization, 1000);
//             }}
//           >
//             Open Settings
//           </Text>
//         </View>
//         <View style={{ 
//           backgroundColor: '#eeeeee',
//           paddingVertical: 12,
//           paddingHorizontal: 24,
//           borderRadius: 8,
//         }}>
//           <Text 
//             style={{ color: '#333' }}
//             onPress={() => setShowBatteryOptScreen(false)}
//           >
//             Skip For Now
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   // ------- App State Rendering Logic -------

//   // Case 1: Show splash screen while loading or during splash duration
//   if (isLoading || !splashOn) {
//     return <SplashScreen />;
//   }

//   // Case 2: Show loading indicator when checking location permissions
//   if (user && hasLocationPermission === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#ED1C24" />
//         <Text style={{ marginTop: 10, color:'#fff' }}>Checking location services...</Text>
//       </View>
//     );
//   }

//   // Case 3: Show location requirements screen when permissions not granted
//   if (user && (!hasLocationPermission || !isGpsEnabled)) {
//     return (
//       <SafeAreaView style={style.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
//         <Header />
//         <LocationRequirementsScreen
//           hasLocationPermission={hasLocationPermission}
//           isGpsEnabled={isGpsEnabled ?? null}
//           onRequestPermission={requestLocationPermission}
//           onCheckGps={checkGpsStatus}
//         />
//         <Toast config={toastConfig} />
//       </SafeAreaView>
//     );
//   }

//   // Case 3.5: Show battery optimization screen if needed
//   if (user && showBatteryOptScreen && Platform.OS === 'android') {
//     return (
//       <SafeAreaView style={style.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
//         <Header />
//         {/* <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//           <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
//             Battery Optimization is required.
//           </Text>
//         </View> */}
//         <BatteryOptimizationScreen />
//         <Toast config={toastConfig} />
//       </SafeAreaView>
//     );
//   }

//   // Case 4: Show main application when user is authenticated with proper permissions
//   if (user) {
//     return (
//       <>
//         <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
//         <SafeAreaView style={style.safeArea}>
//           <GestureHandlerRootView style={{ flex: 1 }}>
//             <NavigationContainer
//               ref={navigationRef}
//               onStateChange={() => {
//                 const currentRoute = navigationRef.current?.getCurrentRoute();
//                 setActiveScreen(currentRoute?.name || '');
//               }}>
//               {renderHeaderComponent()}
//               <MainRouter />
//             </NavigationContainer>
//           </GestureHandlerRootView>
//         </SafeAreaView>
//         <Toast config={toastConfig} />
//       </>
//     );
//   }

//   // Case 5: Show authentication flow when no user is logged in
//   return (
//     <>
//       <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
//       <SafeAreaView style={style.safeArea}>
//         <NavigationContainer>
//           <AuthRouter />
//         </NavigationContainer>
//       </SafeAreaView>
//       <Toast config={toastConfig} />
//     </>
//   );
// }

// const style = StyleSheet.create({
//   safeArea: { flex: 1 },
// });

import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
  Route,
} from '@react-navigation/native';
import SplashScreen from './src/screens/splashScreen/SplashScreen';
import AuthRouter from './src/navigation/AuthRouter';
import MainRouter from './src/navigation/MainRouter';
import useAuthStore from './src/utils/store/authStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import useChatStore from './src/utils/store/chatStore';
import Header from './src/components/Ui/Header';
import HeaderOther from './src/components/Ui/HeaderOther';
import notifee, { AndroidImportance } from '@notifee/react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Toast, toastConfig } from '@components/Ui/CustomToast';
import { useLocationService } from '@utils/store/useLocationService';
import LocationRequirementsScreen from '@screens/locationRequirements/LocationRequirementsScreen';
// @ts-ignore
import { BatteryOptEnabled, OpenOptimizationSettings } from 'react-native-battery-optimization-check';
import { Platform } from 'react-native';

export default function App() {
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
  const [splashOn, setSplashOn] = React.useState<boolean>(false);
  const { user, token, initializeUser, isLoading } = useAuthStore(); // Added token to dependencies
  const { setNotification } = useChatStore();
  const [notificationTemp, setTempNotification] = React.useState<any[]>([]);
  const [activeScreen, setActiveScreen] = React.useState<string>('');
  const [isBatteryOptEnabled, setIsBatteryOptEnabled] = React.useState<boolean | null>(null);
  const [showBatteryOptScreen, setShowBatteryOptScreen] = React.useState<boolean>(false);

  // initialize user & chat on mount
  React.useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Add a useEffect to monitor user/token changes for debugging
  React.useEffect(() => {
    console.log('App.tsx - User state changed:', user ? 'User exists' : 'No user');
    console.log('App.tsx - Token state changed:', token ? 'Token exists' : 'No token');
  }, [user, token]);

  // request background messages token & handler
  React.useEffect(() => {
    messaging().getToken().then(token => console.log('[FCM] token:', token));
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('[FCM] BG message:', remoteMessage);
    });
  }, []);

  // Battery optimization check (Android only)
  React.useEffect(() => {
    // if (Platform.OS === 'android' && Platform.Version >= 23 && user && splashOn && !isLoading) {
      checkBatteryOptimization();
    // }
  }, []);

  // Function to check battery optimization status
  const checkBatteryOptimization = async () => {
    if (Platform.OS === 'android') {
      try {
        const isEnabled = await BatteryOptEnabled();
        console.log('[Battery Optimization] Status:', isEnabled ? 'enabled' : 'disabled');
        setIsBatteryOptEnabled(isEnabled);
        setShowBatteryOptScreen(isEnabled);
      } catch (error) {
        console.error('[Battery Optimization] Error checking status:', error);
        setIsBatteryOptEnabled(null);
      }
    }
  };

  // Function to open battery optimization settings
  const openBatterySettings = () => {
    if (Platform.OS === 'android') {
      OpenOptimizationSettings();
    }
  };

  // notification permissions and foreground handling
  React.useEffect(() => {
    async function requestPermission() {
      const settings = await notifee.requestPermission();
      console.log('Notification Permission:', settings);
    }
    requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[FCM] FG message:', remoteMessage);
      if (remoteMessage?.notification) {
        const newNotifications = [...notificationTemp, remoteMessage.notification];
        setTempNotification(newNotifications);
        setNotification(newNotifications);
        
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
        
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: { channelId, importance: AndroidImportance.HIGH, smallIcon: 'ic_notification' },
        });
      }
    });

    return unsubscribe;
  }, [notificationTemp, setNotification]);

  // splash & nav bar color
  React.useEffect(() => {
    SystemNavigationBar.setNavigationColor('#ED1C24');
    setTimeout(() => {
      setSplashOn(true);
      SystemNavigationBar.setNavigationColor('#fff');
    }, 3000);
  }, []);

  // location service hook (enabled after user sign-in & splash)
  const {
    hasLocationPermission,
    isGpsEnabled,
    requestLocationPermission,
    checkGpsStatus,
  } = useLocationService(!!user && !!token && splashOn && !isLoading); // Added token check

  // Render appropriate header based on active screen
  const renderHeaderComponent = () => {
    if (activeScreen === 'HomeScreen' || activeScreen === '') {
      return <Header />;
    } else if (activeScreen !== 'Map') {
      return <HeaderOther headerName={activeScreen === 'ParcelDetails' ? 'Consignment Details' :activeScreen} />;
    }
    return null;
  };

  // Component for Battery Optimization screen
  const BatteryOptimizationScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Battery Optimization
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        To ensure this app works properly in the background, please disable battery optimization for this app.
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <View style={{ 
          backgroundColor: '#ED1C24',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}>
          <Text 
            style={{ color: '#fff', fontWeight: 'bold' }}
            onPress={() => {
              openBatterySettings();
              // We'll recheck after settings are opened
              setTimeout(checkBatteryOptimization, 1000);
            }}
          >
            Open Settings
          </Text>
        </View>
        <View style={{ 
          backgroundColor: '#eeeeee',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}>
          <Text 
            style={{ color: '#333' }}
            onPress={() => setShowBatteryOptScreen(false)}
          >
            Skip For Now
          </Text>
        </View>
      </View>
    </View>
  );

  // ------- App State Rendering Logic -------

  // Case 1: Show splash screen while loading or during splash duration
  if (isLoading || !splashOn) {
    return <SplashScreen />;
  }

  // Add extra check to ensure both user and token exist
  const isUserAuthenticated = user && token;
  console.log('App.tsx - Is user authenticated:', isUserAuthenticated);

  // Case 2: Show loading indicator when checking location permissions
  if (isUserAuthenticated && hasLocationPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ED1C24" />
        <Text style={{ marginTop: 10, color:'#fff' }}>Checking location services...</Text>
      </View>
    );
  }

  // Case 3: Show location requirements screen when permissions not granted
  if (isUserAuthenticated && (!hasLocationPermission || !isGpsEnabled)) {
    return (
      <SafeAreaView style={style.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
        <Header />
        <LocationRequirementsScreen
          hasLocationPermission={hasLocationPermission}
          isGpsEnabled={isGpsEnabled ?? null}
          onRequestPermission={requestLocationPermission}
          onCheckGps={checkGpsStatus}
        />
        <Toast config={toastConfig} />
      </SafeAreaView>
    );
  }

  // Case 3.5: Show battery optimization screen if needed
  if (isUserAuthenticated && showBatteryOptScreen && Platform.OS === 'android') {
    return (
      <SafeAreaView style={style.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
        <Header />
        <BatteryOptimizationScreen />
        <Toast config={toastConfig} />
      </SafeAreaView>
    );
  }

  // Case 4: Show main application when user is authenticated with proper permissions
  if (isUserAuthenticated) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
        <SafeAreaView style={style.safeArea}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer
              ref={navigationRef}
              onStateChange={() => {
                const currentRoute = navigationRef.current?.getCurrentRoute();
                setActiveScreen(currentRoute?.name || '');
              }}>
              {renderHeaderComponent()}
              <MainRouter />
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaView>
        <Toast config={toastConfig} />
      </>
    );
  }

  // Case 5: Show authentication flow when no user is logged in
  console.log('App.tsx - Showing auth screens');
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'#ED1C24'} />
      <SafeAreaView style={style.safeArea}>
        <NavigationContainer>
          <AuthRouter />
        </NavigationContainer>
      </SafeAreaView>
      <Toast config={toastConfig} />
    </>
  );
}

const style = StyleSheet.create({
  safeArea: { flex: 1 },
});