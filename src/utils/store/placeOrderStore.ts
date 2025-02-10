import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {Alert} from 'react-native';
import axios from 'axios';

const apiLink = `http://api.tcsnow.com.pk/rider`;

const usePlaceOrder = create(
  persist(
    set => ({
      isLoading: false,
      price: {},
      error: null,
      placeOrderData: null,
      riderId: '',
      setRiderId: (riderId: any) => set({riderId}),
      canCancel: true,

      setCanCancel: (canCancel: any) => set({canCancel}),
      currentStep: 1,
      setCurrentStep: (currentStep: any) => set({currentStep}),
      setPlaceOrderData: (placeOrderData: any) => {
        set({placeOrderData});
      },
      orders: null,
      placeOrderApi: async (packageData: any, token: string) => {
        set({isLoading: true});
        try {
          const formData = new FormData();
          for (const key in packageData) {
            if (Array.isArray(packageData[key])) {
              packageData[key].forEach((item: any) => {
                formData.append(key, item);
              });
            } else {
              formData.append(key, packageData[key]);
            }
          }
          const response: any = await axios
            .post(`${apiLink}/order/place-delivery`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `${token}`,
              },
            })
            .then(response => response.data)
            .catch(error => {
              console.log(error.response?.data);
              Alert.alert('Error', error.response?.data?.message);
              throw error;
            });
          set({placeOrderData: response.data, isLoading: false});
          return true;
        } catch (error: any) {
          set({error: error.message, isLoading: false});
          const Error = error.response?.data?.data
            ? error.response?.data?.data[0]?.msg ||
              error.response?.data?.data?.error
            : 'Something went wrong';
          Alert.alert('Error', Error);
          return false;
        }
      },
      getPricing: async (values: any, token: any) => {
        try {
          const response: any = await axios.post(
            `${apiLink}/order/get-pricing`,
            values,
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          if (response.data.success) {
            set({price: response.data.data});
            return response.data.data;
          }
        } catch (error: any) {
          console.log(error.response?.data);
          Alert.alert('Error', error.response?.data?.message);
          throw error;
        }
      },
      getUserOrders: async (token: string, riderId: string) => {
        try {
          const response: any = await axios.get(
            `${apiLink}/order/get-users-order`,
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          if (response.data.success) {
            response.data.data?.orders?.filter(
              (val: any) => val.assignRiderId === riderId,
            );
            set({orders: response.data.data?.orders});
            // console.log(
            //   '🚀 ~ getUserOrders: ~ response.data.data?.orders:',
            //   response.data.data?.orders,
            // );
            return response.data.data;
          }
        } catch (error: any) {
          console.log(error.response?.data);
          // Alert.alert(
          //   'Error :',
          //   error.response?.data?.message || error.message,
          // );
          throw error;
        }
      },
      cancelOrder: async (orderId: number, reason: string, token: string) => {
        try {
          const response: any = await axios.patch(
            `${apiLink}/order/cancel-order`,
            {
              type: 'CANCELLED',
              reason,
              orderId,
            },
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          set({orders: response.data.data?.orders});
          return response.data;
        } catch (error: any) {
          console.log(error.response?.data);
          Alert.alert('Error', error.response?.data?.message);
          throw error;
        }
      },
      returnOrder: async (orderId: number, reason: string, token: string) => {
        try {
          const response: any = await axios.patch(
            `${apiLink}/order/cancel-order`,
            {
              type: 'RETURNED',
              reason,
              orderId,
            },
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          set({orders: response.data.data?.orders});
          return response.data;
        } catch (error: any) {
          console.log(error.response?.data);
          Alert.alert('Error', error.response?.data?.message);
          throw error;
        }
      },
      updateStatus: async (orderId: number, status: number, token: string) => {
        try {
          const response: any = await axios.patch(
            `${apiLink}/order/update-order`,
            {
              status,
              orderId,
            },
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          set({orders: response.data.data?.orders});

          return response.data;
        } catch (error: any) {
          console.log(error.response?.data);
          Alert.alert('Error', error.response?.data?.message);
          throw error;
        }
      },
      updateQRCode: async (orderId: number, qrCode: string, token: string) => {
        try {
          const response: any = await axios.patch(
            `${apiLink}/order/update-qrcode`,
            {
              qrCode,
              orderId,
            },
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          set({orders: response.data.data?.orders});
          console.log('🚀 ~ updateQRCode: ~ response.data:', response.data);
          return response.data;
        } catch (error: any) {
          console.log(error.response?.data);
          // Alert.alert('Error', error.response?.data?.message);
          throw error;
        }
      },
      paymentReceived: async (
        orderId: number,
        amount: number,
        token: string,
      ) => {
        try {
          const response: any = await axios.put(
            `${apiLink}/order/payment-received`,
            {
              amount,
              orderId,
            },
            {
              headers: {
                authorization: `${token}`,
              },
            },
          );
          set({orders: response.data.data?.orders});
          console.log('🚀 ~ payemntRecieved: ~ response.data:', response.data);
          return response.data;
        } catch (error: any) {
          console.log(error.response?.data);
          Alert.alert('Error', error.response?.data?.message);
          throw error;
        }
      },
    }),
    {
      name: 'place-order-storage',
      partialize: (state: any) => ({
        price: state.price,
      }),
    },
  ),
);

export default usePlaceOrder;
