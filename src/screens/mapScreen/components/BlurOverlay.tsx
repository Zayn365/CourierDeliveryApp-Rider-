import React from 'react';
import Animated from 'react-native-reanimated';
import {homeStyles} from '@assets/css/map';

type Prop = {
  currentStep: number;
};

const BlurOverlay: React.FC<Prop> = ({currentStep}) => {
  return (
    <>
      {currentStep >= 4 && (
        <>
          <Animated.View style={[homeStyles.overlayBg]} />
        </>
      )}
    </>
  );
};

export default BlurOverlay;
