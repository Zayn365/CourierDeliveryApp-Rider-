import React from 'react';
import {ToastConfig, ToastShowParams} from 'react-native-toast-message';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

// Custom styles for toasts
const toastConfig: ToastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#28a745', backgroundColor: '#d4edda'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#155724',
        fontFamily: 'Outfit-Regular',
      }}
      text2Style={{
        fontSize: 14,
        color: '#155724',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: '#dc3545', backgroundColor: '#f8d7da'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Outfit-Regular',
        fontWeight: 'bold',
        color: '#721c24',
      }}
      text2Style={{
        fontSize: 14,
        color: '#721c24',
      }}
    />
  ),
};

// Function to show toast notifications
const showToast = (
  type: 'success' | 'error',
  text1: string,
  text2?: string,
) => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime: 3000,
    position: 'top',
  } as ToastShowParams);
};
const errorToast = (message: string) => showToast('error', 'Error!', message);
const successToast = (message: string) =>
  showToast('success', 'Success!', message);
export {Toast, toastConfig, showToast, errorToast, successToast};