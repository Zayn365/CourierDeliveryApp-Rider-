// // import {create} from 'zustand';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import {Alert} from 'react-native';
// // import {API_URL} from '@env';
// // import { errorToast, successToast } from '@components/Ui/CustomToast';

// // const apiLink = API_URL;

// // console.log("API Link From authStore : ", apiLink );


// // interface User {
// //   id: number;
// //   userId: string;
// //   name: string;
// //   email: string;
// //   mobile: string;
// //   password: string;
// //   active: boolean;
// //   avatar: string | null;
// //   cnic: string | null;
// //   cnicExpiry: string | null;
// //   createdAt: string;
// //   updatedAt: string;
// //   lastLogin: string | null;
// //   isOtpVerified: boolean;
// //   employeeId: string | null;
// //   gender: string | null;
// //   licenceNo: string | null;
// //   licenceExpiry: string | null;
// //   riderVerification: string | null;
// //   role: 'user' | 'admin' | 'rider';
// //   status: 'active' | 'inactive';
// //   otp: string | null;
// //   tFaEnabled: boolean | null;
// //   vehicleRegNo: string | null;
// //   vehicleType: string | null;
// // }

// // interface StoreState {
// //   user: User | null;
// //   token: string | null;
// //   isLoading: boolean;
// //   error: string | null;
// //   fcmToken: string | null;
// //   deviceId: string | null;
// //   setFcmToken: (fcmToken: string) => void;
// //   setDeviceId: (deviceId: string) => void;
// //   setUser: (user: User | null) => void;
// //   setToken: (token: string | null) => void;
// //   setLoading: (isLoading: boolean) => void;
// //   setError: (error: string | null) => void;

// //   login: (
// //     phone: string,
// //     password: string,
// //     fcmToken: string | null,
// //   ) => Promise<false | void | {userId: any; check: boolean}>;
// //   verify: (userId?: string, otp?: string) => Promise<boolean>;
// //   resend: (token: string, type: string) => Promise<boolean>;
// //   saveFcmAndDeviceId: (email: string, deviceId: string) => Promise<boolean>;
// //   forgetPassowrd: (email: string) => Promise<boolean>;
// //   verifyForgetPassword: (
// //     email: string,
// //     otp: string,
// //     newPassword: string,
// //   ) => Promise<boolean>;
// //   signup: (
// //     name: string,
// //     email: string,
// //     password: string,
// //     mobile: string | number,
// //   ) => Promise<false | {userId: any; check: boolean}>;
// //   fetchUserData: () => Promise<void>;
// //   initializeUser: () => Promise<void>;
// //   isActive: (token: string | null, active: boolean) => Promise<boolean>;
// //   updateUserInfo: (name: string) => Promise<boolean | undefined>;
// //   logout: (token: string) => Promise<boolean>;
// // }

