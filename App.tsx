// // import * as React from 'react';
// // import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
// // import {
// //   NavigationContainer,
// //   NavigationContainerRef,
// //   Route,
// // } from '@react-navigation/native';
// // import SplashScreen from './src/screens/splashScreen/SplashScreen';
// // import AuthRouter from './src/navigation/AuthRouter';
// // import MainRouter from './src/navigation/MainRouter';
// // import useAuthStore from './src/utils/store/authStore';
// // import {GestureHandlerRootView} from 'react-native-gesture-handler';
// // import messaging from '@react-native-firebase/messaging';
// // import useChatStore from './src/utils/store/chatStore';
// // import Header from './src/components/Ui/Header';
// // import HeaderOther from './src/components/Ui/HeaderOther';
// // import notifee, { AndroidImportance } from '@notifee/react-native';

// // export default function App() {
// //   const [splashOn, setSplashOn] = React.useState<boolean>(false);
// //   const {user, initializeUser} = useAuthStore();
// //   const [notificationTemp, setTempNotification] = React.useState<any[]>([]);
// //   const {setNotification} = useChatStore();

// //   // Track active screen name
// //   const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
// //   const [activeScreen, setActiveScreen] = React.useState<string>('');
// //   // console.log('TCL ~ App ~ activeScreen:', activeScreen);

// //   React.useEffect(() => {
// //     setTimeout(() => {
// //       setSplashOn(true);
// //     }, 3000);
// //     initializeUser();
// //   }, [initializeUser]);

// //   React.useEffect(() => {
// //     async function getter() {
// //       const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
// //         console.log('FCM Message received in foreground:', remoteMessage);
// //         if (remoteMessage) {
// //           setTempNotification((prevNotifications: any) => [
// //             ...prevNotifications,
// //             remoteMessage.notification,
// //           ]);
// //           setNotification(notificationTemp);
// //         }
// //       });

// //       await messaging().setBackgroundMessageHandler(async remoteMessage => {
// //         console.log('FCM Message received in background:', remoteMessage);
// //       });

// //       return unsubscribe();
// //     }
// //     getter();
// //   });

// //   // React.useEffect(() => {
// //   //   async function getter() {
// //   //     // Foreground notification handling
// //   //     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
// //   //       console.log('FCM Message received in foreground:', remoteMessage);

// //   //       if (remoteMessage?.notification) {
// //   //         setTempNotification((prevNotifications: any) => [
// //   //           ...prevNotifications,
// //   //           remoteMessage.notification,
// //   //         ]);
// //   //         setNotification(notificationTemp);

// //   //         // Show notification using Notifee
// //   //         await notifee.requestPermission(); // Request permission (iOS)
// //   //         await notifee.displayNotification({
// //   //           title: remoteMessage.notification.title,
// //   //           body: remoteMessage.notification.body,
// //   //           android: {
// //   //             channelId: 'default',
// //   //             importance: AndroidImportance.HIGH,
// //   //             smallIcon: 'ic_notification', // Ensure this icon exists in res/drawable
// //   //           },
// //   //         });
// //   //       }
// //   //     });

// //   //     // Background & Quit state notifications
// //   //     await messaging().setBackgroundMessageHandler(async (remoteMessage) => {
// //   //       console.log('FCM Message received in background:', remoteMessage);
// //   //     });

// //   //     return unsubscribe;
// //   //   }
// //   //   getter();
// //   // }, []);

// //   return (
// //     <SafeAreaView style={style.safeArea}>
// //       <StatusBar backgroundColor={'rgba(255, 0, 0, 0.95)'}/>
// //       {!splashOn ? (
// //         <SplashScreen />
// //       ) : !user ? (
// //         <NavigationContainer>
// //           <AuthRouter />
// //         </NavigationContainer>
// //       ) : (
// //         <NavigationContainer
// //           ref={navigationRef}
// //           onStateChange={() => {
// //             const currentRoute: Route<string, any> | Route<string> | undefined =
// //               navigationRef.current?.getCurrentRoute();
// //             setActiveScreen(currentRoute?.name || '');
// //           }}>
// //           <GestureHandlerRootView>
// //             {activeScreen === 'HomeScreen' || activeScreen === '' ? (
// //               <Header />
// //             ) : activeScreen !== 'Map' ? (
// //               <HeaderOther headerName={activeScreen} />
// //             ) : null}
// //             <MainRouter />
// //           </GestureHandlerRootView>
// //         </NavigationContainer>
// //       )}
// //     </SafeAreaView>
// //   );
// // }

// // const style = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //   },
// // });

import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
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

