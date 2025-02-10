import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icons from '@utils/imagePaths/imagePaths';
import {ImagePicker} from '@assets/css/main';

type UploadImageProps = {
  addname: string;
  setData: React.Dispatch<React.SetStateAction<any>>;
};
const UploadDocument: React.FC<UploadImageProps> = ({addname, setData}) => {
  const [imageUri, setImageUri] = useState<any | null>([]);

  const handleSelectFromGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (imageUri.length >= 3) {
      Alert.alert('Maximum 3 images allowed');
      return;
    }
    if (result?.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setImageUri((prev: any) => {
        return [...prev, file.uri ?? null];
      });
      setData((prevData: any) => ({
        ...prevData,
        photos: [...(prevData.photos || []), file],
      }));
    }
  };

  const handleOpenCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    if (imageUri.length >= 3) {
      Alert.alert('Maximum 3 images allowed');
      return;
    }
    if (result?.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setImageUri((prev: any) => {
        return [...prev, file.uri ?? null];
      });
      setData((prevData: any) => ({
        ...prevData,
        photos: [...(prevData.photos || []), file],
      }));
    }
  };

  return (
    <View style={ImagePicker.container}>
      <Text style={ImagePicker.header}>
        Add {addname} Photo <Text style={ImagePicker.optional}>(Optional)</Text>
      </Text>

      <View style={ImagePicker.imageContainer}>
        {imageUri.length > 0 ? (
          imageUri?.map((uri: any) => {
            // console.log(uri, 'YES KRO');
            return (
              <View
                style={ImagePicker.imageContainerArray}
                key={imageUri.indexOf(uri) + 'View'}>
                {/* <TouchableOpacity> */}

                {/* </TouchableOpacity> */}
                <Image
                  key={imageUri.indexOf(uri) + 'img'}
                  source={{
                    uri: uri,
                  }}
                  style={ImagePicker.image}
                />
                <Icons.Cross
                  key={imageUri.indexOf(uri) + 'icon'}
                  width={15}
                  height={15}
                  style={{marginTop: -80}}
                  onPress={() => {
                    setImageUri((prev: any) =>
                      prev.filter((u: any) => u !== uri),
                    );
                    setData((prevData: any) => ({
                      ...prevData,
                      photos: prevData.photos.filter((p: any) => p.uri !== uri),
                    }));
                  }}
                />
              </View>
            );
          })
        ) : (
          <Icons.ImageSource />
        )}
      </View>

      <View style={ImagePicker.buttonContainer}>
        <TouchableOpacity
          style={ImagePicker.button}
          onPress={handleSelectFromGallery}>
          <Icons.ImagesIcon />
          <Text style={ImagePicker.buttonText}>GALLERY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={ImagePicker.button} onPress={handleOpenCamera}>
          <Icons.CameraIcon />
          <Text style={ImagePicker.buttonText}>CAMERA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadDocument;