// // const useAuthStore = create<StoreState>()((set, get) => ({
// //   user: null,
// //   token: null,
// //   isLoading: false,
// //   error: null,
// //   fcmToken: null,
// //   deviceId: null,
// //   setFcmToken: fcmToken => set({fcmToken}),
// //   setDeviceId: deviceId => set({deviceId}),
// //   setUser: user => set({user}),
// //   setToken: token => set({token}),
// //   setLoading: isLoading => set({isLoading}),
// //   setError: error => set({error}),
// //   isActive: async (token: string | null, active: boolean) => {
// //     set({isLoading: true, error: null});
// //     try {
// //       await axios.patch(
// //         `${apiLink}/activity-update`,
// //         {active},
// //         {headers: {Authorization: `${token}`}},
// //       );
// //       return true;
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message || 'Activation failed.';
// //       set({error: errorMessage});
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   login: async (phone, password, fcmToken) => {
// //     set({isLoading: true, error: null});
// //     try {
// //       const phoneString = phone.toString();
// //       console.log(phoneString, password, fcmToken);
// //       const response: any = await axios.post(`${apiLink}/login`, {
// //         mobile: phoneString,
// //         password,
// //         fcmToken,
// //       });

// //       if (response?.data?.data) {
// //         const {user, token} = response.data.data;
// //         set({user, token});
// //         await AsyncStorage.setItem('token', token);
// //         await AsyncStorage.setItem('fcmToken', fcmToken as string);
// //         await AsyncStorage.setItem('user', JSON.stringify(user));
// //       } else {
// //         throw new Error('Invalid response from server.');
// //       }
// //     } catch (error: any) {
// //       console.log(
// //         'TCL ~ file: authStore.ts:129 ~ login: ~ error:',
// //         error.response,
// //       );
// //       const errorMessage =
// //         error.response?.data?.message ||
// //         error.response?.data?.data?.[0]?.msg ||
// //         'An unexpected error occurred. Please try again.';
// //       set({error: errorMessage});
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   verify: async (userId, otp) => {
// //     set({isLoading: true, error: null});
// //     try {
// //       await axios.post(`${apiLink}/verify-otp`, {userId, otp});
// //       return true;
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message || 'Verification failed.';
// //       set({error: errorMessage});
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   signup: async (name, email, password, mobile) => {
// //     set({isLoading: true, error: null});
// //     try {
// //       const response: any = await axios.post(`${apiLink}/signup`, {
// //         name,
// //         email,
// //         password,
// //         mobile,
// //       });

// //       const {userId} = response.data.data;
// //       return {userId, check: true};
// //     } catch (error: any) {
// //       const errorMessage = error.response?.data?.message || 'Signup failed.';
// //       console.log(error);
// //       set({error: errorMessage});
// //       set({isLoading: false});
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   resend: async (email, type) => {
// //     try {
// //       await axios.post(`${apiLink}/resend-otp`, {email, type});
// //       Alert.alert('OTP sent successfully');
// //       return true;
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message || 'Failed to resend OTP.';
// //       set({error: errorMessage});
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     }
// //   },

// //   forgetPassowrd: async email => {
// //     set({isLoading: true, error: null});
// //     try {
// //       await axios.post(`${apiLink}/request-password-reset`, {mobile: email});
// //       successToast('OTP sent successfully');
// //       // Alert.alert('OTP sent successfully');
// //       set({isLoading: false, error: null});
// //       return true;
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message || 'Failed to resend OTP.';
// //       set({isLoading: false, error: errorMessage});
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     }
// //   },

// //   verifyForgetPassword: async (email, otp, newPassword) => {
// //     set({isLoading: true, error: null});
// //     try {
// //       await axios.post(`${apiLink}/verify-change-password`, {
// //         email,
// //         otp,
// //         newPassword,
// //       });
// //       return true;
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.data?.message || 'Password change failed.';
// //       set({error: errorMessage});
// //       errorToast(errorMessage);
// //       // Alert.alert('Error', errorMessage);
// //       return false;
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   fetchUserData: async () => {
// //     const token = get().token;
// //     if (!token) return;

// //     set({isLoading: true});
// //     try {
// //       const response: any = await axios.get(apiLink, {
// //         headers: {Authorization: `Bearer ${token}`},
// //       });
// //       set({user: response.data});
// //     } catch (error: any) {
// //       set({error: error.message});
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   saveFcmAndDeviceId: async (token, deviceId) => {
// //     try {
// //       if (token) {
// //         await axios.post(`${apiLink}/firebaseToken`, {deviceId, token});
// //         return true;
// //       } else {
// //         return false;
// //       }
// //     } catch (error: any) {
// //       console.log(
// //         'TCL ~ file: authStore.ts:253 ~ saveFcmAndDeviceId: ~ error:',
// //         error,
// //       );
// //       const errorMessage = error.response?.data?.message;
// //       set({error: errorMessage});
// //       errorToast(errorMessage);
// //       Alert.alert('Error', errorMessage);
// //       return false;
// //     }
// //   },

// //   initializeUser: async () => {
// //     const token = await AsyncStorage.getItem('token');
// //     const user = await AsyncStorage.getItem('user');
// //     const fcmToken = await AsyncStorage.getItem('fcmToken');
// //     const deviceId = await AsyncStorage.getItem('deviceId');
// //     if (token && user) {
// //       set({
// //         token,
// //         user: JSON.parse(user),
// //         fcmToken,
// //         deviceId,
// //       });
// //     }
// //   },

// //   updateUserInfo: async (name) => {
// //     set({isLoading: true, error: null});
// //     try {
// //       const response: any = await axios.put(
// //         `${apiLink}/profile`,
// //         {
// //           name,
// //         },
// //         {
// //           headers: {
// //             Authorization: get().token,
// //           },
// //         },
// //       );

// //       const user = response?.data?.data;
// //       // alert('Profile updated successfully');
// //       successToast('Profile updated successfully');
// //       set({user: user});
// //       await AsyncStorage.setItem('user', JSON.stringify(user));

// //       return true;
// //     } catch (error: any) {
// //       const errorMessage = error.response?.data?.message || 'Signup failed.';
// //       console.log(error.response?.data);
// //       set({error: errorMessage});
// //       set({isLoading: false});
// //       // alert(errorMessage);
// //       errorToast(errorMessage);
// //       return false;
// //     } finally {
// //       set({isLoading: false});
// //     }
// //   },

// //   logout: async (token: string) => {
// //     try {
// //       await axios
// //         .post(
// //           `${apiLink}/logout`,
// //           {},
// //           {
// //             headers: {Authorization: `${token}`},
// //           },
// //         )
// //         .then(response => console.log(response));
// //       // Alert.alert('OTP sent successfully');
// //       await AsyncStorage.clear();
// //       set({user: null, token: null});
// //       return true;
// //     } catch (error: any) {
// //       console.log('🚀 ~ logout: ~ error:', error);
// //       const errorMessage = error.response?.data?.message;
// //       set({error: errorMessage});
// //       return false;
// //     }
// //   },
// // }));

// // export default useAuthStore;

// import { create } from 'zustand';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';
// import { API_URL } from '@env';
// import { errorToast, successToast } from '@components/Ui/CustomToast';

// const apiLink = API_URL;

// console.log("API Link From authStore : ", apiLink);

// interface User {
//   id: number;
//   userId: string;
//   name: string;
//   email: string;
//   mobile: string;
//   password: string;
//   active: boolean;
//   avatar: string | null;
//   cnic: string | null;
//   cnicExpiry: string | null;
//   createdAt: string;
//   updatedAt: string;
//   lastLogin: string | null;
//   isOtpVerified: boolean;
//   employeeId: string | null;
//   gender: string | null;
//   licenceNo: string | null;
//   licenceExpiry: string | null;
//   riderVerification: string | null;
//   role: 'user' | 'admin' | 'rider';
//   status: 'active' | 'inactive';
//   otp: string | null;
//   tFaEnabled: boolean | null;
//   vehicleRegNo: string | null;
//   vehicleType: string | null;
// }

// interface Image {
//   uri: string;
//   type?: string;
//   fileName?: string;
// }

// interface StoreState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;
//   fcmToken: string | null;
//   deviceId: string | null;
//   setFcmToken: (fcmToken: string) => void;
//   setDeviceId: (deviceId: string) => void;
//   setUser: (user: User | null) => void;
//   setToken: (token: string | null) => void;
//   setLoading: (isLoading: boolean) => void;
//   setError: (error: string | null) => void;

//   login: (
//     phone: string,
//     password: string,
//     fcmToken: string | null,
//   ) => Promise<false | void | { userId: any; check: boolean }>;
//   verify: (userId?: string, otp?: string) => Promise<boolean>;
//   resend: (token: string, type: string) => Promise<boolean>;
//   saveFcmAndDeviceId: (email: string, deviceId: string) => Promise<boolean>;
//   forgetPassowrd: (email: string) => Promise<boolean>;
//   verifyForgetPassword: (
//     email: string,
//     otp: string,
//     newPassword: string,
//   ) => Promise<boolean>;
//   signup: (
//     name: string,
//     email: string,
//     password: string,
//     mobile: string | number,
//   ) => Promise<false | { userId: any; check: boolean }>;
//   fetchUserData: () => Promise<void>;
//   initializeUser: () => Promise<void>;
//   isActive: (token: string | null, active: boolean) => Promise<boolean>;
//   updateUserInfo: (name: string) => Promise<boolean | undefined>;
//   logout: (token: string) => Promise<boolean>;
//   editProfile: (
//     gender: string | null,
//     avatar: string | null,
//     cnic: string | null,
//     vehicleType: string | null,
//     vehicleRegNo: string | null,
//     licenceNo: string | null,
//     licenceExpiry: string | null,
//     token: string | null,
//     showToast?: boolean,
//   ) => Promise<boolean>;
//   uploadAvatar: (image: string, token: string | null) => Promise<boolean>;
// }

// const useAuthStore = create<StoreState>()((set, get) => ({
//   user: null,
//   token: null,
//   isLoading: false,
//   error: null,
//   fcmToken: null,
//   deviceId: null,
//   setFcmToken: fcmToken => set({ fcmToken }),
//   setDeviceId: deviceId => set({ deviceId }),
//   setUser: user => set({ user }),
//   setToken: token => set({ token }),
//   setLoading: isLoading => set({ isLoading }),
//   setError: error => set({ error }),

//   isActive: async (token: string | null, active: boolean) => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.patch(
//         `${apiLink}/activity-update`,
//         { active },
//         { headers: { Authorization: `${token}` } },
//       );
//       return true;
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Activation failed.';
//       set({ error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   login: async (phone, password, fcmToken) => {
//     set({ isLoading: true, error: null });
//     try {
//       const phoneString = phone.toString();
//       console.log(phoneString, password, fcmToken);
//       const response: any = await axios.post(`${apiLink}/login`, {
//         mobile: phoneString,
//         password,
//         fcmToken,
//       });

//       if (response?.data?.data) {
//         const { user, token } = response.data.data;
//         set({ user, token });
//         await AsyncStorage.setItem('token', token);
//         await AsyncStorage.setItem('fcmToken', fcmToken as string);
//         await AsyncStorage.setItem('user', JSON.stringify(user));
//       } else {
//         throw new Error('Invalid response from server.');
//       }
//     } catch (error: any) {
//       console.log(
//         'TCL ~ file: authStore.ts:129 ~ login: ~ error:',
//         error.response,
//       );
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.data?.[0]?.msg ||
//         'An unexpected error occurred. Please try again.';
//       set({ error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   verify: async (userId, otp) => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.post(`${apiLink}/verify-otp`, { userId, otp });
//       return true;
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Verification failed.';
//       set({ error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   signup: async (name, email, password, mobile) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response: any = await axios.post(`${apiLink}/signup`, {
//         name,
//         email,
//         password,
//         mobile,
//       });

//       const { userId } = response.data.data;
//       return { userId, check: true };
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Signup failed.';
//       console.log(error);
//       set({ error: errorMessage });
//       set({ isLoading: false });
//       Alert.alert('Error', errorMessage);
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   resend: async (email, type) => {
//     try {
//       await axios.post(`${apiLink}/resend-otp`, { email, type });
//       Alert.alert('OTP sent successfully');
//       return true;
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Failed to resend OTP.';
//       set({ error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     }
//   },

//   forgetPassowrd: async email => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.post(`${apiLink}/request-password-reset`, { mobile: email });
//       Alert.alert('OTP sent successfully');
//       set({ isLoading: false, error: null });
//       return true;
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Failed to resend OTP.';
//       set({ isLoading: false, error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     }
//   },

//   verifyForgetPassword: async (email, otp, newPassword) => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.post(`${apiLink}/verify-change-password`, {
//         email,
//         otp,
//         newPassword,
//       });
//       return true;
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Password change failed.';
//       set({ error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   fetchUserData: async () => {
//     const token = get().token;
//     if (!token) return;

//     set({ isLoading: true });
//     try {
//       const response: any = await axios.get(apiLink, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       set({ user: response.data });
//     } catch (error: any) {
//       set({ error: error.message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   saveFcmAndDeviceId: async (token, deviceId) => {
//     try {
//       if (token) {
//         await axios.post(`${apiLink}/firebaseToken`, { deviceId, token });
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error: any) {
//       console.log(
//         'TCL ~ file: authStore.ts:253 ~ saveFcmAndDeviceId: ~ error:',
//         error,
//       );
//       const errorMessage = error.response?.data?.message;
//       set({ error: errorMessage });
//       Alert.alert('Error', errorMessage);
//       return false;
//     }
//   },

//   initializeUser: async () => {
//     const token = await AsyncStorage.getItem('token');
//     const user = await AsyncStorage.getItem('user');
//     const fcmToken = await AsyncStorage.getItem('fcmToken');
//     const deviceId = await AsyncStorage.getItem('deviceId');
//     if (token && user) {
//       set({
//         token,
//         user: JSON.parse(user),
//         fcmToken,
//         deviceId,
//       });
//     }
//   },

//   updateUserInfo: async (name) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response: any = await axios.put(
//         `${apiLink}/profile`,
//         {
//           name,
//         },
//         {
//           headers: {
//             Authorization: get().token,
//           },
//         },
//       );

//       const user = response?.data?.data;
//       successToast('Profile updated successfully');
//       set({ user: user });
//       await AsyncStorage.setItem('user', JSON.stringify(user));
//       return true;
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Signup failed.';
//       console.log(error.response?.data);
//       set({ error: errorMessage });
//       set({ isLoading: false });
//       errorToast(errorMessage);
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   logout: async (token: string) => {
//     try {
//       await axios
//         .post(
//           `${apiLink}/logout`,
//           {},
//           {
//             headers: { Authorization: `${token}` },
//           },
//         )
//         .then(response => console.log(response));
//       await AsyncStorage.clear();
//       set({ user: null, token: null });
//       return true;
//     } catch (error: any) {
//       console.log('🚀 ~ logout: ~ error:', error);
//       const errorMessage = error.response?.data?.message;
//       set({ error: errorMessage });
//       return false;
//     }
//   },

//   // editProfile: async (
//   //   gender,
//   //   avatar,
//   //   cnic,
//   //   vehicleType,
//   //   vehicleRegNo,
//   //   licenceNo,
//   //   licenceExpiry,
//   //   token
//   // ) => {
//   //   set({ isLoading: true, error: null });
//   //   try {
//   //     const response: any = await axios.put(
//   //       `${apiLink}/edit-profile`,
//   //       {
//   //         gender,
//   //         avatar,
//   //         cnic,
//   //         vehicleType,
//   //         vehicleRegNo,
//   //         licenceNo,
//   //         licenceExpiry,
//   //       },
//   //       {
//   //         headers: { Authorization: `${token}` },
//   //       },
//   //     );

//   //     const updatedUser = response?.data?.data;
//   //     set({ user: updatedUser });
//   //     await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//   //     successToast('Profile updated successfully');
//   //     return true;
//   //   } catch (error: any) {
//   //     const errorMessage =
//   //       error.response?.data?.message || 'Failed to update profile.';
//   //     set({ error: errorMessage });
//   //     errorToast(errorMessage);
//   //     return false;
//   //   } finally {
//   //     set({ isLoading: false });
//   //   }
//   // },

//   editProfile: async (
//     gender,
//     avatar,
//     cnic,
//     vehicleType,
//     vehicleRegNo,
//     licenceNo,
//     licenceExpiry,
//     token,
//     showToast = true
//   ) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response: any = await axios.put(
//         `${apiLink}/edit-profile`,
//         {
//           gender,
//           avatar,
//           cnic,
//           vehicleType,
//           vehicleRegNo,
//           licenceNo,
//           licenceExpiry,
//         },
//         {
//           headers: { Authorization: `${token}` },
//         },
//       );

//       const updatedUser = response?.data?.data;
//       set({ user: updatedUser });
//       await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//       if (showToast) {
//         successToast('Profile updated successfully');
//       }
//       return true;
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || 'Failed to update profile.';
//       set({ error: errorMessage });
//       if (showToast) {
//         errorToast(errorMessage);
//       }
//       return false;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   uploadAvatar: async (image, token) => {
//   set({ isLoading: true, error: null });
//   try {
//     // Step 1: Upload the image
//     const formData = new FormData();
//     // @ts-ignore
//     formData.append('image', {
//       uri: image,
//       type: 'image/jpeg',
//       name: 'avatar.jpg',
//     });
//     formData.append('type', 'avatar');
//     const response: any = await axios.post(
//       `${apiLink}/upload-image`,
//       formData,
//       {
//         headers: {
//           Authorization: `${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       },
//     );

//     const newAvatarUrl = response?.data?.data?.imageUrl;
//     if (!newAvatarUrl) {
//       throw new Error('No image URL in response');
//     }

//     // Step 2: Get the current user from the store
//     const currentUser = get().user;
//     if (!currentUser) {
//       throw new Error('No current user found');
//     }

//     // Step 3: Update the profile with the new avatar URL
//     const editProfileResult = await get().editProfile(
//       currentUser.gender,
//       newAvatarUrl, // Update only the avatar
//       currentUser.cnic,
//       currentUser.vehicleType,
//       currentUser.vehicleRegNo,
//       currentUser.licenceNo,
//       currentUser.licenceExpiry,
//       token,
//       false // Suppress the default toast
//     );

//     // Step 4: Handle the result
//     if (editProfileResult) {
//       successToast('Avatar uploaded successfully');
//       return true;
//     } else {
//       errorToast('Failed to update profile with new avatar');
//       return false;
//     }
//   } catch (error: any) {
//     const errorMessage = error.message || 'Failed to upload avatar.';
//     set({ error: errorMessage });
//     errorToast(errorMessage);
//     return false;
//   } finally {
//     set({ isLoading: false });
//   }
// },

//   // uploadAvatar: async (image, token) => {
//   //   set({ isLoading: true, error: null });
//   //   try {
//   //     const formData = new FormData();
//   //     //@ts-ignore
//   //     formData.append('image', {
//   //       uri: image, // The image URI from the camera
//   //       type: 'image/jpeg', // Adjust based on actual image type
//   //       name: 'avatar.jpg', // Adjust based on server requirements
//   //     });
//   //     formData.append('type', 'avatar');
//   //     const response: any = await axios.post(
//   //       `${apiLink}/upload-image`,
//   //       // {
//   //       //   image,
//   //       //   type: 'avatar',
//   //       // },
//   //       formData,
//   //       {
//   //         headers: {
//   //           Authorization: `${token}`,
//   //           'Content-Type': 'multipart/form-data', // Required for file uploads
//   //         },
//   //       },
//   //     );

//   //     const updatedUser = response?.data?.data;
//   //     console.log('Updated User:', updatedUser);

//   //     // set({ user: updatedUser });
//   //     // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//   //     successToast('Avatar uploaded successfully');
//   //     return true;
//   //   } catch (error: any) {
//   //     const errorMessage =
//   //       error.response?.data?.message || 'Failed to upload avatar.';
//   //     set({
//   //       error: errorMessage
//   //     });
//   //     errorToast(errorMessage);
//   //     return false;
//   //   } finally {
//   //     set({ isLoading: false });
//   //   }
//   // },

// }));

// export default useAuthStore;

import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import { errorToast, successToast } from '@components/Ui/CustomToast';

const apiLink = API_URL;

console.log("API Link From authStore : ", apiLink);

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  active: boolean;
  avatar: string | null;
  cnic: string | null;
  cnicExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  isOtpVerified: boolean;
  employeeId: string | null;
  gender: string | null;
  licenceNo: string | null;
  licenceExpiry: string | null;
  riderVerification: string | null;
  role: 'user' | 'admin' | 'rider';
  status: 'active' | 'inactive';
  otp: string | null;
  tFaEnabled: boolean | null;
  vehicleRegNo: string | null;
  vehicleType: string | null;
}

interface Image {
  uri: string;
  type?: string;
  fileName?: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  fcmToken: string | null;
  deviceId: string | null;
  setFcmToken: (fcmToken: string) => void;
  setDeviceId: (deviceId: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  login: (
    phone: string,
    password: string,
    fcmToken: string | null,
  ) => Promise<false | void | { userId: any; check: boolean }>;
  verify: (userId?: string, otp?: string) => Promise<boolean>;
  resend: (token: string, type: string) => Promise<boolean>;
  saveFcmAndDeviceId: (email: string, deviceId: string) => Promise<boolean>;
  forgetPassowrd: (email: string) => Promise<boolean>;
  verifyForgetPassword: (
    email: string,
    otp: string,
    newPassword: string,
  ) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    mobile: string | number,
  ) => Promise<false | { userId: any; check: boolean }>;
  fetchUserData: () => Promise<void>;
  initializeUser: () => Promise<void>;
  isActive: (token: string | null, active: boolean) => Promise<boolean>;
  updateUserInfo: (name: string) => Promise<boolean | undefined>;
  logout: (token: string) => Promise<boolean>;
  editProfile: (
    gender: string | null,
    avatar: string | null,
    cnic: string | null,
    vehicleType: string | null,
    vehicleRegNo: string | null,
    licenceNo: string | null,
    licenceExpiry: string | null,
    token: string | null,
    showToast?: boolean,
  ) => Promise<boolean>;
  uploadAvatar: (image: string, token: string | null) => Promise<boolean>;
}

const useAuthStore = create<StoreState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  fcmToken: null,
  deviceId: null,
  setFcmToken: fcmToken => set({ fcmToken }),
  setDeviceId: deviceId => set({ deviceId }),
  setUser: user => set({ user }),
  setToken: token => set({ token }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),

  isActive: async (token: string | null, active: boolean) => {
    set({ isLoading: true, error: null });
    try {
      await axios.patch(
        `${apiLink}/activity-update`,
        { active },
        { headers: { Authorization: `${token}` } },
      );
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Activation failed.';
      set({ error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (phone, password, fcmToken) => {
    set({ isLoading: true, error: null });
    try {
      const phoneString = phone.toString();
      console.log(phoneString, password, fcmToken);
      const response: any = await axios.post(`${apiLink}/login`, {
        mobile: phoneString,
        password,
        fcmToken,
      });

      if (response?.data?.data) {
        const { user, token } = response.data.data;
        set({ user, token });
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('fcmToken', fcmToken as string);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (error: any) {
      console.log(
        'TCL ~ file: authStore.ts:129 ~ login: ~ error:',
        error.response,
      );
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.data?.[0]?.msg ||
        'An unexpected error occurred. Please try again.';
      set({ error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  verify: async (userId, otp) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${apiLink}/verify-otp`, { userId, otp });
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Verification failed.';
      set({ error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password, mobile) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await axios.post(`${apiLink}/signup`, {
        name,
        email,
        password,
        mobile,
      });

      const { userId } = response.data.data;
      return { userId, check: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed.';
      console.log(error);
      set({ error: errorMessage });
      set({ isLoading: false });
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  resend: async (email, type) => {
    try {
      await axios.post(`${apiLink}/resend-otp`, { email, type });
      Alert.alert('OTP sent successfully');
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend OTP.';
      set({ error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  forgetPassowrd: async email => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${apiLink}/request-password-reset`, { mobile: email });
      Alert.alert('OTP sent successfully');
      set({ isLoading: false, error: null });
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend OTP.';
      set({ isLoading: false, error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  verifyForgetPassword: async (email, otp, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${apiLink}/verify-change-password`, {
        email,
        otp,
        newPassword,
      });
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Password change failed.';
      set({ error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserData: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const response: any = await axios.get(apiLink, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveFcmAndDeviceId: async (token, deviceId) => {
    try {
      if (token) {
        await axios.post(`${apiLink}/firebaseToken`, { deviceId, token });
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.log(
        'TCL ~ file: authStore.ts:253 ~ saveFcmAndDeviceId: ~ error:',
        error,
      );
      const errorMessage = error.response?.data?.message;
      set({ error: errorMessage });
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  // initializeUser: async () => {
  //   const token = await AsyncStorage.getItem('token');
  //   const user = await AsyncStorage.getItem('user');
  //   const fcmToken = await AsyncStorage.getItem('fcmToken');
  //   const deviceId = await AsyncStorage.getItem('deviceId');
  //   if (token && user) {
  //     set({
  //       token,
  //       user: JSON.parse(user),
  //       fcmToken,
  //       deviceId,
  //     });
  //   }
  // },

  initializeUser: async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');
  const fcmToken = await AsyncStorage.getItem('fcmToken');
  const deviceId = await AsyncStorage.getItem('deviceId');
  console.log('Initializing user:', { token, user, fcmToken, deviceId });
  if (token && user) {
    set({
      token,
      user: JSON.parse(user),
      fcmToken,
      deviceId,
    });
  } else {
    console.log('No token or user found in AsyncStorage');
    set({ user: null, token: null });
  }
},

  updateUserInfo: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await axios.put(
        `${apiLink}/profile`,
        {
          name,
        },
        {
          headers: {
            Authorization: get().token,
          },
        },
      );

      const user = response?.data?.data;
      successToast('Profile updated successfully');
      set({ user: user });
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed.';
      console.log(error.response?.data);
      set({ error: errorMessage });
      set({ isLoading: false });
      errorToast(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async (token: string) => {
    try {
      await axios
        .post(
          `${apiLink}/logout`,
          {},
          {
            headers: { Authorization: `${token}` },
          },
        )
        .then(response => console.log(response));
      await AsyncStorage.clear();
      set({ user: null, token: null });
      return true;
    } catch (error: any) {
      console.log('🚀 ~ logout: ~ error:', error);
      const errorMessage = error.response?.data?.message;
      set({ error: errorMessage });
      return false;
    }
  },

  // editProfile: async (
  //   gender,
  //   avatar,
  //   cnic,
  //   vehicleType,
  //   vehicleRegNo,
  //   licenceNo,
  //   licenceExpiry,
  //   token,
  //   showToast = true
  // ) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response: any = await axios.put(
  //       `${apiLink}/edit-profile`,
  //       {
  //         gender,
  //         avatar,
  //         cnic,
  //         vehicleType,
  //         vehicleRegNo,
  //         licenceNo,
  //         licenceExpiry,
  //       },
  //       {
  //         headers: { Authorization: `${token}` },
  //       },
  //     );

  //     const updatedUser = response?.data?.data;

  //     // Ensure we're properly updating the state and AsyncStorage
  //     set({ user: updatedUser });
  //     await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

  //     if (showToast) {
  //       successToast('Profile updated successfully');
  //     }
  //     return true;
  //   } catch (error: any) {
  //     const errorMessage =
  //       error.response?.data?.message || 'Failed to update profile.';
  //     set({ error: errorMessage });
  //     if (showToast) {
  //       errorToast(errorMessage);
  //     }
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  editProfile: async (
    gender,
    avatar,
    cnic,
    vehicleType,
    vehicleRegNo,
    licenceNo,
    licenceExpiry,
    token,
    showToast = true
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await axios.put(
        `${apiLink}/edit-profile`,
        {
          gender,
          avatar,
          cnic,
          vehicleType,
          vehicleRegNo,
          licenceNo,
          licenceExpiry,
        },
        {
          headers: { Authorization: `${token}` },
        },
      );

      console.log('Edit profile response:', JSON.stringify(response.data, null, 2));

      const currentUser = get().user;
      const updatedUserData = response?.data?.data;
      let updatedUser;

      if (updatedUserData && typeof updatedUserData === 'object') {
        updatedUser = updatedUserData;
      } else {
        updatedUser = {
          ...currentUser,
          gender: gender ?? currentUser?.gender,
          avatar: avatar ?? currentUser?.avatar,
          cnic: cnic ?? currentUser?.cnic,
          vehicleType: vehicleType ?? currentUser?.vehicleType,
          vehicleRegNo: vehicleRegNo ?? currentUser?.vehicleRegNo,
          licenceNo: licenceNo ?? currentUser?.licenceNo,
          licenceExpiry: licenceExpiry ?? currentUser?.licenceExpiry,
        };
      }

      set({ user: updatedUser });
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      if (showToast) {
        successToast('Profile updated successfully');
      }
      return true;
    } catch (error: any) {
      console.error('Edit profile error:', error.response?.data, error.message);
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile.';
      set({ error: errorMessage });
      if (showToast) {
        errorToast(errorMessage);
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // uploadAvatar: async (image, token) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     console.log('Starting avatar upload process...');

  //     // Step 1: Upload the image
  //     const formData = new FormData();
  //     // @ts-ignore
  //     formData.append('image', {
  //       uri: image,
  //       type: 'image/jpeg',
  //       name: 'avatar.jpg',
  //     });
  //     formData.append('type', 'avatar');

  //     console.log('Uploading image to server...');
  //     const uploadResponse: any = await axios.post(
  //       `${apiLink}/upload-image`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `${token}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       },
  //     );

  //     console.log('Upload response:', uploadResponse.data);
  //     const newAvatarUrl = uploadResponse?.data?.data?.imageUrl;
  //     if (!newAvatarUrl) {
  //       throw new Error('No image URL in response');
  //     }

  //     // Step 2: Get the current user and update profile
  //     const currentUser = get().user;
  //     if (!currentUser) {
  //       throw new Error('No current user found');
  //     }

  //     console.log('Updating profile with new avatar URL:', newAvatarUrl);

  //     // Step 3: Update the profile with the new avatar URL
  //     const editProfileResult = await get().editProfile(
  //       currentUser.gender,
  //       newAvatarUrl,
  //       currentUser.cnic,
  //       currentUser.vehicleType,
  //       currentUser.vehicleRegNo,
  //       currentUser.licenceNo,
  //       currentUser.licenceExpiry,
  //       token,
  //       false // Suppress the default toast
  //     );

  //     if (editProfileResult) {
  //       console.log('Profile updated successfully with new avatar');

  //       // Verify the user is still in state
  //       const updatedUser = get().user;
  //       const updatedToken = get().token;
  //       console.log('User after update:', updatedUser ? 'exists' : 'null');
  //       console.log('Token after update:', updatedToken ? 'exists' : 'null');

  //       successToast('Profile photo uploaded successfully');
  //       return true;
  //     } else {
  //       throw new Error('Failed to update profile with new avatar');
  //     }

  //   } catch (error: any) {
  //     console.error('Error in uploadAvatar:', error);
  //     const errorMessage = error.response?.data?.message || error.message || 'Failed to upload avatar.';
  //     set({ error: errorMessage });
  //     errorToast(errorMessage);
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  uploadAvatar: async (image, token) => {
    set({ isLoading: true, error: null });
    try {
      // Step 1: Upload the image
      const formData = new FormData();
      // @ts-ignore
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      formData.append('type', 'avatar');
      const response: any = await axios.post(
        `${apiLink}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const newAvatarUrl = response?.data?.data?.imageUrl;
      if (!newAvatarUrl) {
        throw new Error('No image URL in response');
      }

      // Step 2: Get the current user from the store
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('No current user found');
      }

      // Step 3: Update the profile with the new avatar URL
      const editProfileResult = await get().editProfile(
        currentUser.gender,
        newAvatarUrl, // Update only the avatar
        currentUser.cnic,
        currentUser.vehicleType,
        currentUser.vehicleRegNo,
        currentUser.licenceNo,
        currentUser.licenceExpiry,
        token,
        false // Suppress the default toast
      );

      // Step 4: Handle the result
      if (editProfileResult) {
        successToast('Avatar uploaded successfully');
        return true;
      } else {
        errorToast('Failed to update profile with new avatar');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to upload avatar.';
      set({ error: errorMessage });
      errorToast(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

}));

export default useAuthStore;