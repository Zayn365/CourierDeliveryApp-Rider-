import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import CustomInput from '@components/Ui/CustomInput';
import CustomButton from '@components/Ui/CustomButton';
import {signInStyles} from '@assets/css/auth';
import Bubbles from '@assets/images/bgImages/bubbles.svg';
import {useNavigation} from '@react-navigation/native';
import CustomText from '@components/Ui/CustomText';
import useAuthStore from '@utils/store/authStore';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const navigation: any = useNavigation();
  const {forgetPassowrd, isLoading} = useAuthStore();
  const onSignInPressed = async () => {
    try {
      try {
        const data: any = await forgetPassowrd(email);
        if (data) {
          navigation.navigate('Verify', {email: email, type: 'passwordchange'});
        }
      } catch (error) {
        console.error('FogetPassword error:', error);
        Alert.alert('Error', 'Something went wrong');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={signInStyles.container}>
      <View style={signInStyles.subStyleHead}>
        <CustomText style={signInStyles.header}>Forgot Password?</CustomText>
      </View>
      <CustomText isBold style={signInStyles.subHeader}>
        Enter your registered mobile number.
      </CustomText>

      <CustomInput
        placeholder="Enter your number"
        value={email}
        setValue={setEmail}
        isFocus={false}
        type="number-pad"
      />
      <CustomButton
        disabled={isLoading || !email}
        text="Verify"
        loader={isLoading}
        onPress={onSignInPressed}
      />
    </View>
  );
};

export default ForgetPassword;
