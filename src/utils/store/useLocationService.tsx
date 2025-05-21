import { errorToast } from '@components/Ui/CustomToast';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { RESULTS } from 'react-native-permissions';

export const useLocationService = (enabled: boolean) => {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean | null>(null);
  const lastGpsStatus = useRef<boolean>(true); 

    const openLocationSettings = () => {
      if (Platform.OS === 'android') {
        Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
          .catch(() => Linking.openSettings());
      } else {
        Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      }
    };

    useEffect(() => {
      if (!enabled) return;
    
      const intervalId = setInterval(async () => {
        const gpsEnabled = await isLocationEnabled();
        setIsGpsEnabled(gpsEnabled);
    
        // console.log('lastGpsStatus:', lastGpsStatus.current, 'current:', gpsEnabled);
    
        // if (lastGpsStatus.current && !gpsEnabled) {
        //   errorToast('GPS has been turned off');
        // }
    
        // lastGpsStatus.current = gpsEnabled; // ✅ always update the ref
      }, 5000);
    
      return () => clearInterval(intervalId);
    }, [enabled]);

  // const requestLocationPermission = useCallback(async (): Promise<boolean> => {
  //   console.log('[LocationService] → requestLocationPermission start');
  //   try {
  //     const already = await PermissionsAndroid.check(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     console.log('[LocationService] already granted?', already);

  //     if (!already) {
  //       const fine = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );
  //       console.log('[LocationService] ACCESS_FINE_LOCATION result:', fine);

  //       if (Number(Platform.Version) >= 29) {
  //         const bg = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
  //         );
  //         console.log('[LocationService] ACCESS_BACKGROUND_LOCATION result:', bg);
  //         setHasLocationPermission(bg === RESULTS.GRANTED);
  //         return bg === RESULTS.GRANTED;
  //       }

  //       setHasLocationPermission(fine === RESULTS.GRANTED);
  //       return fine === RESULTS.GRANTED;
  //     }

  //     console.log('[LocationService] permission already granted');
  //     setHasLocationPermission(true);
  //     return true;
  //   } catch (err) {
  //     console.error('[LocationService] requestLocationPermission ERROR:', err);
  //     return false;
  //   }
  // }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    console.log('[LocationService] → requestLocationPermission start');
    try {
      // Check if fine location is already granted
      const fineLocationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log('[LocationService] fine location already granted?', fineLocationGranted);
  
      // For Android 10+ (API 29+), also check background location
      if (Number(Platform.Version) >= 29) {
        const backgroundLocationGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        console.log('[LocationService] background location already granted?', backgroundLocationGranted);
        
        // If either permission is not granted, we need to request missing permissions
        if (!fineLocationGranted || !backgroundLocationGranted) {
          // Request fine location first if needed
          let fineLocationResult = fineLocationGranted ? 'granted' : 'denied';
          if (!fineLocationGranted) {
            fineLocationResult = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            console.log('[LocationService] ACCESS_FINE_LOCATION result:', fineLocationResult);
          }
          
          // Only proceed with background location if fine location is granted
          if (fineLocationResult === 'granted') {
            // Request background location if needed
            let backgroundLocationResult = backgroundLocationGranted ? 'granted' : 'denied';
            if (!backgroundLocationGranted) {
              backgroundLocationResult = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
              );
              console.log('[LocationService] ACCESS_BACKGROUND_LOCATION result:', backgroundLocationResult);
            }
            
            // Check results for both permissions
            const hasAllPermissions = 
              fineLocationResult === 'granted' && 
              backgroundLocationResult === 'granted';
            
            // If permissions were denied, provide guidance to the user
            if (!hasAllPermissions) {
              if (backgroundLocationResult === 'denied' || backgroundLocationResult === 'never_ask_again') {
                // For React Native permissions, handling denial
                Alert.alert(
                  "Background Location Required",
                  "Background location permission was denied. This feature requires background location to work properly. Please enable it in app settings.",
                  [
                    {
                      text: "Open Settings",
                      onPress: () => {
                        // Open app settings so user can enable permissions manually
                        Linking.openSettings();
                      }
                    },
                    {
                      text: "Cancel",
                      style: "cancel"
                    }
                  ]
                );
              }
            }
            
            setHasLocationPermission(hasAllPermissions);
            return hasAllPermissions;
          } else {
            // Fine location permission denied
            if (fineLocationResult === 'denied' || fineLocationResult === 'never_ask_again') {
              // Display guidance for fine location as well
              Alert.alert(
                "Location Permission Required",
                "Location permission was denied. This feature requires location to work properly. Please enable it in app settings.",
                [
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings()
                  },
                  {
                    text: "Cancel",
                    style: "cancel"
                  }
                ]
              );
            }
            
            setHasLocationPermission(false);
            return false;
          }
        } else {
          // Both permissions already granted
          console.log('[LocationService] all permissions already granted');
          setHasLocationPermission(true);
          return true;
        }
      } else {
        // For Android 9 and below, only need fine location
        if (!fineLocationGranted) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          console.log('[LocationService] ACCESS_FINE_LOCATION result:', result);
          
          if (result === 'denied' || result === 'never_ask_again') {
            Alert.alert(
              "Location Permission Required",
              "Location permission was denied. This feature requires location to work properly. Please enable it in app settings.",
              [
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings()
                },
                {
                  text: "Cancel",
                  style: "cancel"
                }
              ]
            );
          }
          
          setHasLocationPermission(result === 'granted');
          return result === 'granted';
        } else {
          console.log('[LocationService] permission already granted');
          setHasLocationPermission(true);
          return true;
        }
      }
    } catch (err) {
      console.error('[LocationService] requestLocationPermission ERROR:', err);
      return false;
    }
  }, []);

  const checkGpsStatus = useCallback(async (): Promise<boolean> => {
    console.log('[LocationService] → checkGpsStatus');
    
    if (Platform.OS !== 'android') {
      console.log('[LocationService] Not Android platform, skipping GPS check');
      return true;
    }
    
    try {
      const locationEnabled = await isLocationEnabled();
      console.log('[LocationService] GPS enabled?', locationEnabled);
      setIsGpsEnabled(locationEnabled);
      
      if (!locationEnabled) {
        console.log('[LocationService] GPS disabled → prompting user');
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          console.log('[LocationService] Enable result:', enableResult);
          
          // Update state based on result
          const isNowEnabled = enableResult === 'enabled' || enableResult === 'already-enabled';
          setIsGpsEnabled(isNowEnabled);
          return isNowEnabled;
        } catch (error) {
          if (error instanceof Error) {
            console.error('[LocationService] GPS resolution ERROR:', error.message);
            
            // Handle case where user declined or there was an error
            Alert.alert(
              'GPS Required',
              'Please enable location services in Settings to proceed.',
              [{ text: 'Open Settings', onPress: openLocationSettings }]
            );
          }
          return false;
        }
      }
      
      return locationEnabled;
    } catch (err) {
      console.error('[LocationService] checkGpsStatus ERROR:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      console.log('[LocationService] disabled, skipping init');
      return;
    }

    (async () => {
      console.log('[LocationService] init → requesting permission');
      await requestLocationPermission();

      console.log('[LocationService] init → checking GPS status');
      await checkGpsStatus();

      console.log('[LocationService] init complete');
    })();
  }, [enabled, requestLocationPermission, checkGpsStatus]);

  return {
    hasLocationPermission,
    isGpsEnabled,
    requestLocationPermission,
    checkGpsStatus,
  };
};