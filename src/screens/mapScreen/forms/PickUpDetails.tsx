import {Image, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import React from 'react';
import {homeStyles} from '@assets/css/map';
import CustomText from '@components/Ui/CustomText';
import Icons from '@utils/imagePaths/imagePaths';
import CustomButton from '@components/Ui/CustomButton';
import {
  AddCommas,
  getParcelTypeText,
  OrderIdSpliter,
} from '@utils/helper/helperFunctions';
import {handleUpdateStatus, paymentReceived} from '../helperFunctions/helper';
import {OrderStatusEnum} from '@utils/enums/enum';
import {callFunction} from '@utils/helper/helperFunctions';
import {styles} from '@assets/css/activeOrders';
import CustomIcons from '@utils/imagePaths/customSvgs';
import {API_URL} from '@env';
type Props = {
  nextStep: () => void;
  packageData: any;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  token: string;
};
const PickUpDetails: React.FC<Props> = ({
  nextStep,
  // setCurrentStep,
  token,
  packageData,
}) => {
  const parcelType = getParcelTypeText(
    packageData?.parcelType ? packageData?.parcelType : 1,
  );
  const orderNumber = OrderIdSpliter(packageData?.id);

  const UpdateStatus = () => {
    handleUpdateStatus(packageData?.id, OrderStatusEnum.IN_TRANSIT, token);
    nextStep();
  };
  const Payment = async (amount: number) => {
    try {
      await paymentReceived(packageData?.id, amount, token);
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <>
      <View style={homeStyles.ViewScrollable}>
        <ScrollView
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={homeStyles.bottomSheetContentScroll}>
            <View style={homeStyles.pickupTop}>
              <CustomText isBold={true} style={homeStyles.heading}>
                Pickup
              </CustomText>
              <View>
                <CustomText style={homeStyles.bookingHead}>
                  Booking #
                </CustomText>
                <CustomText isBold={true} style={homeStyles.bookingNumber}>
                  {orderNumber}
                </CustomText>
              </View>
            </View>

            <View style={homeStyles.card}>
              {/* Parcel Information */}
              <View style={homeStyles.infoSection}>
                <View style={homeStyles.myLocationWithSpace}>
                  <Icons.MyLocation />
                  <View style={{marginLeft: 10}}>
                    <CustomText style={homeStyles.myLocationText}>
                      {packageData?.customer?.name}
                    </CustomText>
                    <CustomText style={homeStyles.mySubText}>
                      {packageData?.pickUpAddress}
                    </CustomText>
                  </View>
                </View>

                {/* Delivery Info */}
                <View style={homeStyles.deliveryLocation}>
                  <Icons.Cube />
                  <View style={{marginLeft: 8}}>
                    <CustomText style={homeStyles.myLocationText}>
                      Parcel Information
                    </CustomText>
                    <CustomText style={homeStyles.mySubText}>
                      {parcelType}
                      {Number(packageData?.parcelType) === 1 &&
                        ` (${packageData?.weight} KG/s)`}
                    </CustomText>
                  </View>
                </View>

                {/* Images (Placeholder for parcel images) */}
                <View style={{justifyContent: 'flex-start'}}>
                  <View style={homeStyles.imageContainer}>
                    {packageData?.OrderPhotos?.length > 0 &&
                      packageData?.OrderPhotos?.map((val: any, key: number) => {
                        console.log(`${API_URL}${val.photoUrl}`);
                        return (
                          <Image
                            key={key}
                            source={{uri: `${API_URL}${val.photoUrl}`}}
                            width={80}
                            height={80}
                          />
                        );
                      })}
                  </View>
                </View>
              </View>

              {/* Payment and Consignment Info */}
              <View style={homeStyles.paymentSection}>
                <View style={homeStyles.infoSection}>
                  <View style={homeStyles.myLocationWithSpace}>
                    <Icons.Note width={20} height={20} />
                    <View style={{marginLeft: 10}}>
                      <CustomText style={homeStyles.myPaymentText}>
                        Payment
                      </CustomText>
                      <CustomText style={homeStyles.myPaySubText}>
                        Rs.{' '}
                        {packageData?.price
                          ? AddCommas(packageData?.price)
                          : packageData?.price}
                      </CustomText>
                    </View>
                  </View>
                  <View
                    style={
                      packageData?.paymentType === 1
                        ? [(styles.status, styles.pickedUp)]
                        : [(styles.status, styles.inProgress)]
                    }>
                    <CustomText
                      isBold={true}
                      style={
                        packageData?.paymentType === 1
                          ? styles.statusTextPickup
                          : styles.statusText
                      }>
                      {packageData?.paymentType === 1
                        ? 'Cash On Pickup'
                        : 'Paid Online'}
                    </CustomText>
                  </View>
                </View>
                <View style={homeStyles.infoSection}>
                  <View style={homeStyles.consigneeTag}>
                    <Icons.tickBoxRed width={20} height={20} />
                    <View style={{marginLeft: 10}}>
                      <CustomText style={homeStyles.myPaymentText}>
                        Consignment#
                      </CustomText>
                      <CustomText style={homeStyles.mySubText}>
                        {packageData?.orderId && packageData?.orderId}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </View>
              {packageData?.paymentType === 1 ? (
                <CustomButton
                  disabled={packageData.amountReceived ? true : false}
                  onPress={() => {
                    Payment(packageData?.price ? packageData?.price : 0);
                  }}
                  customStyle={{marginTop: 0}}
                  text={
                    packageData.amountReceived ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <CustomIcons.TickIcon color="#4CD964" />
                        <CustomText
                          style={{fontSize: 17, paddingHorizontal: 5}}>
                          Received
                        </CustomText>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <CustomIcons.TickIcon color="#bdbdbd" />

                        <CustomText
                          style={{fontSize: 17, paddingHorizontal: 5}}>
                          Cash Pick Up
                        </CustomText>
                      </View>
                    )
                  }
                  isWhite={true}
                />
              ) : (
                ''
              )}
              {/* Action Buttons */}
              <View style={homeStyles.actions}>
                {/* Scan QR Code Icon */}
                {/* <TouchableOpacity onPress={Scan} style={homeStyles.iconButton}>
                  <Icons.Scan />
                  <CustomText style={homeStyles.iconText}>
                    SCAN QR CODE ON SHIPMENT{' '}
                  </CustomText>
                </TouchableOpacity> */}

                {/* Call Shipper Icon */}
                <TouchableOpacity
                  onPress={() => callFunction(packageData?.customer?.mobile)}
                  style={[homeStyles.iconButton, homeStyles.callButtonNew]}>
                  <Icons.phoneGreen />
                  <CustomText style={homeStyles.callText}>
                    CALL SHIPPER
                  </CustomText>
                </TouchableOpacity>

                {/* Cancel Booking Icon */}
                {/* <TouchableOpacity
                  onPress={() => setCurrentStep(55)}
                  style={[homeStyles.iconButton, homeStyles.cancelButtonNew]}>
                  <Icons.Cancel />
                  <CustomText style={homeStyles.cancelText}>
                    CANCEL BOOKING
                  </CustomText>
                </TouchableOpacity> */}
              </View>
            </View>
            {packageData?.paymentType !== 1 ? (
              <CustomButton text="Complete Pickup" onPress={UpdateStatus} />
            ) : (
              <CustomButton
                disabled={
                  packageData?.amountReceived && packageData?.amountReceived
                    ? false
                    : true
                }
                text="Complete Pickup"
                onPress={UpdateStatus}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default PickUpDetails;
