// import React, {useState} from 'react';
// import {
//   KeyboardTypeOptions,
//   TextInput,
//   View,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import {customInput} from '@assets/css/main';
// import Icons from '@utils/imagePaths/imagePaths';

// type TextInputType = {
//   ref?: any;
//   placeholder: string;
//   value: string | number;
//   readonly?: boolean;
//   setValue?: React.Dispatch<React.SetStateAction<any>>;
//   secureTextEntry?: boolean;
//   isFocus?: boolean;
//   type?: KeyboardTypeOptions;
//   style?: any;
//   multiline?: boolean;
//   numberOfLines?: number;
//   isEditable?: boolean;
// };

// const CustomInput: React.FC<TextInputType> = ({
//   ref,
//   placeholder,
//   value,
//   setValue,
//   secureTextEntry = false,
//   isFocus,
//   type = 'default',
//   style,
//   multiline,
//   numberOfLines,
//   isEditable,
// }) => {
//   const [isFocused, setIsFocused] = useState(isFocus);
//   const [isSecure, setIsSecure] = useState(secureTextEntry);
//   const handleInputChange = (text: string) => {
//     if (type === 'number-pad') {
//       const filteredText = text.replace(/[^0-9]/g, '');
//       if (filteredText.length <= 11) {
//         setValue?.(filteredText);
//       }
//     } else {
//       setValue?.(text);
//     }
//   };
//   return (
//     <View style={[customInput.container, styles.container]}>
//       <TextInput
//         ref={ref}
//         style={[
//           isFocused
//             ? {...customInput.input, ...customInput.focusedInput, ...style}
//             : {...customInput.input, ...customInput.unFocusedInput, ...style},
//           styles.input,
//         ]}
//         editable={isEditable}
//         placeholder={placeholder}
//         value={value as string}
//         multiline={multiline ? true : false}
//         numberOfLines={numberOfLines}
//         keyboardType={type}
//         // onChangeText={setValue}
//         onChangeText={handleInputChange}
//         secureTextEntry={isSecure}
//         placeholderTextColor="#999"
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//       />
//       {secureTextEntry && (
//         <TouchableOpacity
//           style={styles.iconContainer}
//           onPress={() => setIsSecure(!isSecure)}>
//           {isSecure ? (
//             <Icons.EyeClose width={20} height={20} />
//           ) : (
//             <Icons.EyeOpen width={20} height={20} />
//           )}
//           {/* <MaterialIcons
//             name={isSecure ? 'visibility-off' : 'visibility'}
//             size={20}
//             color="#999"
//           /> */}
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     width: '100%',
//   },
//   input: {
//     paddingRight: 40, // Add padding to make space for the icon
//   },
//   iconContainer: {
//     position: 'absolute',
//     right: 10,
//     top: '50%',
//     transform: [{translateY: -10}],
//   },
// });

// export default CustomInput;

import React, {useState} from 'react';
import {
  KeyboardTypeOptions,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Text, // Added for displaying +92
} from 'react-native';
import {customInput} from '@assets/css/main';
import Icons from '@utils/imagePaths/imagePaths';
type TextInputType = {
  ref?: any;
  placeholder: string | undefined;
  value: string | number | undefined;
  readonly?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  secureTextEntry?: boolean;
  isFocus?: boolean;
  type?: KeyboardTypeOptions;
  style?: any;
  multiline?: boolean;
  isEditable?: boolean;
  numberOfLines?: number;
};
const CustomInput: React.FC<TextInputType> = ({
  placeholder,
  value,
  ref,
  setValue,
  secureTextEntry = false,
  isFocus,
  type = 'default',
  style,
  isEditable,
  multiline,
  numberOfLines,
}) => {
  const [isFocused, setIsFocused] = useState(isFocus);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [phoneDigit, setPhoneDigit] = useState<string>('');
  const isPhoneInput = type === 'phone-pad';
  const handleInputChange = (text: string) => {
    if (type === 'phone-pad') {
      const raw = text.replace(/[^0-9]/g, '').slice(0, 10);
      const filteredText = raw.length > 0 ? '3' + raw.slice(1) : '';
      setPhoneDigit(filteredText); // shows the corrected input in the UI
      setValue?.(`92${filteredText}`); // stores final value with 92 prefix
    } else {
      setValue?.(text);
    }
  };
  return (
    <View style={[customInput.container, styles.container]}>
      {isPhoneInput && (
        <View style={styles.prefixContainer}>
          <Text style={styles.prefix}>+92</Text>
        </View>
      )}
      <TextInput
        ref={ref}
        style={[
          isFocused
            ? {...customInput.input, ...customInput.focusedInput, ...style}
            : {...customInput.input, ...customInput.unFocusedInput, ...style},
          styles.input,
          isPhoneInput ? {paddingLeft: (isPhoneInput && phoneDigit === '') ? 45 :45} : {},
        ]}
        editable={isEditable}
        placeholder={placeholder}
        value={type === 'phone-pad' ? phoneDigit : (value as string)}
        multiline={multiline ? true : false}
        numberOfLines={numberOfLines}
        keyboardType={type}
        onChangeText={handleInputChange}
        aria-disabled
        secureTextEntry={isSecure}
        placeholderTextColor="#999"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setIsSecure(!isSecure)}>
          {isSecure ? (
            <Icons.EyeClose width={20} height={20} />
          ) : (
            <Icons.EyeOpen width={20} height={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    fontFamily: 'Outfit-Regular',
    paddingRight: 40,
    color: '#737B85',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
  prefixContainer: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{translateY: -12}],
    zIndex: 1,
  },
  prefix: {
    color: '#737B85',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    marginTop:1
  },
});
export default CustomInput;









