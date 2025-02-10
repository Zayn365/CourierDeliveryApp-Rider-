import React, {useRef} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import CustomButton from '@components/Ui/CustomButton';
import {SCREEN_HEIGHT} from '@utils/helper/helperFunctions';

type Props = {
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setSign: React.Dispatch<React.SetStateAction<any>>;
  orderId?: number;
  token?: string;
};

const SignatureTaker: React.FC<Props> = ({
  setSubmitted,
  setSign,
  orderId,
  token,
}) => {
  console.log('🚀 ~ token:', token);
  console.log('🚀 ~ orderId:', orderId);
  const ref: any = useRef(null);

  const handleSignature = (signature: string) => {
    // Log the base64 signature
    console.log('Base64 Signature:', signature);

    // Example: Convert base64 to data URI (optional, useful for displaying)
    const signatureURI = `data:image/png;base64,${signature}`;
    console.log('Data URI:', signatureURI);

    // Save signature in state
    setSign(signatureURI);
    setSubmitted(true);

    // If uploading, you can process the base64 as required (e.g., send to server)
    // Example: sendBase64ToServer(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleEmpty = () => {
    Alert.alert('Signature pad is empty');
  };

  const handleSubmit = () => {
    ref.current.readSignature();
  };

  return (
    <View style={styles.container}>
      <View style={styles.SignatureScreen}>
        <SignatureScreen
          ref={ref}
          onOK={handleSignature} // Handle base64 signature
          onEmpty={handleEmpty}
          clearText="Clear"
          confirmText="Save"
          nestedScrollEnabled={true}
          webStyle={`
            .m-signature-pad {
              border: 1px solid #e8e8e8;
            }
            .m-signature-pad--footer {
              display: none;
            }
            .m-signature-pad--body {
              touch-action: none;
            }
            canvas {
              touch-action: none;
            }
            body,html {
              height: ${SCREEN_HEIGHT * 0.4}px;
            }
          `}
          imageType={'image/png'}
        />
      </View>
      <CustomButton
        onPress={handleSubmit}
        customStyle={{marginBottom: 8}}
        text="Submit"
      />
      <CustomButton
        customStyle={{marginTop: 3}}
        isWhite={true}
        text="Clear"
        onPress={handleClear}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  SignatureScreen: {
    height: SCREEN_HEIGHT * 0.4,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#DBE2ED',
  },
});

export default SignatureTaker;
