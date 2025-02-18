import {create} from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {API_URL} from '@env';
const apiLink = API_URL;

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
  ) => Promise<false | void | {userId: any; check: boolean}>;
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
  ) => Promise<false | {userId: any; check: boolean}>;
  fetchUserData: () => Promise<void>;
  initializeUser: () => Promise<void>;
  isActive: (token: string | null, active: boolean) => Promise<boolean>;
  logout: (token: string) => Promise<boolean>;
}

const useAuthStore = create<StoreState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  fcmToken: null,
  deviceId: null,
  setFcmToken: fcmToken => set({fcmToken}),
  setDeviceId: deviceId => set({deviceId}),
  setUser: user => set({user}),
  setToken: token => set({token}),
  setLoading: isLoading => set({isLoading}),
  setError: error => set({error}),
  isActive: async (token: string | null, active: boolean) => {
    set({isLoading: true, error: null});
    try {
      await axios.patch(
        `${apiLink}/activity-update`,
        {active},
        {headers: {Authorization: `${token}`}},
      );
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Activation failed.';
      set({error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({isLoading: false});
    }
  },

  login: async (phone, password, fcmToken) => {
    set({isLoading: true, error: null});
    try {
      const phoneString = phone.toString();
      console.log(phoneString, password, fcmToken);
      const response: any = await axios.post(`${apiLink}/login`, {
        mobile: phoneString,
        password,
        fcmToken,
      });

      if (response?.data?.data) {
        const {user, token} = response.data.data;
        set({user, token});
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
      set({error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({isLoading: false});
    }
  },

  verify: async (userId, otp) => {
    set({isLoading: true, error: null});
    try {
      await axios.post(`${apiLink}/verify-otp`, {userId, otp});
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Verification failed.';
      set({error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({isLoading: false});
    }
  },

  signup: async (name, email, password, mobile) => {
    set({isLoading: true, error: null});
    try {
      const response: any = await axios.post(`${apiLink}/signup`, {
        name,
        email,
        password,
        mobile,
      });

      const {userId} = response.data.data;
      return {userId, check: true};
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed.';
      console.log(error);
      set({error: errorMessage});
      set({isLoading: false});
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({isLoading: false});
    }
  },

  resend: async (email, type) => {
    try {
      await axios.post(`${apiLink}/resend-otp`, {email, type});
      Alert.alert('OTP sent successfully');
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend OTP.';
      set({error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  forgetPassowrd: async email => {
    set({isLoading: true, error: null});
    try {
      await axios.post(`${apiLink}/request-password-reset`, {mobile: email});
      Alert.alert('OTP sent successfully');
      set({isLoading: false, error: null});
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend OTP.';
      set({isLoading: false, error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  verifyForgetPassword: async (email, otp, newPassword) => {
    set({isLoading: true, error: null});
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
      set({error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      set({isLoading: false});
    }
  },

  fetchUserData: async () => {
    const token = get().token;
    if (!token) return;

    set({isLoading: true});
    try {
      const response: any = await axios.get(apiLink, {
        headers: {Authorization: `Bearer ${token}`},
      });
      set({user: response.data});
    } catch (error: any) {
      set({error: error.message});
    } finally {
      set({isLoading: false});
    }
  },

  saveFcmAndDeviceId: async (token, deviceId) => {
    try {
      if (token) {
        await axios.post(`${apiLink}/firebaseToken`, {deviceId, token});
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
      set({error: errorMessage});
      Alert.alert('Error', errorMessage);
      return false;
    }
  },

  initializeUser: async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    const deviceId = await AsyncStorage.getItem('deviceId');
    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        fcmToken,
        deviceId,
      });
    }
  },
  
  logout: async (token: string) => {
    try {
      await axios
        .post(
          `${apiLink}/logout`,
          {},
          {
            headers: {Authorization: `${token}`},
          },
        )
        .then(response => console.log(response));
      // Alert.alert('OTP sent successfully');
      await AsyncStorage.clear();
      set({user: null, token: null});
      return true;
    } catch (error: any) {
      console.log('🚀 ~ logout: ~ error:', error);
      const errorMessage = error.response?.data?.message;
      set({error: errorMessage});
      return false;
    }
  },
}));

export default useAuthStore;
