import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import CustomText from '@components/Ui/CustomText';
import {handleUpdateQRCode} from '../helperFunctions/helper';
import {homeStyles} from '@assets/css/map';
type QRCodeScannerProps = {
  id: number;
  token: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const QRCodeScannerComponent: React.FC<QRCodeScannerProps> = ({
  id,
  token,
  setCurrentStep,
}) => {
  const handleQRCodeRead = async (qrCode: string) => {
    await handleUpdateQRCode(id, qrCode, token);
    setCurrentStep(2);
  };

  return (
    <View style={homeStyles.bottomSheetContentScroll}>
      {' '}
      <CustomText style={styles.headerText}>Scan QR Code</CustomText>
      <Camera
        scanBarcode={true}
        onReadCode={event =>
          handleQRCodeRead(event.nativeEvent.codeStringValue)
        }
        showFrame={true} // Show the frame for scanning
        frameColor="blue"
        cameraType={CameraType.Back}
        laserColor="red"
        style={styles.cameraScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  cameraScreen: {
    flex: 1,
  },
});

export default QRCodeScannerComponent;
