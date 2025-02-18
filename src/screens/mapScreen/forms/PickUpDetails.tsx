// import { Image, TouchableOpacity, View, Alert, StyleSheet, } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import React, { useRef, useState } from 'react';
// import { homeStyles } from '@assets/css/map';
// import CustomText from '@components/Ui/CustomText';
// import Icons from '@utils/imagePaths/imagePaths';
// import CustomButton from '@components/Ui/CustomButton';
// import {
//   AddCommas,
//   getParcelTypeText,
//   OrderIdSpliter,
// } from '@utils/helper/helperFunctions';
// import { handleUpdateStatus, paymentReceived } from '../helperFunctions/helper';
// import { OrderStatusEnum } from '@utils/enums/enum';
// import { callFunction } from '@utils/helper/helperFunctions';
// import { styles } from '@assets/css/activeOrders';
// import CustomIcons from '@utils/imagePaths/customSvgs';
// import { API_URL } from '@env';

// import RNPrint from 'react-native-print';
// import QRCode from 'react-native-qrcode-svg';
// import ViewShot, { captureRef } from 'react-native-view-shot';


// type Props = {
//   nextStep: () => void;
//   packageData: any;
//   setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
//   token: string;
// };
// const PickUpDetails: React.FC<Props> = ({
//   nextStep,
//   // setCurrentStep,
//   token,
//   packageData,
// }) => {
//   const parcelType = getParcelTypeText(
//     packageData?.parcelType ? packageData?.parcelType : 1,
//   );
//   const orderNumber = OrderIdSpliter(packageData?.id);

//   const UpdateStatus = () => {
//     handleUpdateStatus(packageData?.id, OrderStatusEnum.IN_TRANSIT, token);
//     nextStep();
//   };
//   const Payment = async (amount: number) => {
//     try {
//       await paymentReceived(packageData?.id, amount, token);
//     } catch (e: any) {
//       console.log(e);
//     }
//   };

//   // const trackingNumber = "TN-K3NNZ-277181";
//   // const address = `Faizan Lakhani,
//   //                 C-20, Block-7,
//   //                 Gulshan-e-Iqbal, Karachi.`;
//   const trackingNumber = packageData?.orderId;
//   const consigneeAddress = packageData?.pickUpAddress;
//   const name = packageData?.customer?.name;

//   const viewShotRef = useRef<ViewShot | null>(null);
//   const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);

//   const printReceipt = async () => {
//     try {
//       console.log("Generating QR Code...");

//       // Generate QR Code Base64 before printing
//       if (!viewShotRef.current) {
//         Alert.alert("QR Code Error", "QR code reference is not available.");
//         return;
//       }

//       const uri = await captureRef(viewShotRef.current, {
//         format: "png",
//         quality: 1.0,
//         result: "base64",
//       });

//       if (!uri) {
//         Alert.alert("QR Code Error", "Failed to generate QR code.");
//         return;
//       }

//       const base64Qr = `data:image/png;base64,${uri}`;
//       setQrCodeBase64(base64Qr); // Store QR Code for debugging

//       console.log("Opening Print Dialog...");
//       await RNPrint.print({
//         html: `
//         <html>
//           <head>
//             <title>Print Order</title>
//             <style>
//               @page {
//                 margin: 0;
//                 size: auto;
//               }

//               body {
//                 margin: 0;
//                 padding: 0;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//               }

//               /* Sticker Layout */
//               .order-container {
//                 width: 175px;
//                 height: 94.48px;
//                 display: flex;
//                 flex-direction: column;
//                 align-items: center;
//                 padding: 5px;
//                 border: 1px solid black;
//                 border-radius: 10px;
//                 font-family: Arial, sans-serif;
//               }

//               /* Header (Tracking Number) */
//               .order-id {
//                 width: 100%;
//                 text-align: center;
//                 font-size: 14px;
//                 font-weight: 900;
//                 text-transform: uppercase;
//                 margin-bottom: 4px;
//               }

