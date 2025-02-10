import React, {useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info'; // Install react-native-device-info for device ID
import {View, TouchableOpacity, Alert} from 'react-native';
import CustomInput from '@components/Ui/CustomInput';
import CustomButton from '@components/Ui/CustomButton';
import {signInStyles} from '@assets/css/auth';
import {useNavigation} from '@react-navigation/native';
import CustomText from '@components/Ui/CustomText';
import useAuthStore from '@utils/store/authStore';
import Icons from '@utils/imagePaths/imagePaths';

const SignInScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigation: any = useNavigation();
  const {
    login,
    fcmToken,
    setFcmToken,
    setDeviceId,
    isLoading,
    saveFcmAndDeviceId,
  } = useAuthStore();

  React.useEffect(() => {
    if (!fcmToken) {
      configureFCMToken();
    }
    // eslint-disable-next-line
  }, []);

  const configureFCMToken = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmtoken = await messaging().getToken();
        setFcmToken(fcmtoken);

        const deviceId = await DeviceInfo.getUniqueId();
        console.log(
          'TCL ~ file: SignIn.tsx:45 ~ fcmtoken ~ deviceId:',
          fcmtoken,
        );
        setDeviceId(deviceId);

        saveFcmAndDeviceId(fcmtoken, deviceId);
      }
    } catch (error) {
      console.error('Error configuring FCM:', error);
    }
  };
  const onSignInPressed = async () => {
    try {
      if (!phone) {
        Alert.alert('Error', 'Please Enter a phone number');
        return;
      }
      if (!password) {
        Alert.alert('Error', 'Please Enter a passwords');
        return;
      }
      await login(phone, password, fcmToken);

      console.log('Sign In pressed');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Something went wrong during signup');
    }
  };

  return (
    <View style={signInStyles.container}>
      <View style={signInStyles.center}>
        <Icons.LogoRed width={140} height={140} />
      </View>
      <View style={signInStyles.subStyleHead}>
        <CustomText isBold={true} style={signInStyles.header}>
          Welcome
        </CustomText>
      </View>
      <CustomInput
        placeholder="Enter your phone number"
        value={phone}
        setValue={setPhone}
        isFocus={false}
        type="number-pad"
      />
      <CustomInput
        placeholder="Enter your password"
        value={password}
        setValue={setPassword}
        isFocus={false}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <CustomText style={signInStyles.forgotPassword}>
          Forgot Password?
        </CustomText>
      </TouchableOpacity>

      <CustomButton
        disabled={isLoading}
        text="Sign In"
        loader={isLoading}
        onPress={onSignInPressed}
      />
    </View>
  );
};

export default SignInScreen;
