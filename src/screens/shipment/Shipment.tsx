import React from 'react';
import {View} from 'react-native';
import ParcelList from './components/ParcelList';
import usePlaceOrder from '@utils/store/placeOrderStore';
import useAuthStore from '@utils/store/authStore';

const Shipment = () => {
  const {orders, getUserOrders} = usePlaceOrder.getState();
  const {token} = useAuthStore.getState();
  const refetch = () => getUserOrders(token);
  return (
    <View>
      <ParcelList list={orders} refetch={refetch} />
    </View>
  );
};

export default Shipment;
