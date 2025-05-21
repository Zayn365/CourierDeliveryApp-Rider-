// import React from 'react';
// import { View, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
// import Icons from '@utils/imagePaths/imagePaths';
// import CustomText from '@components/Ui/CustomText';
// import useAuthStore from '@utils/store/authStore';
// import { infoToast } from '@components/Ui/CustomToast';

// interface ProfileData {
//   fullName: string;
//   phoneNumber: string;
//   cnicNumber: string;
//   cnicExpiry: string;
//   drivingLicense: string;
//   drivingLicenseExpiry: string;
//   vehicleRegistration: string;
// }

// const formatDateToMonthYear = (dateString: string): string => {
//   try {
//     const date = new Date(dateString);
    
//     // Check if the date is valid
//     if (isNaN(date.getTime())) {
//       throw new Error('Invalid date');
//     }

//     // Get month (0-11, so add 1) and format to two digits
//     const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//     // Get last two digits of the year
//     const year = date.getUTCFullYear().toString().slice(-2);

//     return `${month}/${year}`;
//   } catch (error) {
//     console.error('Error formatting date:', error);
//     return 'Invalid Date';
//   }
// };

// const Profile: React.FC = () => {

//   const { user, token } = useAuthStore();

//   // Safely handle the licenceExpiry date
//   const drivingLicenseExpiryDate = user?.licenceExpiry
//     ? formatDateToMonthYear(user.licenceExpiry) // TypeScript now knows licenceExpiry is string
//     : 'Not Available'; // Fallback for null/undefined

//   const cnicExpiryDate = user?.cnicExpiry
//     ? formatDateToMonthYear(user.cnicExpiry) // TypeScript now knows createdAt is string
//     : 'Not Available'; // Fallback for null/undefined

//   console.log("user", user);
  
//   // Sample data - in a real app, this would come from props or context
//   const profileData: ProfileData = {
//     fullName: user?.name ||'Mohammad Ibrahim Khan',
//     phoneNumber: user?.mobile || '03452467040',
//     cnicNumber: user?.cnic || '4210167906179',
//     cnicExpiry:
//     //  user?.createdAt|| 
//      '01/28',
//     drivingLicense: user?.licenceNo || '4210167906179#987',
//     drivingLicenseExpiry: 
//     user?.licenceExpiry ||
//      '03/26',
//     vehicleRegistration: user?.vehicleRegNo || 'KQF-2871',
//   };

//   const handleUploadPhoto = () => {
//     // Implement photo upload functionality
//     infoToast('This feature is not implemented yet.');
//     // Alert.alert('Upload Photo', 'This feature is not implemented yet.');
//     // console.log('Upload photo button pressed');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.profileContainer}>
//         {/* Profile Picture */}
//         <View style={styles.profileImageContainer}>
//           <Image 
//             source={Icons.ProfileAvatar} 
//             style={styles.profileImage}
//             resizeMode="contain"
//           />
//         </View>

//         {/* Upload Button */}
//         <TouchableOpacity
//           style={styles.uploadButton}
//           onPress={handleUploadPhoto}
//         >
//           <CustomText style={styles.uploadButtonText}>Upload Photograph</CustomText>
//         </TouchableOpacity>

//         {/* Profile Details */}
//         <View style={styles.detailsContainer}>
//           {/* Full Name */}
//           <View style={styles.detailRow}>
//             <CustomText style={styles.detailLabel}>FULL NAME</CustomText>
//             <CustomText style={styles.detailValue}>{profileData.fullName}</CustomText>
//           </View>

//           {/* Phone Number */}
//           <View style={styles.detailRow}>
//             <CustomText style={styles.detailLabel}>PHONE NUMBER</CustomText>
//             <CustomText style={styles.detailValue}>{profileData.phoneNumber}</CustomText>
//           </View>

//           {/* CNIC */}
//           <View style={styles.detailRow}>
//             <CustomText style={styles.detailLabel}>CNIC #</CustomText>
//             <View style={styles.valueWithExpiry}>
//               <CustomText style={styles.detailValue}>{profileData.cnicNumber}</CustomText>
//               {/* <CustomText style={styles.expiryText}>Exp: <CustomText style={styles.expiryTextValue}>{cnicExpiryDate}</CustomText></CustomText> */}
//             </View>
//           </View>

//           {/* Driving License */}
//           <View style={styles.detailRow}>
//             <CustomText style={styles.detailLabel}>DRIVING LICENSE #</CustomText>
//             <View style={styles.valueWithExpiry}>
//               <CustomText style={styles.detailValue}>{profileData.drivingLicense}</CustomText>
//               <CustomText style={styles.expiryText}>Exp: <CustomText style={styles.expiryTextValue}>{drivingLicenseExpiryDate}</CustomText></CustomText>
//             </View>
//           </View>

