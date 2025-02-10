// import {StackNavigationProp} from '@react-navigation/stack';
// import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  SignIn: undefined;
  Verify: {userId?: string; email: string; type: string};
  SignUp: undefined;
  Home: {stepToGo: string | number | any; currentOrder: any | null};
  ChangePassword: {email: string; otp: string};
};

// type VerifyScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'Verify'
// >;
// type VerifyScreenRouteProp = RouteProp<RootStackParamList, 'Verify'>;
