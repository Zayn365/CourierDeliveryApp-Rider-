import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import CustomText from './CustomText';
import {homeStyles} from '@assets/css/map';
import Tick from '@assets/images/icons/tickMilestone.svg';
import Blank from '@assets/images/icons/blinkMilestone.svg';
import Line from '@assets/images/icons/lineHorizontal.svg';

type Props = {
  colorless: boolean;
  status?: string | number | any;
};

function MileStoneTracking({colorless, status}: Props) {
  const blinkAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const properties = [
    {
      title: 'Assigned',
      hasReached: false,
      willReach: false,
    },
    {
      title: 'Pick Up',
      hasReached: false,
      willReach: false,
    },
    {
      title: 'In Route',
      hasReached: false,
      willReach: false,
    },
    {
      title: 'Near By',
      hasReached: false,
      willReach: false,
    },
    {
      title: 'Delivered',
      hasReached: false,
      willReach: false,
    },
  ];

  const statusIndex =
    typeof status === 'string'
      ? properties.findIndex(p => p.title === status)
      : status - 1;

  if (statusIndex >= 0) {
    properties.forEach((item, index) => {
      if (index < statusIndex) {
        item.hasReached = true;
        item.willReach = false;
      } else if (index === statusIndex) {
        item.hasReached = false;
        item.willReach = true;
      } else {
        item.hasReached = false;
        item.willReach = false;
      }
    });
  }

  useEffect(() => {
    if (properties.some(p => p.willReach)) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [blinkAnim, properties]);

  return (
    <View>
      <View
        style={
          colorless
            ? homeStyles.trackingContainerColorless
            : homeStyles.trackingContainer
        }>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {properties.map((val, key) => (
            <React.Fragment key={key}>
              {val.hasReached ? (
                <>
                  <Tick />
                  {key < properties.length - 1 && <Line />}
                </>
              ) : val.willReach ? (
                <>
                  <Animated.View
                    style={[styles.blinkingIcon, {opacity: blinkAnim}]}>
                    <Blank />
                  </Animated.View>
                  {key < properties.length - 1 && <Line />}
                </>
              ) : (
                <>
                  <Blank style={{opacity: 0.6}} />
                  {key < properties.length - 1 && <Line />}
                </>
              )}
            </React.Fragment>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {properties.map((val, key) => (
            <CustomText
              key={val.title + key}
              style={
                val.hasReached
                  ? homeStyles.trackingStep
                  : homeStyles.trackingStepInactive
              }>
              {val.title}
            </CustomText>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blinkingIcon: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MileStoneTracking;
