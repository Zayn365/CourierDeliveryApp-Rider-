import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

// Define the props interface
interface RadioButtonProps {
  label: string;
  isSelected: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={isSelected ? styles.radioCircle : styles.InActiveRadioCircle}>
        {isSelected && <View style={styles.selectedRb} />}
      </View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 12,
    borderWidth: 12,
    borderColor: '#ED1C24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  InActiveRadioCircle: {
    height: 23,
    width: 23,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#04244440',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default RadioButton;
