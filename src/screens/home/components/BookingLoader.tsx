import {Animated, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {home} from '@assets/css/home';
import CustomText from '@components/Ui/CustomText';

// type Props = {}

const BookingLoader = () => {
  const outerCircleAnim = useRef(new Animated.Value(0)).current;
  const middleCircleAnim = useRef(new Animated.Value(0)).current;
  const innerCircleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateCircle = (anim: any, scale: any) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: scale,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateCircle(outerCircleAnim, 1.2);
    animateCircle(middleCircleAnim, 1.15);
    animateCircle(innerCircleAnim, 1.1);
  }, [outerCircleAnim, middleCircleAnim, innerCircleAnim]);

  return (
    <>
      {/* Main Section */}
      <View style={home.mainContainer}>
        <Animated.View
          style={[
            home.radarCircleOuter,
            {transform: [{scale: outerCircleAnim}]},
          ]}>
          <Animated.View
            style={[
              home.radarCircleMiddle,
              {transform: [{scale: middleCircleAnim}]},
            ]}>
            <Animated.View
              style={[
                home.radarCircleInner,
                {transform: [{scale: innerCircleAnim}]},
              ]}
            />
          </Animated.View>
        </Animated.View>
        <CustomText style={home.statusText}>LOOKING FOR BOOKINGS</CustomText>
      </View>
    </>
  );
};

export default BookingLoader;

// const styles = StyleSheet.create({})
