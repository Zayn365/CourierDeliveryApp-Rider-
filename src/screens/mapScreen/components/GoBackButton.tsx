import React from 'react';
import Animated from 'react-native-reanimated';
import {homeStyles} from '@assets/css/map';
import Icons from '@utils/imagePaths/imagePaths';
import {useNavigation} from '@react-navigation/native';

type Prop = {
  currentStep: number;
  prevStep: () => void;
  snapPoints: Array<any>;
  bottomSheetPosition: any;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const GoBackButton: React.FC<Prop> = ({
  currentStep,
  prevStep,
  snapPoints,
  setCurrentStep,
  bottomSheetPosition,
}) => {
  const navigation = useNavigation();

  function goBack() {
    if (currentStep === 1) {
      navigation.goBack();
      return;
    } else if (currentStep === 66) {
      setCurrentStep(3);
    } else if (currentStep === 55 || currentStep === 77) {
      setCurrentStep(2);
    } else {
      prevStep();
    }
  }
  return (
    <>
      {(currentStep === 1 || currentStep === 4 || currentStep > 6) && (
        <>
          <Animated.View
            style={[
              homeStyles.goBackButton,
              // @ts-ignore
              {bottom: `${snapPoints[bottomSheetPosition]}%`},
            ]}>
            {/* <TouchableOpacity onPress={prevStep}> */}
            <Icons.GoBackIcon onPress={goBack} />
            {/* </TouchableOpacity> */}
          </Animated.View>
        </>
      )}
    </>
  );
};

export default GoBackButton;