//           {/* Vehicle Registration */}
//           <View style={styles.detailRow}>
//             <CustomText style={styles.detailLabel}>VEHICLE REGISTRATION #</CustomText>
//             <CustomText style={styles.detailValue}>{profileData.vehicleRegistration}</CustomText>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   profileContainer: {
//     paddingHorizontal: 30,
//     alignItems: 'center',
//     // backgroundColor: '#e61919',
//   },
//   profileImageContainer: {
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: '#e5e7eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 40,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//   },
//   uploadButton: {
//     backgroundColor: '#e61919',
//     paddingVertical: 9,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginTop: 10,
//     marginBottom: 30,
//   },
//   uploadButtonText: {
//     color: 'white',
//     fontWeight: '500',
//     fontSize: 15,
//   },
//   detailsContainer: {
//     width: '100%',
//   },
//   detailRow: {
//     marginBottom: 20,
//     marginRight: 20,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   detailValue: {
//     fontSize: 20,
//     color: '#334155',
//     fontWeight: '500',
//   },
//   valueWithExpiry: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   expiryText: {
//     fontSize: 18,
//     color: '#e61919',
//     fontWeight: '500',
//   },
//   expiryTextValue: {
//     fontSize: 18,
//     color: '#334155',
//     fontWeight: '500',
//   },
// });

// export default Profile;

import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Icons from '@utils/imagePaths/imagePaths';
import CustomText from '@components/Ui/CustomText';
import useAuthStore from '@utils/store/authStore';
import {infoToast, successToast, errorToast, showToast} from '@components/Ui/CustomToast';

/*
 * Camera Permissions:
 *
 * Android (add to android/app/src/main/AndroidManifest.xml inside <manifest>):
 * <!-- Do NOT include CAMERA permission to avoid (NOBRIDGE) error -->
 * <!-- <uses-permission android:name="android.permission.CAMERA" /> -->
 * <!-- Optional for Android API < 29 if saving photos -->
 * <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
 * <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
 *
 * iOS (add to ios/YourAppName/Info.plist):
 * <key>NSCameraUsageDescription</key>
 * <string>We need access to your camera to take profile photos.</string>
 * <!-- Optional for photo library access -->
 * <key>NSPhotoLibraryUsageDescription</key>
 * <string>We need access to your photo library to select profile photos.</string>
 *
 * Debugging:
 * - If the app restarts after capturing a photo, check logs with `npx react-native log-android`.
 * - Look for errors after "Uploading image..." or in the native layer (use Android Studio Logcat).
 * - Test on a physical device, as emulators may lack camera support.
 */

interface ProfileData {
  fullName: string;
  phoneNumber: string;
  cnicNumber: string;
  cnicExpiry: string;
  drivingLicense: string;
  drivingLicenseExpiry: string;
  vehicleRegistration: string;
}

