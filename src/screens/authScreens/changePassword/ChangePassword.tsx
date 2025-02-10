import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import CustomInput from '@components/Ui/CustomInput';
import CustomButton from '@components/Ui/CustomButton';
import {signInStyles} from '@assets/css/auth';
import Bubbles from '@assets/images/bgImages/bubbles.svg';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import CustomText from '@components/Ui/CustomText';
import useAuthStore from '@utils/store/authStore';
import {RootStackParamList} from '@utils/types/types';
type VerifyScreenRouteProp = RouteProp<RootStackParamList, 'ChangePassword'>;

const ChangePassword = () => {
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation: any = useNavigation();
  const {verifyForgetPassword, isLoading} = useAuthStore();
  const route = useRoute<VerifyScreenRouteProp>();

  const {email, otp} = route?.params;
  console.log('🚀 ~ ChangePassword ~ email, otp:', email, otp);
  const onSignInPressed = async () => {
    try {
      if (!newPassword) {
        Alert.alert('Error', 'Please Enter a Password number');
        return;
      }
      if (!confirmPassword) {
        Alert.alert('Error', 'Please enter a same Password');
        return;
      }
      if (confirmPassword !== newPassword) {
        Alert.alert('Error', 'Please enter a same Password');
        return;
      }
      const verify = await verifyForgetPassword(email, otp, newPassword);
      if (verify) {
        Alert.alert('Password Changed Successfully');
        navigation.navigate('SignIn');
      }
      console.log(verify);
    } catch (error) {
      console.error('ChangePassord error:', error);
      Alert.alert('Error', 'Something went wrong during ChangePassword');
    }
  };

  return (
    <View style={signInStyles.container}>
      <View style={signInStyles.subStyleHead}>
        <CustomText style={signInStyles.header}>Create New Password</CustomText>
        <Bubbles />
      </View>
      <CustomText style={signInStyles.subHeader}>
        Your new password must be unique from the previous password
      </CustomText>

      <CustomInput
        placeholder="Create a new password"
        value={newPassword}
        setValue={setnewPassword}
        isFocus={false}
        secureTextEntry
        type="number-pad"
      />
      <CustomInput
        placeholder="Confirm your new password"
        value={confirmPassword}
        setValue={setConfirmPassword}
        isFocus={false}
        type="number-pad"
        secureTextEntry
      />

      <CustomButton
        disabled={isLoading || !newPassword || !confirmPassword}
        text="Change Password"
        loader={isLoading}
        onPress={onSignInPressed}
      />
    </View>
  );
};

export default ChangePassword;