//               /* Content Section: Left (Name & Address) + Right (QR Code) */
//               .content {
//                 display: flex;
//                 flex-direction: row;
//                 justify-content: space-between;
//                 width: 100%;
//                 align-items: center;
//               }

//               /* Left Section (Name & Address) */
//               .left-section {
//                 flex: 1;
//                 text-align: left;
//                 padding-right: 5px;
//               }

//               .order-name {
//                 font-size: 10px;
//                 font-weight: 700;
//                 margin-bottom: 0px;
//               }

//               .order-address {
//                 font-size: 9px;
//                 font-weight: 700;
//                 line-height: 12px;
//                 word-wrap: break-word;
//                 overflow-wrap: break-word;
//                 white-space: normal;
//               }

//               /* Right Section (QR Code) */
//               .qr-code {
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 width: 55px;
//                 height: 55px;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="order-container">
//               <!-- Tracking Number (Header) -->
//               <h3 class="order-id">${trackingNumber}</h3>

//               <!-- Two-Column Layout: Name & Address (Left) + QR Code (Right) -->
//               <div class="content">
//                 <div class="left-section">
//                   <p class="order-name">${name}</p>
//                   <p class="order-address">${consigneeAddress}</p>
//                 </div>
//                 <div class="qr-code">
//                   <img src="${base64Qr}" alt="QR Code" width="55" height="55"/>
//                 </div>
//               </div>
//             </div>
//           </body>
//         </html>
//         `,
//         jobName: "Order Print",
//       });

//     } catch (error) {
//       console.error("Printing error:", error);
//       Alert.alert("Printing Error", "Failed to print. Ensure a printer is available.");
//     }
//   };

//   return (
//     <>
//       <View style={homeStyles.ViewScrollable}>
//         <ScrollView
//           // eslint-disable-next-line react-native/no-inline-styles
//           contentContainerStyle={{
//             paddingBottom: 50,
//             flexGrow: 1,
//           }}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled">
//           <View style={homeStyles.bottomSheetContentScroll}>
//             <View style={homeStyles.pickupTop}>
//               <CustomText isBold={true} style={homeStyles.heading}>
//                 Pickup
//               </CustomText>
//               <View>
//                 <CustomText style={homeStyles.bookingHead}>
//                   Booking #
//                 </CustomText>
//                 <CustomText isBold={true} style={homeStyles.bookingNumber}>
//                   {orderNumber}
//                 </CustomText>
//               </View>
//             </View>

//             <View style={homeStyles.card}>
//               {/* Parcel Information */}
//               <View style={homeStyles.infoSection}>
//                 <View style={homeStyles.myLocationWithSpace}>
//                   <Icons.MyLocation />
//                   <View style={{ marginLeft: 10 }}>
//                     <CustomText style={homeStyles.myLocationText}>
//                       {packageData?.customer?.name}
//                     </CustomText>
//                     <CustomText style={homeStyles.mySubText}>
//                       {packageData?.pickUpAddress}
//                     </CustomText>
//                   </View>
//                 </View>

//                 {/* Delivery Info */}
//                 <View style={homeStyles.deliveryLocation}>
//                   <Icons.Cube />
//                   <View style={{ marginLeft: 8 }}>
//                     <CustomText style={homeStyles.myLocationText}>
//                       Parcel Information
//                     </CustomText>
//                     <CustomText style={homeStyles.mySubText}>
//                       {parcelType}
//                       {Number(packageData?.parcelType) === 1 &&
//                         ` (${packageData?.weight} KG/s)`}
//                     </CustomText>
//                   </View>
//                 </View>

//                 {/* Images (Placeholder for parcel images) */}
//                 <View style={{ justifyContent: 'flex-start' }}>
//                   <View style={homeStyles.imageContainer}>
//                     {packageData?.OrderPhotos?.length > 0 &&
//                       packageData?.OrderPhotos?.map((val: any, key: number) => {
//                         console.log(`${API_URL}${val.photoUrl}`);
//                         return (
//                           <Image
//                             key={key}
//                             source={{ uri: `${API_URL}${val.photoUrl}` }}
//                             width={80}
//                             height={80}
//                           />
//                         );
//                       })}
//                   </View>
//                 </View>
//               </View>

