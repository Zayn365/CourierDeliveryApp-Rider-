import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';

interface CustomTextProps extends TextProps {
  style?: TextStyle;
  isBold?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({
  style,
  isBold,
  children,
  ...props
}) => {
  function fontType() {
    if (isBold) {
      return 'Bold';
    }
    return 'Regular';
  }
  return (
    <Text {...props} style={{fontFamily: `Outfit-${fontType()}`, ...style}}>
      {children}
    </Text>
  );
};

export default CustomText;
