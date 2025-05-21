// import React, { useState, useRef } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Animated,
//   PanResponder,
//   GestureResponderEvent,
//   PanResponderGestureState,
//   ViewStyle,
//   TextStyle,
// } from 'react-native';

// interface SliderButtonProps {
//   onSlideComplete: () => void;
//   width?: number;
//   height?: number;
//   title?: string;
//   titleStyle?: TextStyle;
//   backgroundColor?: string;
//   sliderBackgroundColor?: string;
//   sliderColor?: string;
//   sliderText?: string;
//   sliderTextStyle?: TextStyle;
//   containerStyle?: ViewStyle;
//   disabled?: boolean;
//   successText?: string;
//   resetAfterSuccess?: boolean;
//   resetDelay?: number;
// }

// const SliderButton: React.FC<SliderButtonProps> = ({
//   onSlideComplete,
//   width = 300,
//   height = 60,
//   title = 'Slide to confirm',
//   titleStyle,
//   backgroundColor = '#e7e7e7',
//   sliderBackgroundColor = '#FFFFFF',
//   sliderColor = '#4CD964',
//   sliderText = 'Slide',
//   sliderTextStyle,
//   containerStyle,
//   disabled = false,
//   successText = 'Success!',
//   resetAfterSuccess = true,
//   resetDelay = 1000,
// }) => {
//   const [isCompleted, setIsCompleted] = useState(false);
//   const slideCompletionThreshold = 0.7;
//   const buttonWidth = height - 10;
//   const maxSlideDistance = width - buttonWidth - 10;

//   const slideAnimation = useRef(new Animated.Value(0)).current;

//   const resetSlider = () => {
//     Animated.timing(slideAnimation, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     setIsCompleted(false);
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !disabled && !isCompleted,
//       onMoveShouldSetPanResponder: () => !disabled && !isCompleted,
//       onPanResponderGrant: () => {},
//       onPanResponderMove: (
//         _: GestureResponderEvent,
//         gestureState: PanResponderGestureState
//       ) => {
//         const newValue = Math.max(0, Math.min(gestureState.dx, maxSlideDistance));
//         slideAnimation.setValue(newValue);
//       },
//       onPanResponderRelease: (
//         _: GestureResponderEvent,
//         gestureState: PanResponderGestureState
//       ) => {
//         if (gestureState.dx >= maxSlideDistance * slideCompletionThreshold) {
//           // Slide completed
//           Animated.timing(slideAnimation, {
//             toValue: maxSlideDistance,
//             duration: 100,
//             useNativeDriver: true,
//           }).start(() => {
//             setIsCompleted(true);
//             onSlideComplete();

//             if (resetAfterSuccess) {
//               setTimeout(() => {
//                 resetSlider();
//               }, resetDelay);
//             }
//           });
//         } else {
//           // Not completed, return to start
//           Animated.timing(slideAnimation, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // Opacity animation for the text
//   const textOpacity = slideAnimation.interpolate({
//     inputRange: [0, maxSlideDistance * 0.2, maxSlideDistance],
//     outputRange: [1, 0.5, 0],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={[styles.container, containerStyle]}>
//       <View
//         style={[
//           styles.sliderContainer,
//           {
//             width,
//             height,
//             backgroundColor:isCompleted ? sliderColor : backgroundColor,
//             opacity: disabled ? 0.5 : 1,
//           },
//         ]}
//       >
//         {/* Background Text */}
//         <Animated.Text
//           style={[
//             styles.sliderText,
//             titleStyle,
//             {
//               opacity: textOpacity,
//             },
//           ]}
//         >
//           {isCompleted ? successText : title}
//         </Animated.Text>

//         {/* Slider */}
//         <Animated.View
//           style={[
//             styles.slider,
//             {
//               width: buttonWidth,
//               height: buttonWidth,
//               backgroundColor: isCompleted ? sliderColor : sliderBackgroundColor,
//               transform: [{ translateX: slideAnimation }],
//             },
//           ]}
//           {...panResponder.panHandlers}
//         >
//           <Text style={[styles.sliderButtonText, sliderTextStyle]}>
//             {isCompleted ? '✓' : sliderText}
//           </Text>
//         </Animated.View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sliderContainer: {
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor:'#ED1C24'
//   },
//   slider: {
//     position: 'absolute',
//     left: 5,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor:'#ED1C24'
//   },
//   sliderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   sliderButtonText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });

