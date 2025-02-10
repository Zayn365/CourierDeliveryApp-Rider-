import React from 'react';
import {View} from 'react-native';
import {styles} from '@assets/css/splashScreen';
import Logo from '@assets/images/logos/logo.svg';

const TCSNowScreen = () => {
  return (
    <View style={styles.background}>
      <Logo />
    </View>
  );
};

export default TCSNowScreen;
