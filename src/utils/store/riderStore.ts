import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import axios from 'axios';
import {Alert} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
// Define types for the store
interface Proof {
  orderId?: number;
  type: 'Signature' | 'Proof' | string;
  images?: File[] | null;
  token: string | null | undefined;
  base64Image?: string | undefined | null;
}

type UploadImagesFunction = (params: Proof) => Promise<boolean>;

interface RiderStore {
  uploadImages: UploadImagesFunction;
}

const useRiderStore = create<RiderStore>()(
  persist(
    (set, get) => ({
      uploadImages: async (params: Proof) => {
        console.log('TCL ~ uploadImages: ~ params:', params);
        try {
          const formData = new FormData();
          if (params.orderId) {
            formData.append('orderId', String(params.orderId));
          }
          formData.append('type', params?.type);
          if (!params.base64Image) {
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
          } else {
            formData.append('base64Image', params?.base64Image);
          }
          // console.log('TCL ~ uploadImages: ~ yo:', yo);
          const response = await axios.post(
            `${API_URL}/order/proof-sig`,
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