//               {/* Payment and Consignment Info */}
//               <View style={homeStyles.paymentSection}>
//                 <View style={homeStyles.infoSection}>
//                   <View style={homeStyles.myLocationWithSpace}>
//                     <Icons.Note width={20} height={20} />
//                     <View style={{ marginLeft: 10 }}>
//                       <CustomText style={homeStyles.myPaymentText}>
//                         Payment
//                       </CustomText>
//                       <CustomText style={homeStyles.myPaySubText}>
//                         Rs.{' '}
//                         {packageData?.price
//                           ? AddCommas(packageData?.price)
//                           : packageData?.price}
//                       </CustomText>
//                     </View>
//                   </View>
//                   <View
//                     style={
//                       packageData?.paymentType === 1
//                         ? [(styles.status, styles.pickedUp)]
//                         : [(styles.status, styles.inProgress)]
//                     }>
//                     <CustomText
//                       isBold={true}
//                       style={
//                         packageData?.paymentType === 1
//                           ? styles.statusTextPickup
//                           : styles.statusText
//                       }>
//                       {packageData?.paymentType === 1
//                         ? 'Cash On Pickup'
//                         : 'Paid Online'}
//                     </CustomText>
//                   </View>
//                 </View>
//                 <View style={homeStyles.infoSection}>
//                   <View style={homeStyles.consigneeTag}>
//                     <Icons.tickBoxRed width={20} height={20} />
//                     <View style={{ marginLeft: 10 }}>
//                       <CustomText style={homeStyles.myPaymentText}>
//                         Consignment#
//                       </CustomText>
//                       <CustomText style={homeStyles.mySubText}>
//                         {packageData?.orderId && packageData?.orderId}
//                       </CustomText>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* QR Code */}
//               <View style={homeStyles.deliveryLocation}>
//                 <Icons.Cube />
//                 <View style={{ marginLeft: 8, gap: 8 }}>
//                   <CustomText style={homeStyles.myLocationText}>
//                     QR Code
//                   </CustomText>
//                   {/* Hidden QR Code for Base64 generation */}
//                   <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0, result: "base64" }}>
//                     <QRCode value={trackingNumber} size={100} />
//                   </ViewShot>
//                 </View>
//               </View>

//               {packageData?.paymentType === 1 ? (
//                 <CustomButton
//                   disabled={packageData.amountReceived ? true : false}
//                   onPress={() => {
//                     Payment(packageData?.price ? packageData?.price : 0);
//                   }}
//                   customStyle={{ marginTop: 0 }}
//                   text={
//                     packageData.amountReceived ? (
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           alignItems: 'center',
//                           justifyContent: 'space-around',
//                         }}>
//                         <CustomIcons.TickIcon color="#4CD964" />
//                         <CustomText
//                           style={{ fontSize: 17, paddingHorizontal: 5 }}>
//                           Received
//                         </CustomText>
//                       </View>
//                     ) : (
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           alignItems: 'center',
//                           justifyContent: 'space-around',
//                         }}>
//                         <CustomIcons.TickIcon color="#bdbdbd" />

//                         <CustomText
//                           style={{ fontSize: 17, paddingHorizontal: 5 }}>
//                           Cash Pick Up
//                         </CustomText>
//                       </View>
//                     )
//                   }
//                   isWhite={true}
//                 />
//               ) : (
//                 ''
//               )}
//               {/* Action Buttons */}
//               <View style={homeStyles.actions}>
//                 {/* Scan QR Code Icon */}
//                 {/* <TouchableOpacity 
//                 // onPress={Scan} 
//                 style={homeStyles.iconButton}>
//                   <Icons.Scan />
//                   <CustomText style={homeStyles.iconText}>
//                     SCAN QR CODE ON SHIPMENT{' '}
//                   </CustomText>
//                 </TouchableOpacity> */}


