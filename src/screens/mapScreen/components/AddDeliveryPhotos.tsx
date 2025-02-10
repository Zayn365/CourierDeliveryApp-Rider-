import React, {useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import CustomText from '@components/Ui/CustomText';
import CustomButton from '@components/Ui/CustomButton';
import {launchCamera} from 'react-native-image-picker';
import Icons from '@utils/imagePaths/imagePaths';
import {homeStyles} from '@assets/css/map';
import {SCREEN_WIDTH} from '@utils/helper/helperFunctions';
import useRiderStore from '@utils/store/riderStore';
import ImageResizer from 'react-native-image-resizer';

type Props = {
  imageUri: any[];
  setImageUri: React.Dispatch<React.SetStateAction<any>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string | null | undefined;
  orderId?: number;
};

const AddDeliveryPhotos: React.FC<Props> = ({
  setSubmitted,
  imageUri,
  setImageUri,
  token,
  orderId,
}) => {
  const uploadImages = useRiderStore(state => state.uploadImages);
  const [images, setImages] = useState<File[] | null>([]);
  const [loading, setLoading] = useState(false);

  const compressImage = async (uri: string) => {
    try {
      const response = await ImageResizer.createResizedImage(
        uri,
        400,
        400,
        'WEBP',
        50,
      );
      console.log('TCL ~ compressImage ~ response.uri:', response.uri);
      return response;
    } catch (err) {
      console.error('Image compression failed:', err);
      return uri;
    }
  };

  const handleAddPhoto = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'We need your permission to access the camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to take photos.',
        );
        return;
      }
    }

    const result = await launchCamera({mediaType: 'photo'});
    if (imageUri.length >= 3) {
      Alert.alert('Maximum 3 images allowed');
      return;
    }
    if (result?.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const compressedUri: any = await compressImage(file.uri);
      setImageUri((prev: any) => [...prev, compressedUri.uri ?? null]);
      setImages((prev: any) => [...prev, compressedUri ?? null]);
    }
  };

  const handleSubmit = async () => {
    if (imageUri.length === 0) {
      Alert.alert('Please add at least one photo');
      return;
    }

    setLoading(true);
    const proofData = {
      orderId: orderId,
      type: 'Proof',
      images: images,
      token: token,
    };

    try {
      const success = await uploadImages(proofData);
      console.log('TCL ~ handleSubmit ~ success:', success);
      if (success) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', 'Failed to upload photos.');
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      Alert.alert('Error', 'An error occurred while uploading photos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{paddingHorizontal: 10}}>
      <View style={homeStyles.pickupTop}>
        <CustomText isBold={true} style={homeStyles.heading}>
          Add Delivery Location Photos
        </CustomText>
      </View>
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          {Array.from({length: 3}).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoBox}
              onPress={handleAddPhoto}
              disabled={loading}>
              {imageUri[index] ? (
                <Image
                  source={{uri: imageUri[index]}}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Icons.NullImage width={70} height={70} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <CustomButton
        customStyle={{marginBottom: 8}}
        onPress={handleSubmit}
        text="Submit"
        disabled={loading}
        loader={loading}
      />
      {!loading ? (
        <CustomButton
          customStyle={{marginTop: 4}}
          isWhite={true}
          text="Back"
          onPress={() => setSubmitted(true)}
        />
      ) : (
        ''
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 20,
  },
  photoBox: {
    width: SCREEN_WIDTH * 0.25,
    height: 100,
    borderWidth: 1,
    borderColor: '#9AA1AD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default AddDeliveryPhotos;
