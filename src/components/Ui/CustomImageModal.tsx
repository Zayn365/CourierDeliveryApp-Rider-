import {IMAGE_PATH} from '@env';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@utils/helper/helperFunctions';
import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CustomImageModal = ({visible, onClose, images}: any) => {
  console.log("TCL ~ CustomImageModal ~ images:", images)
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.imageContainer}>
          {images?.length > 0 ? (
            images.map((val: any, key: number) => (
              <Image
                key={key}
                source={{uri: `${IMAGE_PATH}${val.photoUrl}`}}
                style={styles.image}
              />
            ))
          ) : (
            <Text style={styles.noImagesText}>No images available</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  cancelButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#000',
  },
  imageContainer: {
    marginTop: 60,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: SCREEN_WIDTH * 0.93,
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.5,
    margin: 5,
    borderRadius: 10,
    objectFit: 'fill',
  },
  noImagesText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CustomImageModal;
