import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {OtpInput} from 'react-native-otp-entry';
import CustomButton from '@components/Ui/CustomButton';
import {verifyStyles} from '@assets/css/auth';
import Bubbles from '@assets/images/bgImages/bubbles.svg';
import CustomText from '@components/Ui/CustomText';
import {RootStackParamList} from '@utils/types/types';
import useAuthStore from '@utils/store/authStore';

type VerifyScreenRouteProp = RouteProp<RootStackParamList, 'Verify'>;
type SignInRouteProp = RouteProp<RootStackParamList, 'SignIn'>;
const VerifyScreen: React.FC = () => {
  const [time, setTime] = useState(30);
  const [otp, setOtp] = useState('');
  const [tries, setTries] = useState(3);
  const {verify, isLoading, resend} = useAuthStore();
  const navigation: any = useNavigation<SignInRouteProp>();
  const route = useRoute<VerifyScreenRouteProp>();

  const {userId, email, type} = route?.params;

  const onVerify = async () => {
    if (type === 'signup') {
      const verification = await verify(userId, otp);
      if (verification) navigation.navigate('SignIn');
    } else {
      navigation.navigate('ChangePassword', {email, otp});
    }
  };

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setTime(0);
    }
  }, [time]);

  const Resend = async () => {
    if (tries > 0) {
      const type = 'signup';
      await resend(email, type);
      setTime(30);
      setTries(tries - 1);
    } else {
      Alert.alert('You have Reached the maximum number of attempts');
    }
  };
  return (
    <View style={verifyStyles.container}>
      <View style={verifyStyles.subStyleHead}>
        <CustomText style={verifyStyles.header}>OTP Verification</CustomText>
        <Bubbles />
      </View>
      <CustomText style={verifyStyles.subHeader}>
        Enter the verification code we just sent on your phone number and email.
      </CustomText>
      <View style={{height: '30%', margin: 0}}>
        <OtpInput
          numberOfDigits={6}
          focusColor="#ED1C24"
          focusStickBlinkingDuration={500}
          onTextChange={text => setOtp(text)}
          onFilled={text => console.log(`OTP is ${text}`)}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          theme={{
            containerStyle: verifyStyles.containerDigits,
            pinCodeContainerStyle: verifyStyles.pinCodeContainer,
            pinCodeTextStyle: verifyStyles.pinCodeText,
            focusStickStyle: verifyStyles.focusStick,
            focusedPinCodeContainerStyle: verifyStyles.activePinCodeContainer,
          }}
        />
      </View>
      <View style={{height: '30%', margin: 0}}>
        <CustomText style={verifyStyles.timer}>
          00:{time < 10 ? `0${time}` : time}
        </CustomText>
        <TouchableOpacity onPress={Resend} disabled={time > 0}>
          <CustomText
            style={
              time > 0
                ? verifyStyles.resendCodeDisable
                : verifyStyles.resendCode
            }>
            Resend OTP
          </CustomText>
        </TouchableOpacity>

        <CustomButton
          loader={isLoading}
          disabled={isLoading || (otp.split('')?.length !== 6 ? true : false)}
          text="Verify"
          onPress={onVerify}
        />
      </View>
    </View>
  );
};

export default VerifyScreen;