//                 {/* Print Receipt Icon */}
//                 <TouchableOpacity
//                   onPress={printReceipt}
//                   style={homeStyles.iconButton}>
//                   <Image
//                     source={require('@assets/images/icons/printer0.png')}
//                     resizeMode="center"
//                     style={{
//                       // backgroundColor:'pink', 
//                       marginVertical: -20
//                     }}
//                   />
//                   <CustomText style={homeStyles.iconText}>
//                     PRINT RECEIPT{' '}
//                   </CustomText>
//                 </TouchableOpacity>

//                 {/* Call Shipper Icon */}
//                 <TouchableOpacity
//                   onPress={() => callFunction(packageData?.customer?.mobile)}
//                   style={[homeStyles.iconButton, homeStyles.callButtonNew]}>
//                   <Icons.phoneGreen />
//                   <CustomText style={homeStyles.callText}>
//                     CALL SHIPPER
//                   </CustomText>
//                 </TouchableOpacity>

//                 {/* Cancel Booking Icon */}
//                 {/* <TouchableOpacity
//                   onPress={() => setCurrentStep(55)}
//                   style={[homeStyles.iconButton, homeStyles.cancelButtonNew]}>
//                   <Icons.Cancel />
//                   <CustomText style={homeStyles.cancelText}>
//                     CANCEL BOOKING
//                   </CustomText>
//                 </TouchableOpacity> */}
//               </View>



//             </View>
//             {packageData?.paymentType !== 1 ? (
//               <CustomButton text="Complete Pickup" onPress={UpdateStatus} />
//             ) : (
//               <CustomButton
//                 disabled={
//                   packageData?.amountReceived && packageData?.amountReceived
//                     ? false
//                     : true
//                 }
//                 text="Complete Pickup"
//                 onPress={UpdateStatus}
//               />
//             )}
//           </View>
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// export default PickUpDetails;

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
  const [qrSvg, setQrSvg] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any[]>([]);

  const parcelType = getParcelTypeText(
    packageData?.parcelType ? packageData?.parcelType : 1,
  );
  const orderNumber = OrderIdSpliter(packageData?.id);
  const trackingNumber = packageData?.orderId;
  const consigneeAddress = packageData?.pickUpAddress;
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
                height: 82px;
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
                margin-bottom: 4px;
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
                font-weight: 700;
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

  console.log("PACKAGE DATA: +++++++++++++++> ", packageData);


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
                <View style={{ justifyContent: 'flex-start' }}>
                  <View style={homeStyles.imageContainer}>
                    {packageData?.OrderPhotos?.length > 0 &&
                      packageData?.OrderPhotos?.map((val: any, key: number) => {
                        return (
                          <TouchableOpacity onPress={() => imageSet(val)}>
                            <Image
                              key={key}
                              source={{ uri: `${IMAGE_PATH}${val.photoUrl}` }}
                              width={80}
                              height={80}
                              style={{ marginLeft: 10, borderRadius: 10 }}
                            />
                          </TouchableOpacity>
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
                      packageData?.paymentType === 1
                        ? [styles.status, styles.pickedUp]
                        : [styles.status, styles.inProgress]
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
                <View style={[homeStyles.infoSection, { maxWidth: WINDOW_WIDTH * 0.4 }]}>
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
                </View>
              </View>

              {/* Hidden QR Code generator */}
              <View style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}>
                <QRCode
                  value={trackingNumber}
                  size={100}
                  getRef={(ref) => setQrSvg(ref)}
                />
              </View>

              {packageData?.paymentType === 1 ? (
                <CustomButton
                  disabled={packageData.amountReceived ? true : false}
                  onPress={() => {
                    Payment(packageData?.price ? packageData?.price : 0);
                  }}
                  customStyle={{ marginTop: 0 }}
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
                          style={{ fontSize: 17, paddingHorizontal: 5 }}>
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
                          style={{ fontSize: 17, paddingHorizontal: 5 }}>
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