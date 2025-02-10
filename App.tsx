import * as React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
  Route,
} from '@react-navigation/native';
import SplashScreen from './src/screens/splashScreen/SplashScreen';
import AuthRouter from './src/navigation/AuthRouter';
import MainRouter from './src/navigation/MainRouter';
import useAuthStore from './src/utils/store/authStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import useChatStore from './src/utils/store/chatStore';
import Header from './src/components/Ui/Header';
import HeaderOther from './src/components/Ui/HeaderOther';

export default function App() {
  const [splashOn, setSplashOn] = React.useState<boolean>(false);
  const {user, initializeUser} = useAuthStore();
  const [notificationTemp, setTempNotification] = React.useState<any[]>([]);
  const {setNotification} = useChatStore();

  // Track active screen name
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
  const [activeScreen, setActiveScreen] = React.useState<string>('');
  // console.log('TCL ~ App ~ activeScreen:', activeScreen);

  React.useEffect(() => {
    setTimeout(() => {
      setSplashOn(true);
    }, 3000);
    initializeUser();
  }, [initializeUser]);

  React.useEffect(() => {
    async function getter() {
      const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
        console.log('FCM Message received in foreground:', remoteMessage);
        if (remoteMessage) {
          setTempNotification((prevNotifications: any) => [
            ...prevNotifications,
            remoteMessage.notification,
          ]);
          setNotification(notificationTemp);
        }
      });

      await messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('FCM Message received in background:', remoteMessage);
      });

      return unsubscribe();
    }
    getter();
  });

  return (
    <SafeAreaView style={style.safeArea}>
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
