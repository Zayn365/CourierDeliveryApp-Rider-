import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {homeStyles} from '@assets/css/map';
import FormRenderer from './formRenderer/FormRenderer';
import GoBackButton from './components/GoBackButton';
import Map from './map/Map';
import {RouteProp, useRoute} from '@react-navigation/native';
import usePlaceOrder from '@utils/store/placeOrderStore';
import useAuthStore from '@utils/store/authStore';
import {RootStackParamList} from '@utils/types/types';
import BlurOverlay from './components/BlurOverlay';

type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

const App: React.FC = () => {
  const route = useRoute<HomeRouteProp>();
  const param = route?.params;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetPosition, setBottomSheetPosition] = useState(0);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const data: any = usePlaceOrder();
  const user = useAuthStore();

  const {token} = user;
  const {getUserOrders, currentStep, setCurrentStep, orders} = data;
  const filteredOrders =
    param && orders && orders.find((val: any) => val.id === param.currentOrder);

  useEffect(() => {
    const interval = setInterval(() => {
      getUserOrders(token);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [getUserOrders, token]);

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 8));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));
  
  const currentIndex =
    currentStep === 2 || currentStep === 5 || currentStep === 6
      ? 3
      : currentStep === 4
      ? 1
      : 1;

  const snapPoints = useMemo(() => ['20', '55', '55', '80'], []);

  const handleSheetChanges = useCallback((index: number) => {
    setIsSheetExpanded(index > 0);
    setBottomSheetPosition(index === 3 || index === 4 ? 3 : index);
  }, []);

  return (
    <>
      <View style={{flex: 1}}>
        <GestureHandlerRootView style={homeStyles.overlay}>
          <Map currentStep={currentStep} />
          <BlurOverlay currentStep={currentStep} />
          {/* GoBack Button */}
          <GoBackButton
            setCurrentStep={setCurrentStep}
            snapPoints={snapPoints}
            bottomSheetPosition={bottomSheetPosition}
            currentStep={currentStep}
            prevStep={prevStep}
          />
          {/* Bottom Sheet */}
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={currentIndex}
            enableDynamicSizing={true}
            onChange={handleSheetChanges}
            enablePanDownToClose={false}
            enableOverDrag={false}
            style={{
              backgroundColor: '#27272700',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.0,
              elevation: 24,
            }}
            handleIndicatorStyle={{
              backgroundColor: '#0000001a',
              width: 54,
              marginTop: 5,
            }}>
            <BottomSheetView
              style={homeStyles.contentContainer}
              pointerEvents={isSheetExpanded ? 'auto' : 'none'}>
              <FormRenderer
                setCurrentStep={setCurrentStep}
                nextStep={nextStep}
                currentStep={currentStep}
                currentOrder={param ? filteredOrders : null}
                shouldGet={param && param.stepToGo ? true : false}
              />
            </BottomSheetView>
          </BottomSheet>
        </GestureHandlerRootView>
      </View>
    </>
  );
};

export default App;
