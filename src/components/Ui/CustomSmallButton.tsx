import {customSmallBtn} from '@assets/css/main';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

type TextingStyle = {
  label: string | any;
  isActive: boolean;
  onPress: () => void;
};

const CustomSmallButton: React.FC<TextingStyle> = ({
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        customSmallBtn.button,
        isActive ? customSmallBtn.active : customSmallBtn.inactive,
      ]}
      onPress={onPress}>
      <Text
        style={[
          customSmallBtn.text,
          isActive ? customSmallBtn.activeText : customSmallBtn.inactiveText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomSmallButton;
