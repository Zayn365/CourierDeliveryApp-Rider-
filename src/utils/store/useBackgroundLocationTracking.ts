import React from 'react';
import NativeLocationTracking from '../../../specs/NativeLocationTracking';
import useAuthStore from './authStore';
import { requestLocationPermission } from '@utils/permissions/locationPermission';

const useBackgroundLocationTracking = () => {
  const { user } = useAuthStore();

  React.useEffect(() => {
    const startTracking = async () => {
      if (!user || !NativeLocationTracking) return;

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('Permissions denied');
        return;
      }

      try {
        await NativeLocationTracking.startBackgroundTracking(5000, user.userId);
        console.log('Background tracking started');
      } catch (error: any) {
        console.error('Error starting background tracking:', error.code, error.message);
      }
    };

    startTracking();

    return () => {
      if (user && NativeLocationTracking) {
        try {
          NativeLocationTracking.stopBackgroundTracking();
          console.log('Location tracking stopped');
        } catch (error) {
          console.error('Error stopping background tracking:', error);
        }
      }
    };
  }, [user]);
};
export default useBackgroundLocationTracking;

// // import React from 'react';
// // import NativeLocationTracking from 'specs/NativeLocationTracking';
// // import useAuthStore from './authStore';
// // import { requestLocationPermission } from '@utils/permissions/locationPermission';

// // const useBackgroundLocationTracking = () => {
// //   const { user } = useAuthStore();

// //   React.useEffect(() => {
// //     const startTracking = async () => {
// //       if (!user || !NativeLocationTracking) {
// //         console.log('User or NativeLocationTracking not available');
// //         return;
// //       }

// //       const hasPermission = await requestLocationPermission();
// //       if (!hasPermission) {
// //         console.log('Location permissions denied');
// //         return;
// //       }

// //       try {
// //         await NativeLocationTracking.startBackgroundTracking(
// //           {
// //             interval: 5000, // Requested interval; native code enforces a 15s minimum
// //             userId: user.userId,
// //           },
// //           (location) => {
// //             console.log('Location Update:', {
// //               latitude: location.latitude,
// //               longitude: location.longitude,
// //               accuracy: location.accuracy,
// //               timestamp: location.timestamp,
// //               heading: location.heading,
// //             });
// //             // Add logic here to handle location updates (e.g., update state)
// //           }
// //         );
// //         console.log('Background tracking started');
// //       } catch (error:any) {
// //         console.error('Error starting background tracking:', error.code, error.message);
// //       }
// //     };

// //     startTracking();

// //     // Cleanup function
// //     return () => {
// //       if (user && NativeLocationTracking) {
// //         NativeLocationTracking.stopBackgroundTracking()
// //           .then(() => console.log('Location tracking stopped'))
// //           .catch((error) => console.error('Error stopping background tracking:', error));
// //       }
// //     };
// //   }, [user]);

// //   // Optionally return a value if needed (e.g., current location)
// //   // return null; // Uncomment and modify if you want to return something
// // };

// // export default useBackgroundLocationTracking;

// import React from 'react';
// import NativeLocationTracking from '../../../specs/NativeLocationTracking';
// import useAuthStore from './authStore';
// import { requestLocationPermission } from '@utils/permissions/locationPermission';

// const useBackgroundLocationTracking = () => {
//   const { user } = useAuthStore();

//   React.useEffect(() => {
//     const initTracking = async () => {
//       if (!user || !NativeLocationTracking) {
//         console.log('User or NativeLocationTracking not available');
//         return;
//       }

//       const hasPermission = await requestLocationPermission();
//       if (!hasPermission) {
//         console.log('Location permissions denied');
//         return;
//       }

//       try {
//         // Request exemption from battery optimizations
//         await NativeLocationTracking.requestBatteryOptimizationsExemption();
//         console.log('Requested battery optimization exemption');

//         // Start background tracking
//         await NativeLocationTracking.startBackgroundTracking(5000, user.userId);
//         console.log('Background tracking started for user:', user.userId);
//       } catch (error) {
//         console.error('Error initializing tracking:', error);
//       }
//     };

//     initTracking();

//     return () => {
//       if (NativeLocationTracking) {
//         NativeLocationTracking.stopBackgroundTracking();
//         console.log('Background tracking stopped');
//       }
//     };
//   }, [user]); // Re-run only if user changes
// };

// export default useBackgroundLocationTracking;