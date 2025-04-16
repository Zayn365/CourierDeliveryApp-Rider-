// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// import Icons from '@utils/imagePaths/imagePaths';


// interface ProfileData {
//   fullName: string;
//   phoneNumber: string;
//   cnicNumber: string;
//   cnicExpiry: string;
//   drivingLicense: string;
//   drivingLicenseExpiry: string;
//   vehicleRegistration: string;
// }

// const Profile: React.FC = () => {
//   // Sample data - in a real app, this would come from props or context
//   const profileData: ProfileData = {
//     fullName: 'Mohammad Ibrahim Khan',
//     phoneNumber: '03452467040',
//     cnicNumber: '4210167906179',
//     cnicExpiry: '01/28',
//     drivingLicense: '4210167906179#987',
//     drivingLicenseExpiry: '03/26',
//     vehicleRegistration: 'KQF-2871',
//   };

//   const handleUploadPhoto = () => {
//     // Implement photo upload functionality
//     console.log('Upload photo button pressed');
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
//           <Text style={styles.uploadButtonText}>Upload Photograph</Text>
//         </TouchableOpacity>

//         {/* Profile Details */}
//         <View style={styles.detailsContainer}>
//           {/* Full Name */}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>FULL NAME</Text>
//             <Text style={styles.detailValue}>{profileData.fullName}</Text>
//           </View>

//           {/* Phone Number */}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>PHONE NUMBER</Text>
//             <Text style={styles.detailValue}>{profileData.phoneNumber}</Text>
//           </View>

//           {/* CNIC */}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>CNIC #</Text>
//             <View style={styles.valueWithExpiry}>
//               <Text style={styles.detailValue}>{profileData.cnicNumber}</Text>
//               <Text style={styles.expiryText}>Exp: <Text style={styles.expiryTextValue}>{profileData.cnicExpiry}</Text></Text>
//             </View>
//           </View>

//           {/* Driving License */}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>DRIVING LICENSE #</Text>
//             <View style={styles.valueWithExpiry}>
//               <Text style={styles.detailValue}>{profileData.drivingLicense}</Text>
//               <Text style={styles.expiryText}>Exp: <Text style={styles.expiryTextValue}>{profileData.drivingLicenseExpiry}</Text></Text>
//             </View>
//           </View>

//           {/* Vehicle Registration */}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>VEHICLE REGISTRATION #</Text>
//             <Text style={styles.detailValue}>{profileData.vehicleRegistration}</Text>
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
//     paddingHorizontal: 20,
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
//     marginRight: 30,
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
import { View, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Icons from '@utils/imagePaths/imagePaths';
import CustomText from '@components/Ui/CustomText';
import useAuthStore from '@utils/store/authStore';

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

  const { user, token } = useAuthStore();

  // Safely handle the licenceExpiry date
  const drivingLicenseExpiryDate = user?.licenceExpiry
    ? formatDateToMonthYear(user.licenceExpiry) // TypeScript now knows licenceExpiry is string
    : 'Not Available'; // Fallback for null/undefined

  const cnicExpiryDate = user?.cnicExpiry
    ? formatDateToMonthYear(user.cnicExpiry) // TypeScript now knows createdAt is string
    : 'Not Available'; // Fallback for null/undefined

  console.log("user", user);
  
  // Sample data - in a real app, this would come from props or context
  const profileData: ProfileData = {
    fullName: user?.name ||'Mohammad Ibrahim Khan',
    phoneNumber: user?.mobile || '03452467040',
    cnicNumber: user?.cnic || '4210167906179',
    cnicExpiry:
    //  user?.createdAt|| 
     '01/28',
    drivingLicense: user?.licenceNo || '4210167906179#987',
    drivingLicenseExpiry: 
    user?.licenceExpiry ||
     '03/26',
    vehicleRegistration: user?.vehicleRegNo || 'KQF-2871',
  };

  const handleUploadPhoto = () => {
    // Implement photo upload functionality
    Alert.alert('Upload Photo', 'This feature is not implemented yet.');
    // console.log('Upload photo button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image 
            source={Icons.ProfileAvatar} 
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadPhoto}
        >
          <CustomText style={styles.uploadButtonText}>Upload Photograph</CustomText>
        </TouchableOpacity>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {/* Full Name */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>FULL NAME</CustomText>
            <CustomText style={styles.detailValue}>{profileData.fullName}</CustomText>
          </View>

          {/* Phone Number */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>PHONE NUMBER</CustomText>
            <CustomText style={styles.detailValue}>{profileData.phoneNumber}</CustomText>
          </View>

          {/* CNIC */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>CNIC #</CustomText>
            <View style={styles.valueWithExpiry}>
              <CustomText style={styles.detailValue}>{profileData.cnicNumber}</CustomText>
              <CustomText style={styles.expiryText}>Exp: <CustomText style={styles.expiryTextValue}>{cnicExpiryDate}</CustomText></CustomText>
            </View>
          </View>

          {/* Driving License */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>DRIVING LICENSE #</CustomText>
            <View style={styles.valueWithExpiry}>
              <CustomText style={styles.detailValue}>{profileData.drivingLicense}</CustomText>
              <CustomText style={styles.expiryText}>Exp: <CustomText style={styles.expiryTextValue}>{drivingLicenseExpiryDate}</CustomText></CustomText>
            </View>
          </View>

          {/* Vehicle Registration */}
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>VEHICLE REGISTRATION #</CustomText>
            <CustomText style={styles.detailValue}>{profileData.vehicleRegistration}</CustomText>
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
    // backgroundColor: '#e61919',
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
    fontSize: 14,
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