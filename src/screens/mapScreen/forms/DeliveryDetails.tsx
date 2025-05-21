import { TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { homeStyles } from '@assets/css/map';
import CustomText from '@components/Ui/CustomText';
import CustomButton from '@components/Ui/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';
import Icons from '@utils/imagePaths/imagePaths';
import { getParcelTypeText, OrderIdSpliter } from '@utils/helper/helperFunctions';
import { handleUpdateStatus } from '../helperFunctions/helper';
import { OrderStatusEnum } from '@utils/enums/enum';
import { callFunction } from '@utils/helper/helperFunctions';
import useMapStore from '@utils/store/mapStore';
import CountdownTimer from '../components/CountdownTimer';
import usePlaceOrder from '@utils/store/placeOrderStore';
import CustomModal from '@components/Ui/CustomModal';

type Props = {
  nextStep: () => void;
  packageData: any;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  token: string;
};

const DeliveryDetails: React.FC<Props> = ({
  nextStep,
  packageData,
  setCurrentStep,
  token,
}) => {
  // console.log('TCL ~ packageData DELIVERY:', packageData);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const { destination, riderLocation }: any = useMapStore();
  const { updateStatus } = usePlaceOrder();

  function haversineDistance(coord1: any, coord2: any) {
    const R = 6371;
    const toRadians = (degrees: any) => (degrees * Math.PI) / 180;

    const lat1 = coord1.latitude;
    const lon1 = coord1.longitude;
    const lat2 = coord2.latitude;
    const lon2 = coord2.longitude;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      if (destination && riderLocation) {
        const distance = haversineDistance(destination, riderLocation);
        if (
          distance <= 2 &&
          packageData?.orderStatus !== OrderStatusEnum.OUT_FOR_DELIVERY
        ) {
          await handleUpdateStatus(
            packageData?.id,
            OrderStatusEnum.OUT_FOR_DELIVERY,
            token,
          );
        } else {
          console.log(
            'Rider is farther than 2 kilometers from the destination.',
          );
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    destination,
    packageData?.id,
    packageData?.orderStatus,
    riderLocation,
    token,
  ]);

  // Memoized Values (UseMemo Applied Properly)
  const parcelType = useMemo(
    () =>
      getParcelTypeText(packageData?.parcelType ? packageData?.parcelType : 1),
    [packageData?.parcelType],
  );

  const orderNumber = useMemo(
    () => OrderIdSpliter(packageData?.id) || 0,
    [packageData?.id],
  );

  const UpdateConsignmentStatus = async () => {
    nextStep();
  };

  return (
    <>
      <View style={homeStyles.ViewScrollable}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={homeStyles.bottomSheetContentScroll}>
            <View style={homeStyles.pickupTop}>
              <CustomText isBold={true} style={[homeStyles.heading, { marginBottom: 8, fontSize: 25 }]}>
                Delivery
              </CustomText>
              {/* <View>
                <CustomText style={homeStyles.bookingHead}>
                  Booking #
                </CustomText>
                <CustomText isBold={true} style={homeStyles.bookingNumber}>
                  {orderNumber}
                </CustomText>
              </View> */}
            </View>

            <View style={[homeStyles.pickupTop, { marginBottom: 4 }]}>
              <View style={{ marginVertical: 0 }}>
                <CustomText style={{ fontSize: 12, color: '#757575', textAlign: 'left' }}>
                  Consignment #
                </CustomText>
                <CustomText isBold={true} style={{ textAlign: 'left', fontSize: 16, color: '#465061' }}>
                  {packageData?.orderId && packageData?.orderId}
                </CustomText>
              </View>

              {packageData?.pickUpTime && <View>
                <CustomText style={{ fontSize: 12, color: '#757575', textAlign: 'left' }}>
                  Remaining Time
                </CustomText>
                <CountdownTimer backendTime={packageData?.pickUpTime} />
                {/* <CountdownTimer backendTime={Date.now()} /> */}
              </View>}

            </View>


            <View style={homeStyles.card}>
              {/* Parcel Information */}
              <View style={homeStyles.infoSection}>
                <View style={homeStyles.myLocationWithSpace}>
                  <Icons.MyLocation />
                  <View style={{ marginLeft: 10 }}>
                    <CustomText style={homeStyles.myLocationText}>
                      {packageData?.consigneeName}
                    </CustomText>
                    <CustomText style={homeStyles.mySubText}>
                      {packageData?.consigneeAddress}
                    </CustomText>
                  </View>
                </View>

                {/* Delivery Info */}
                <View style={homeStyles.deliveryLocation}>
                  <Icons.Cube />
                  <View style={{ marginLeft: 8 }}>
                    <CustomText style={homeStyles.myLocationText}>
                      Parcel Information
                    </CustomText>
                    <CustomText style={homeStyles.mySubText}>
                      {parcelType}
                      {Number(packageData?.parcelType) === 1 &&
                        ` (${packageData?.weight} KG/s)`}
                    </CustomText>
                    {/* <CustomText style={homeStyles.mySubText}>
                      Consignment #
                      {packageData?.orderId && packageData?.orderId}
                    </CustomText> */}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={homeStyles.actions}>

                  {/* Call Shipper Icon */}
                  <TouchableOpacity
                    onPress={() => callFunction(packageData?.consigneePhone)}
                    style={[homeStyles.iconButton, homeStyles.callButtonNew]}>
                    <Icons.phoneGreen />
                    <CustomText style={homeStyles.callText}>
                      CALL RECIPIENT
                    </CustomText>
                  </TouchableOpacity>

                  {/* Cancel Booking Icon */}
                  <TouchableOpacity
                    // onPress={() => setCurrentStep(66)}
                    // onPress={() => {
                    //   // console.log(OrderStatusEnum.RETURN_IN_PROGRESS,packageData?.id,packageData?.orderStatus,packageData?.orderId);
                    //   setCurrentStep(66)
                    //   updateStatus(packageData?.id, OrderStatusEnum.RETURN_IN_PROGRESS, token)
                    // }}
                    onPress={() => {
                      setReturnModalVisible(true);
                    }}
                    style={[homeStyles.iconButton, homeStyles.cancelButtonNew]}>
                    <Icons.Cancel />
                    <CustomText style={homeStyles.cancelText}>
                      RETURN SHIPMENT{' '}
                    </CustomText>
                  </TouchableOpacity>

                </View>

              </View>
              <CustomButton onPress={UpdateConsignmentStatus} text="Finish Delivery" />{' '}
            </View>
          </View>
        </ScrollView>
        <CustomModal
          title="Confirm Return Shipment?"
          visible={returnModalVisible}
          onYesPress={() => {
            // console.log(OrderStatusEnum.RETURN_IN_PROGRESS,packageData?.id,packageData?.orderStatus,packageData?.orderId);
            setCurrentStep(66)
            updateStatus(packageData?.id, OrderStatusEnum.RETURN_IN_PROGRESS, token)
            setReturnModalVisible(false);
          }}
          onNoPress={() => setReturnModalVisible(false)}
          onClosePress={() => setReturnModalVisible(false)}
        />
      </View>
    </>
  );
};

export default DeliveryDetails;
