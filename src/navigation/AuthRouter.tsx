import {TouchableOpacity} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../screens/authScreens/signIn/SignIn';
import Verify from '../screens/authScreens/verify/Verify';
import ForgetPassword from '../screens/authScreens/forgotPassword/ForgetPassword';
import ChangePassword from '../screens/authScreens/changePassword/ChangePassword';
const Stack = createNativeStackNavigator();
import Icons from '../utils/imagePaths/imagePaths';
import {useNavigation} from '@react-navigation/native';

const Router = ({}) => {
  const navigation = useNavigation();

  return (
    <>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerShown: true,
          animation: 'slide_from_right',
          animationDuration: 1000,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerBackButtonMenuEnabled: true,
          headerTintColor: '#465061',
          headerTitleStyle: {
            color: '#465061',
            fontSize: 18,
            fontWeight: '600',
            fontFamily: 'Outfit-Regular',
          },
          headerLeft: ({canGoBack}) =>
            canGoBack ? (
              <TouchableOpacity
                onPress={() => navigation.canGoBack() && navigation.goBack()}>
                <Icons.BackIcon width={34} height={34} />{' '}
              </TouchableOpacity>
            ) : null,
        }}>
        <Stack.Screen
          name="SignIn"
          options={{title: 'Sign In', headerShown: false}}
          component={SignIn}
        />
        <Stack.Screen
          name="Verify"
          options={{title: 'Verify'}}
          component={Verify}
        />
        <Stack.Screen
          name="ForgetPassword"
          options={{title: 'Forget Password'}}
          component={ForgetPassword}
        />
        <Stack.Screen
          name="ChangePassword"
          options={{title: 'New Password'}}
          component={ChangePassword}
        />
      </Stack.Navigator>
    </>
  );
};

export default Router;