const formatDateToMonthYear = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    // Get month (0-11, so add 1) and format to two digits
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    // Get last two digits of the year
    const year = date.getUTCFullYear().toString().slice(-2);

    return `${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const Profile: React.FC = () => {
  const {user, token} = useAuthStore.getState();
  const uploadAvatar = useAuthStore(state => state.uploadAvatar);

  // Safely handle the licenceExpiry date
  const drivingLicenseExpiryDate = user?.licenceExpiry
    ? formatDateToMonthYear(user.licenceExpiry)
    : 'Not Available';

  const cnicExpiryDate = user?.cnicExpiry
    ? formatDateToMonthYear(user.cnicExpiry)
    : 'Not Available';

  console.log('user', user);

  // Profile data, prioritizing user data from store
  const profileData: ProfileData = {
    fullName: user?.name || 'Mohammad Ibrahim Khan',
    phoneNumber: user?.mobile || '03452467040',
    cnicNumber: user?.cnic || '4210167906179',
    cnicExpiry: cnicExpiryDate,
    drivingLicense: user?.licenceNo || '4210167906179#987',
    drivingLicenseExpiry: drivingLicenseExpiryDate,
    vehicleRegistration: user?.vehicleRegNo || 'KQF-2871',
  };

    const handleAddPhoto = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'We need your permission to access the camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        showToast('error','Permission Denied', 'Camera permission is required to take photos.');
        // Alert.alert(
        //   'Permission Denied',
        //   'Camera permission is required to take photos.',
        // );
        return;
      }
    }

    handleUploadPhoto();

  };

  const handleUploadPhoto = async () => {
    try {
      console.log('Starting camera launch...');
      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'back',
          quality: 0.7, // Reduce quality to avoid memory issues
          maxWidth: 2000, // Limit size for memory optimization
          maxHeight: 2000,
        },
        async response => {
          try {
            console.log('Camera response:', response);
            if (response.didCancel) {
              infoToast('Photo capture cancelled.');
              return;
            }
            if (response.errorCode) {
              console.error(
                'Camera error:',
                response.errorCode,
                response.errorMessage,
              );
              errorToast(
                `Camera error: ${
                  response.errorCode === 'permission'
                    ? 'Camera permission denied. Please enable it in settings.'
                    : response.errorMessage || 'Unknown error.'
                }`,
              );
              return;
            }
            if (response.assets && response.assets[0]) {
              const image = response.assets[0];
              console.log('Captured image:', {
                uri: image.uri,
                type: image.type,
                fileName: image.fileName,
                fileSize: image.fileSize,
              });
              if (!image.uri) {
                errorToast('Image URI is missing.');
                return;
              }
              console.log('Uploading image...');
              // console.log('Image URI:', image.uri);
              // console.log('Image type:', image.type);
              // console.log('Image fileName:', image.fileName);
              // console.log('token:', token);
              
              const result = await uploadAvatar(image.uri, token);
              console.log('Upload result:', result);
              if (result) {
                successToast('Profile photo uploaded successfully.');
              } else {
                errorToast('Failed to upload photo.');
              }
            } else {
              console.error('No photo captured:', response);
              errorToast('No photo captured.');
            }
          } catch (innerError: any) {
            console.error('Error processing camera response:', innerError);
            errorToast('Failed to process photo. Please try again.');
          }
        },
      );
    } catch (error: any) {
      console.error('Error in handleUploadPhoto:', error);
      errorToast('Failed to open camera. Please try again.');
    }
  };

  // Determine the image source: user.avatar if available, otherwise fallback to static image
  const profileImageSource =
    user?.avatar && user.avatar !== ''
      ? {uri: user.avatar}
      : Icons.ProfileAvatar;

  const handleUploadPhoto2 = () => {
    // Implement photo upload functionality
    infoToast('This feature is not implemented yet.');
    // Alert.alert('Upload Photo', 'This feature is not implemented yet.');
    // console.log('Upload photo button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImageSource}
            style={styles.profileImage}
            resizeMode="contain"
            onError={error => {
              console.error('Failed to load profile image:', error.nativeEvent);
              // Optionally show a toast
              // errorToast('Failed to load profile image.');
            }}
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleAddPhoto} >
          <CustomText style={styles.uploadButtonText}>
            Upload Photograph
          </CustomText>
        </TouchableOpacity>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {/* Full Name */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>FULL NAME</CustomText>
            <CustomText style={styles.detailValue}>
              {profileData.fullName}
            </CustomText>
          </View>

          {/* Phone Number */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>PHONE NUMBER</CustomText>
            <CustomText style={styles.detailValue}>
              {profileData.phoneNumber}
            </CustomText>
          </View>

          {/* CNIC */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>CNIC #</CustomText>
            <View style={styles.valueWithExpiry}>
              <CustomText style={styles.detailValue}>
                {profileData.cnicNumber}
              </CustomText>
              {/* <CustomText style={styles.expiryText}>
                Exp:{' '}
                <CustomText style={styles.expiryTextValue}>
                  {profileData.cnicExpiry}
                </CustomText>
              </CustomText> */}
            </View>
          </View>

          {/* Driving License */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>DRIVING LICENSE #</CustomText>
            <View style={styles.valueWithExpiry}>
              <CustomText style={styles.detailValue}>
                {profileData.drivingLicense}
              </CustomText>
              <CustomText style={styles.expiryText}>
                Exp:{' '}
                <CustomText style={styles.expiryTextValue}>
                  {profileData.drivingLicenseExpiry}
                </CustomText>
              </CustomText>
            </View>
          </View>

          {/* Vehicle Registration */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>
              VEHICLE REGISTRATION #
            </CustomText>
            <CustomText style={styles.detailValue}>
              {profileData.vehicleRegistration}
            </CustomText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    backgroundColor: '#e61919',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 30,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  detailsContainer: {
    width: '100%',
  },
  detailRow: {
    marginBottom: 20,
    marginRight: 20,
  },
  detailLabel: {
    fontSize: 14, // Changed from '14' to 14
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    color: '#334155',
    fontWeight: '500',
  },
  valueWithExpiry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 18,
    color: '#e61919',
    fontWeight: '500',
  },
  expiryTextValue: {
    fontSize: 18,
    color: '#334155',
    fontWeight: '500',
  },
});

export default Profile;