// export default SliderButton;

import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface SliderButtonProps {
    onSlideComplete: () => void;
    width?: number;
    height?: number;
    title?: string;
    titleStyle?: TextStyle;
    backgroundColor?: string;
    sliderBackgroundColor?: string;
    sliderColor?: string;
    sliderText?: string;
    sliderTextStyle?: TextStyle;
    containerStyle?: ViewStyle;
    disabled?: boolean;
    successText?: string;
    resetAfterSuccess?: boolean;
    resetDelay?: number;
}

const SliderButton: React.FC<SliderButtonProps> = ({
    onSlideComplete,
    width = 300,
    height = 60,
    title = 'Slide to confirm',
    titleStyle,
    backgroundColor = '#e7e7e7',
    sliderBackgroundColor = '#FFFFFF',
    sliderColor = '#4CD964',
    sliderText = 'Slide',
    sliderTextStyle,
    containerStyle,
    disabled = false,
    successText = 'Success!',
    resetAfterSuccess = true,
    resetDelay = 1000,
}) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const slideCompletionThreshold = 0.7;
    const buttonWidth = height - 15;
    const maxSlideDistance = width - buttonWidth - 15;

    const slideAnimation = useRef(new Animated.Value(0)).current;

    const resetSlider = () => {
        Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsCompleted(false);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled && !isCompleted,
            onMoveShouldSetPanResponder: () => !disabled && !isCompleted,
            onPanResponderGrant: () => { },
            onPanResponderMove: (
                _: GestureResponderEvent,
                gestureState: PanResponderGestureState
            ) => {
                const newValue = Math.max(0, Math.min(gestureState.dx, maxSlideDistance));
                slideAnimation.setValue(newValue);
            },
            onPanResponderRelease: (
                _: GestureResponderEvent,
                gestureState: PanResponderGestureState
            ) => {
                if (gestureState.dx >= maxSlideDistance * slideCompletionThreshold) {
                    // Slide completed
                    Animated.timing(slideAnimation, {
                        toValue: maxSlideDistance,
                        duration: 100,
                        useNativeDriver: true,
                    }).start(() => {
                        setIsCompleted(true);
                        onSlideComplete();

                        if (resetAfterSuccess) {
                            setTimeout(() => {
                                resetSlider();
                            }, resetDelay);
                        }
                    });
                } else {
                    // Not completed, return to start
                    Animated.timing(slideAnimation, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // Opacity animation for the regular text (not success text)
    const textOpacity = slideAnimation.interpolate({
        inputRange: [0, maxSlideDistance * 0.2, maxSlideDistance],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <View
                style={[
                    styles.sliderContainer,
                    {
                        width,
                        height,
                        backgroundColor: isCompleted ? '#ED1C24' : backgroundColor,
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                {/* Background Text - Two different text components for different states */}
                {isCompleted ? (
                    <Text style={[styles.sliderText, titleStyle, styles.successText]}>
                        {successText}
                    </Text>
                ) : (
                    <Animated.Text
                        style={[
                            styles.sliderText,
                            titleStyle,
                            {
                                opacity: textOpacity,
                            },
                        ]}
                    >
                        {title}
                    </Animated.Text>
                )}

                {/* Slider */}
                <Animated.View
                    style={[
                        styles.slider,
                        {
                            width: buttonWidth,
                            height: buttonWidth,
                            backgroundColor: isCompleted ? sliderColor : sliderBackgroundColor,
                            transform: [{ translateX: slideAnimation }],
                            borderWidth: 10,
                            borderColor: '#fff',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            marginLeft: 0,
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* <Text style={[styles.sliderButtonText, sliderTextStyle]}>
            {isCompleted ? '✓' : sliderText}
          </Text> */}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderContainer: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ED1C24',
    },
    slider: {
        position: 'absolute',
        left: 5,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ED1C24',
    },
    sliderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    successText: {
        color: '#FFFFFF', // Makes success text white for better visibility on colored background
    },
    sliderButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default SliderButton;