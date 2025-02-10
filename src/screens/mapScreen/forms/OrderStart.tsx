import {View} from 'react-native';
import React from 'react';
import {homeStyles} from '@assets/css/map';
import CustomText from '@components/Ui/CustomText';
import Icons from '@utils/imagePaths/imagePaths';
import CustomButton from '@components/Ui/CustomButton';
import {getParcelTypeText, OrderIdSpliter} from '@utils/helper/helperFunctions';
import {handleUpdateStatus} from '../helperFunctions/helper';
import {OrderStatusEnum} from '@utils/enums/enum';
type Props = {
  nextStep: () => void;
  packageData: any;
  token: string;
};

const OrderStart: React.FC<Props> = ({nextStep, packageData, token}) => {
  const orderNumber = OrderIdSpliter(packageData?.id);
  const parcelType = getParcelTypeText(packageData?.parcelType);
  const SendLocations = () => {
    handleUpdateStatus(packageData?.id, OrderStatusEnum.OUT_FOR_PICKUP, token);
    nextStep();
  };

  return (
    <View style={homeStyles.bottomSheetContent}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={homeStyles.myCube}>
          <Icons.Cube />
          <View style={{marginLeft: 10}}>
            <CustomText style={homeStyles.myLocationText}>
              Parcel Type
            </CustomText>
            <CustomText style={homeStyles.mySubText}>
              {parcelType}
              {Number(packageData?.parcelType) === 1 &&
                ` (${packageData?.weight} KG/s)`}
            </CustomText>
            <CustomText isBold={true} style={homeStyles.boxBelow}>
              {packageData?.parcelType === 1
                ? 'Take Red Box'
                : 'Take Express Flyer'}
            </CustomText>
          </View>
        </View>
        <View>
          <CustomText style={homeStyles.bookingHead}>Booking #</CustomText>
          <CustomText isBold={true} style={homeStyles.bookingNumber}>
            {orderNumber}
          </CustomText>
        </View>
      </View>
      {/* PickUp Info */}
      <View style={homeStyles.myLocation}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Icons.MyLocation />
          <Icons.LineVertical />
          <Icons.LineVertical />
        </View>
        <View style={{marginLeft: 10}}>
          <CustomText style={homeStyles.myLocationText}>Pickup</CustomText>
          <CustomText style={homeStyles.mySubText}>
            {' '}
            {packageData?.pickUpAddress}
          </CustomText>
        </View>
      </View>

      {/* Delivery Info */}
      <View style={homeStyles.deliveryLocation}>
        <Icons.MapIcon />
        <View style={{marginLeft: 15}}>
          <CustomText style={homeStyles.myLocationText}>Delivery</CustomText>
          <CustomText style={homeStyles.mySubText}>
            {packageData?.consigneeAddress}
          </CustomText>
        </View>
      </View>
      <CustomButton onPress={SendLocations} text="Start" />
    </View>
  );
};

export default OrderStart;

// const styles = StyleSheet.create({
//   dropdownContainer: {
//     maxHeight: 150, // Limit dropdown height for scrollability
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginTop: 5,
//     elevation: 3, // Add shadow for better visibility
//     zIndex: 1, // Ensure dropdown appears above other elements
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: '#333',
//   },
// });
