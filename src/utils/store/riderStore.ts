import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import axios from 'axios';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for the store
interface Proof {
  orderId?: number;
  type: 'Signature' | 'Proof' | string;
  images: File[] | null;
  token: string | null | undefined;
}

type UploadImagesFunction = (params: Proof) => Promise<boolean>;

interface RiderStore {
  uploadImages: UploadImagesFunction;
}

const BASE_URL = 'http://api.tcsnow.com.pk/rider';

const useRiderStore = create<RiderStore>()(
  persist(
    (set, get) => ({
      uploadImages: async (params: Proof) => {
        try {
          const formData = new FormData();
          if (params.orderId) {
            formData.append('orderId', String(params.orderId));
          }
          formData.append('type', params?.type);
          params?.images &&
            params?.images.forEach((image: any) => {
              if (image.uri && image.name) {
                formData.append('images', {
                  uri: image.uri,
                  type: 'image/webp',
                  name: image.name,
                });
              }
            });
          // console.log('TCL ~ uploadImages: ~ yo:', yo);
          const response = await axios.post(
            `${BASE_URL}/order/proof-sig`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `${params.token}`,
              },
            },
          );
          console.log('Upload successful:', response.data);
          return true; // Return a boolean value
        } catch (error: any) {
          console.log(error.response?.data);
          Alert.alert('Error', error.response?.data?.message);
          return false; // Return false on error
        }
      },
    }),
    {
      name: 'rider-store',
    },
  ),
);

export default useRiderStore;
