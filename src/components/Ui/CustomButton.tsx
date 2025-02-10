import React from 'react';
import {Pressable, ActivityIndicator, ViewStyle} from 'react-native';
import {customButtons} from '@assets/css/main';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';

type ButtonType = {
  text: string | any;
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  loader?: boolean;
  isWhite?: boolean;
  customStyle?: ViewStyle | ViewStyle[]; // Accept custom styles
};

const CustomButton: React.FC<ButtonType> = ({
  text,
  onPress,
  disabled,
  loader,
  isWhite,
  customStyle,
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        isWhite
          ? customButtons.buttonWhiteContainer
          : customButtons.buttonContainer,
        customStyle, // Apply custom styles
      ]}>
      <LinearGradient
        colors={
          disabled
            ? ['#c3c3c340', '#c3c3c340']
            : isWhite
            ? ['#fff', '#fff']
            : ['rgba(160,27,33,1)', 'rgba(237,28,36,1)', 'rgba(160,27,33,1)']
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={customButtons.button}>
        {loader ? (
          <ActivityIndicator size={26} color="rgba(160,27,33,1)" />
        ) : (
          <CustomText
            isBold={true}
            style={
              isWhite
                ? customButtons.textWhite
                : disabled
                ? customButtons.textDisabled
                : customButtons.text
            }>
            {text}
          </CustomText>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default CustomButton;
