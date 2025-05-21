import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { homeStyles } from '@assets/css/map';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '@components/Ui/CustomText';
import CustomIcons from '@utils/imagePaths/customSvgs';
import SignatureTaker from '../components/SignatureTaker';
import useAuthStore from '@utils/store/authStore';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@components/Ui/CustomButton';
import { handleReturnOrder, handleUpdateStatus } from '../helperFunctions/helper';
import { OrderStatusEnum } from '@utils/enums/enum';
import CountdownTimer from '../components/CountdownTimer';
import AddReturnPhotos from '../components/AddReturnPhotos';
import usePlaceOrder from '@utils/store/placeOrderStore';

type Props = {
  data?: any;
  packageData?: any;
};

const ProofOfReturn: React.FC<Props> = ({ data, packageData }) => {
  const { token }: any = useAuthStore();
  const { selectedReason }: any = usePlaceOrder();
  const [imageUri, setImageUri] = React.useState<any[]>([]);
  const [submitted, setSubmitted] = React.useState<boolean>(true);
  const [signatureSubmit, setSignatureSubmit] = React.useState<boolean>(true);
  const [sign, setSign] = React.useState<any[]>([]);
  const navigate: any = useNavigation();

  // const handleSignatureCompletion = (signatureData:any) => {
  //   if (signatureData) {
  //     setSignature(true);
  //     console.log('Signature captured:', signatureData);
  //   }
  // };

  const handlePhotosCompletion = () => {
    setSubmitted(true);
  };
  const UpdateStatus = async () => {
    //  nextStep();
    // await handleUpdateStatus(packageData?.id, OrderStatusEnum.RETURNED, token);
    await handleReturnOrder(packageData?.id, selectedReason, token);
    navigate.goBack();
  };
  return (
    <View style={homeStyles.ViewScrollable}>
      {submitted && signatureSubmit ? ( // Show main screen if both steps are not complete
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[{},
          {
            marginLeft: 10,
            justifyContent: 'space-between',
            paddingHorizontal: 15,
          }
          ]}>
            <CustomText isBold={true} style={[homeStyles.heading, { marginBottom: 8 }]}>
              Record proof of Return
            </CustomText>

            {/* {  packageData?.pickUpTime &&
            <View style={{ alignSelf: 'flex-end' , marginRight:15,marginBottom: 4}}>
              <CustomText style={{ fontSize: 12, color: '#757575', textAlign: 'left' }}>
                Remaining Time
              </CustomText>
              <CountdownTimer backendTime={packageData?.pickUpTime} />
            </View>
           }  */}

          </View>



          <View style={styles.container}>
            {/* Location Photos Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSubmitted(false)} // Show AddDeliveryPhotos
            >
              <View style={styles.innerStyle}>
                <CustomIcons.CameraIcon color="#ED1C24" />
                <CustomText style={styles.buttonText}>
                  LOCATION PHOTOS{' '}
                </CustomText>
              </View>
              {imageUri.length > 0 && <CustomIcons.TickIcon color="#4CD964" />}
            </TouchableOpacity>
            {/* Signature Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSignatureSubmit(false)}>
              <View style={styles.innerStyle}>
                <CustomIcons.SignatureIcon color="#ED1C24" />
                <CustomText style={styles.buttonTextSign}>SIGNATURE</CustomText>
              </View>
              {sign.length > 0 && <CustomIcons.TickIcon color="#4CD964" />}
            </TouchableOpacity>
            <View style={{ width: '90%' }}>
              <CustomButton
                disabled={
                  imageUri?.length <= 0 || sign.length <= 0 ? true : false
                }
                //   loader={isLoading}
                onPress={UpdateStatus}
                text="Complete"
              />
            </View>
          </View>
        </ScrollView>
      ) : !signatureSubmit ? (
        <SignatureTaker
          orderId={data.id}
          token={token as string}
          setSubmitted={setSignatureSubmit}
          setSign={setSign}
        />
      ) : (
        // Show AddDeliveryPhotos if photos are not submitted
        <AddReturnPhotos
          orderId={data.id}
          token={token}
          setSubmitted={() => handlePhotosCompletion()}
          imageUri={imageUri}
          setImageUri={setImageUri}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#9AA1AD',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 14,
  },
  buttonTextSign: {
    marginLeft: 15,
    fontSize: 14,
  },
  smallHeading: {},
});

export default ProofOfReturn;
