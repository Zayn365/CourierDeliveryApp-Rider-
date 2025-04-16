import { Image, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import { homeStyles } from '@assets/css/map';
import CustomText from '@components/Ui/CustomText';
import Icons from '@utils/imagePaths/imagePaths';
import CustomButton from '@components/Ui/CustomButton';
import {
  AddCommas,
  getParcelTypeText,
  OrderIdSpliter,
} from '@utils/helper/helperFunctions';
import { handleUpdateStatus, paymentReceived } from '../helperFunctions/helper';
import { OrderStatusEnum } from '@utils/enums/enum';
import { callFunction } from '@utils/helper/helperFunctions';
import { styles } from '@assets/css/activeOrders';
import CustomIcons from '@utils/imagePaths/customSvgs';
import { API_URL, IMAGE_PATH } from '@env';
import RNPrint from 'react-native-print';
import QRCode from 'react-native-qrcode-svg';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import CustomImageModal from '@components/Ui/CustomImageModal';

// console.log("TCL ~ Image Path URL ~ from PickUpDetails :",IMAGE_PATH);

//  In the code below we are treating the 
//  packageData?.orderId as the consignment number
//  and packageData?.id as the order ID


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

  console.log("PACKAGE DATA: +++++++++++++++> ", packageData);
  console.log("TOKEN: +++++++++++++++> ", token);
  const [qrSvg, setQrSvg] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any[]>([]);

  const parcelType = getParcelTypeText(
    packageData?.parcelType ? packageData?.parcelType : 1,
  );

  const orderNumber = OrderIdSpliter(packageData?.id);
  const orderId = packageData?.id;
  console.log('orderID',packageData?.id);
  
  const trackingNumber = packageData?.orderId;
  // const consigneeAddress = packageData?.pickUpAddress;
  const consigneeAddress = packageData?.consigneeAddress;
  const name = packageData?.customer?.name;

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

  const imageSet = (image: any) => {
    setImage([image]);
    setModalVisible(true);
  };

  const getQRCodeBase64 = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!qrSvg) {
        reject(new Error('QR code reference not found'));
        return;
      }

      qrSvg.toDataURL((base64: string) => {
        resolve(`data:image/png;base64,${base64}`);
      });
    });
  };

  const printReceipt = async () => {
    try {
      console.log("Generating QR Code...");

      const base64Qr = await getQRCodeBase64();

      console.log("Opening Print Dialog...");
      await RNPrint.print({
        html: `
        <html>
          <head>
            <title>Print Order</title>
            <style>
              @page {
                margin: 0;
                size: auto;
              }
      
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
              }
      
              .order-container {
                width: 175px;
                // height: 82px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 5px;
                border: 1px solid black;
                border-radius: 10px;
                font-family: Arial, sans-serif;
              }
      
              .order-id {
                width: 100%;
                text-align: center;
                font-size: 14px;
                font-weight: 900;
                text-transform: uppercase;
                margin-top: -0.1px;
                margin-bottom: 0px;
              }
      
              .content {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
                align-items: center;
              }
      
              .left-section {
                flex: 1;
                text-align: left;
                padding-right: 5px;
              }
      
              .order-name {
                font-size: 10px;
                font-weight: 700;
                margin-bottom: 0px;
              }
      
              .order-address {
                font-size: 9px;
                font-weight: 400;
                line-height: 12px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                white-space: normal;
              }
      
              .qr-code {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 55px;
                height: 55px;
              }
            </style>
          </head>
          <body>
            <div class="order-container">
              <h3 class="order-id">${trackingNumber}</h3>
              <div class="content">
                <div class="left-section">
                  <p class="order-name">${name}</p>
                  <p class="order-address">${consigneeAddress}</p>
                </div>
                <div class="qr-code">
                  <img src="${base64Qr}" alt="QR Code" width="55" height="55"/>
                </div>
              </div>
            </div>
          </body>
        </html>
        `,
        jobName: "Order Print",
      });

    } catch (error) {
      console.error("Printing error:", error);
      Alert.alert("Printing Error", "Failed to print. Please try again.");
    }
  };

  // console.log("PACKAGE DATA: +++++++++++++++> ", packageData);

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
              <CustomText isBold={true} style={[homeStyles.heading, { marginBottom: 0 }]}>
                Pickup
              </CustomText>
              {/* 
              <View>
                <CustomText style={homeStyles.bookingHead}>
                  Booking #
                </CustomText>
                <CustomText isBold={true} style={homeStyles.bookingNumber}>
                  {orderNumber}
                </CustomText>
              </View> 
              */}

              {/* <View>
                <CustomText style={homeStyles.bookingHead}>
                  Remaining Time
                </CustomText>
                <CountdownTimer backendTime={Date.now()} />
              </View> */}

            </View>
            <View style={{ marginRight: 15, paddingBottom: 10 }}>
              <CustomText style={homeStyles.consignmentHead}>
                Consignment #
              </CustomText>
              <CustomText isBold={true} style={homeStyles.consignmentNumber}>
                {packageData?.orderId && packageData?.orderId}
              </CustomText>
            </View>

            <View style={homeStyles.card}>
              {/* Parcel Information */}
              <View style={homeStyles.infoSection}>
                <View style={homeStyles.myLocationWithSpace}>
                  <Icons.MyLocation />
                  <View style={{ marginLeft: 10 }}>
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
                  <View style={{ marginLeft: 8 }}>
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
                {packageData?.OrderPhotos?.length > 0 && <View style={{ justifyContent: 'flex-start' }}>
                  <View style={homeStyles.imageContainer}>
                    {packageData?.OrderPhotos?.length > 0 &&
                      packageData?.OrderPhotos?.map((val: any, key: number) => {
                        return (
                          <TouchableOpacity onPress={() => imageSet(val)}>
                            <Image
                              key={key}
                              // source={{ uri: `${IMAGE_PATH}${val.photoUrl}` }}
                              source={{ uri: `${val.photoUrl}` }}
                              width={80}
                              height={80}
                              style={{ marginLeft: 10, borderRadius: 10 }}
                            />
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </View>}
              </View>

              {/* QR Code for display in the app */}
              <View style={{ marginBottom: 15 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Icons.Cube width={20} height={20} />
                  <CustomText style={homeStyles.myPaymentText}>
                    QR Code
                  </CustomText>
                </View>
                <View style={{ alignSelf: 'center', marginBottom: 0 }}>
                  <QRCode
                    // value={orderNumber}
                    value={JSON.stringify({ orderId, token })}
                    size={100}
                  />
                </View>
              </View>

              {/* Hidden QR Code generator */}
              <View style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}>
                <View style={{ alignSelf: 'center', marginBottom: 0 }}>
                  <QRCode
                    value={trackingNumber}
                    size={100}
                    getRef={(ref) => setQrSvg(ref)}
                  />
                </View>
              </View>

              {/* Payment and Consignment Info */}
              <View style={homeStyles.paymentSection}>
                <View style={homeStyles.infoSection}>
                  <View style={homeStyles.myLocationWithSpace}>
                    <Icons.Note width={20} height={20} />
                    <View style={{ marginLeft: 10 }}>
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
                      packageData?.paymentType === 1 && packageData.amountReceived === 0
                        ? [styles.status, styles.inProgress]
                        : [styles.status, styles.pickedUp]
                    }>
                    <CustomText
                      isBold={true}
                      style={
                        packageData?.paymentType === 1 && packageData.amountReceived === 0
                          ? styles.statusText
                          : styles.statusTextPickup
                      }>
                      {packageData?.paymentType === 1
                        ? 'Cash On Pickup'
                        : 'Paid Online'}
                    </CustomText>
                  </View>
                </View>
                {/* <View style={[homeStyles.infoSection, { maxWidth: WINDOW_WIDTH * 0.4 }]}>
                  <View style={homeStyles.consigneeTag}>
                    <Icons.tickBoxRed width={20} height={20} />
                    <View style={{ marginLeft: 10 }}>
                      <CustomText style={homeStyles.myPaymentText}>
                        Consignment#
                      </CustomText>
                      <CustomText style={homeStyles.mySubText}>
                        {packageData?.orderId && packageData?.orderId}
                      </CustomText>
                    </View>
                  </View>
                </View> */}
              </View>

              {packageData?.paymentType === 1 ? (
                <CustomButton
                  disabled={packageData.amountReceived ? true : false}
                  onPress={() => {
                    Payment(packageData?.price ? packageData?.price : 0);
                  }}
                  //@ts-ignore
                  customStyle={{
                    marginTop: -10,
                    backgroundColor: packageData.amountReceived ? "#4CD964" : null
                  }}
                  text={
                    packageData.amountReceived ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <CustomIcons.TickIcon color="#FFF" />
                        <CustomText
                          style={{ fontSize: 17, paddingHorizontal: 5, color: "#FFF" }}>
                          Cash Received
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
                          style={{ fontSize: 17, paddingHorizontal: 5 }}>
                          Received Cash?
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
                {/* Print Receipt Button */}
                <TouchableOpacity
                  onPress={printReceipt}
                  style={homeStyles.iconButton}>
                  <Image
                    source={require('@assets/images/icons/printer0.png')}
                    resizeMode="center"
                    style={{
                      marginVertical: -20
                    }}
                  />
                  <CustomText style={homeStyles.iconText}>
                    PRINT RECEIPT
                  </CustomText>
                </TouchableOpacity>

                {/* Call Shipper Button */}
                <TouchableOpacity
                  onPress={() => callFunction(packageData?.customer?.mobile)}
                  style={[homeStyles.iconButton, homeStyles.callButtonNew]}>
                  <Icons.phoneGreen />
                  <CustomText style={homeStyles.callText}>
                    CALL SHIPPER
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Complete Pickup Button */}
            {packageData?.paymentType !== 1 ? (
              <CustomButton text="Complete Pickup" onPress={UpdateStatus} />
            ) : (
              <CustomButton
                disabled={!packageData?.amountReceived}
                text="Complete Pickup"
                onPress={UpdateStatus}
              />
            )}
          </View>
        </ScrollView>
      </View>
      <CustomImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        images={image || []}
      />
    </>
  );
};

export default PickUpDetails;