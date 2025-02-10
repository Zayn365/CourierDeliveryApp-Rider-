import React from 'react';
import Animated from 'react-native-reanimated';
import {homeStyles} from '@assets/css/map';
import Icons from '@utils/imagePaths/imagePaths';
import GetLocation from 'react-native-get-location';
import useMapStore from '@utils/store/mapStore';

type Prop = {
  snapPoints: Array<any>;
  bottomSheetPosition: any;
  currentStep: number;
};

const LocationButton: React.FC<Prop> = ({
  snapPoints,
  bottomSheetPosition,
  currentStep,
}) => {
  const data: any = useMapStore();

  const {fetchAddress, setCurrentLocation} = data;
  const getCurrentLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      fetchAddress(location.latitude, location.longitude, false);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };
  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);
  return (
    <>
      {currentStep !== 1 ? (
        <Animated.View
          style={[
            homeStyles.LocationButton,
            // @ts-ignore
            {bottom: `${snapPoints[bottomSheetPosition]}%`},
          ]}>
          {/* <TouchableOpacity> */}
          <Icons.GetDirections />
          {/* </TouchableOpacity> */}
        </Animated.View>
      ) : null}
    </>
  );
};

export default LocationButton;
