import * as React from 'react';
import { Alert, PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
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
import NativeLocationTracking from './specs/NativeLocationTracking';

export default function App() {
  const [splashOn, setSplashOn] = React.useState<boolean>(false);
  const { user, initializeUser } = useAuthStore();
  const [notificationTemp, setTempNotification] = React.useState<any[]>([]);
  const { setNotification } = useChatStore();

  // Track active screen name
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
  const [activeScreen, setActiveScreen] = React.useState<string>('');

  React.useEffect(() => {
    SystemNavigationBar.setNavigationColor('#ED1C24');
    // SystemNavigationBar.setNavigationColor('#fff');
  }, []);

  // Use useEffect to handle permissions and tracking on component mount
   // Improved location tracking effect
   React.useEffect(() => {
    let trackingInterval: NodeJS.Timeout | null = null;

    const requestPermissionsAndTrack = async () => {
      try {
        // Request multiple permissions at once
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);

        // Check if both permissions are granted
        if (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Location Permissions granted');

          // Ensure NativeLocationTracking exists before calling methods
          if (NativeLocationTracking) {
            // Start background tracking with a 5-second interval
            NativeLocationTracking.startBackgroundTracking(5000);

            // Get initial position
            NativeLocationTracking.getCurrentPosition()
              .then(position => {
                console.log('Initial position:', position);
              })
              .catch(error => console.error('Error getting initial position:', error));

            // Set up interval logging
            trackingInterval = setInterval(() => {
              if (NativeLocationTracking) {
                NativeLocationTracking.getCurrentPosition()
                  .then(position => {
                    console.log('Current location:', position);
                  })
                  .catch(error => console.error('Error getting current position:', error));
              }
            }, 5000);
          } else {
            console.error('NativeLocationTracking module is not available');
          }
        } else {
          console.log('Location Permissions denied');
        }
      } catch (err) {
        console.warn('Location Permission request error:', err);
      }
    };

    // Call the async function
    requestPermissionsAndTrack();

    // Clean up interval on component unmount
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount


  React.useEffect(() => {
    setTimeout(() => {
      setSplashOn(true);
      SystemNavigationBar.setNavigationColor('#fff');
    }, 3000);
    initializeUser();
  }, [initializeUser]);

  // ✅ Step 3: Request Notification Permissions
  React.useEffect(() => {
    async function requestPermission() {
      const settings = await notifee.requestPermission();
      console.log('Notification Permission:', settings);
    }
    requestPermission();
  }, []);

  // ✅ Step 4: Get FCM Token for Debugging
  React.useEffect(() => {
    async function getToken() {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    }
    getToken();
  }, []);

  // ✅ Step 5: Handle Foreground Notifications (FCM does not show notifications automatically)
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message received in foreground:', remoteMessage);

      if (remoteMessage?.notification) {
        setTempNotification((prevNotifications: any) => [
          ...prevNotifications,
          remoteMessage.notification,
        ]);
        setNotification(notificationTemp);

        // Create a notification channel (Required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        // Show notification using Notifee
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_notification', // Ensure this exists in res/drawable
          },
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={style.safeArea}>
      <StatusBar backgroundColor={'#ED1C24'} />
      {!splashOn ? (
        <SplashScreen />
      ) : !user ? (
        <NavigationContainer>
          <AuthRouter />
        </NavigationContainer>
      ) : (
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => {
            const currentRoute: Route<string, any> | Route<string> | undefined =
              navigationRef.current?.getCurrentRoute();
            setActiveScreen(currentRoute?.name || '');
          }}>
          <GestureHandlerRootView>
            {activeScreen === 'HomeScreen' || activeScreen === '' ? (
              <Header />
            ) : activeScreen !== 'Map' ? (
              <HeaderOther headerName={activeScreen} />
            ) : null}
            <MainRouter />
          </GestureHandlerRootView>
        </NavigationContainer>
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

