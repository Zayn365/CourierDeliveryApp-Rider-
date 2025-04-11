// import { PermissionsAndroid, Platform } from 'react-native';

// export const requestLocationPermission = async (): Promise<boolean> => {
//   if (Platform.OS !== 'android') return true;

//   try {
//     const granted = await PermissionsAndroid.requestMultiple([
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
//     ]);

//     const fineLocationGranted = 
//       granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
    
//     const backgroundLocationGranted = 
//       granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;

//     if (fineLocationGranted) {
//       console.log('Location permission granted');
//       return true;
//     } else {
//       console.log('Location permission denied');
//       return false;
//     }
//   } catch (err) {
//     console.warn('Error requesting location permission:', err);
//     return false;
//   }
// };

import { Platform, PermissionsAndroid } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    ]);

    const fineGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted';
    const backgroundGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] === 'granted';

    return fineGranted && backgroundGranted;
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
};