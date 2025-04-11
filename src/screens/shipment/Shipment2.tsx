// import React from 'react';
// import {View} from 'react-native';
// import ParcelList from './components/ParcelList';
// import usePlaceOrder from '@utils/store/placeOrderStore';
// import useAuthStore from '@utils/store/authStore';

// const Shipment = () => {
//   const {orders, getUserOrders} = usePlaceOrder.getState();
//   const {token} = useAuthStore.getState();
//   const refetch = () => getUserOrders(token);
//   return (
//     <View>
//       <ParcelList list={orders} refetch={refetch} />
//     </View>
//   );
// };

// export default Shipment;

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import ParcelList from './components/ParcelList';
import usePlaceOrder from '@utils/store/placeOrderStore';
import useAuthStore from '@utils/store/authStore';

const Shipment = () => {
  const { orders, getUserOrders } = usePlaceOrder();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (token) {
        setLoading(true);
        await getUserOrders(token);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const refetch = () => {
    if (token) {
      getUserOrders(token);
    }
  };

  // console.log("ORDERS FROM SHIPMENT SCREEN : ",orders);


  if (loading) {
    return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#ED1C24" />
    </View>)
      ;
  }

  return (
    <View>
      <ParcelList list={orders} refetch={refetch} />
    </View>
  );
};

export default Shipment;