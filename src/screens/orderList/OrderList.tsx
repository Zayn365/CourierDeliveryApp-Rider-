import React from 'react';
import {TouchableOpacity, View, ScrollView, Alert} from 'react-native';
import CustomText from '@components/Ui/CustomText';
import MileStoneTracking from '@components/Ui/MileStoneTracking';
import Icons from '@utils/imagePaths/imagePaths';
import Order from '@assets/css/orderList';
import usePlaceOrder from '@utils/store/placeOrderStore';
import useMapStore from '@utils/store/mapStore';
import {
  getOrderStatusText,
  OrderIdSpliter,
} from '@utils/helper/helperFunctions';
import {useNavigation} from '@react-navigation/native';
const OrderList = () => {
  const data = usePlaceOrder();
  const map: any = useMapStore();
  const navigation: any = useNavigation();
  const {setCurrentLocation, setDestination} = map;
  const {
    orders,
    setCanCancel,
    setPlaceOrderData,
    setCurrentStep,
    setRiderId,
  }: any = data;
  // console.log(orders);

  const placeMyOrder = async (data: any) => {
    try {
      await navigation.setParams({stepToGo: 6});
      const currentLocation = {
        latitude: Number(data?.pickUpLat),
        longitude: Number(data?.pickUpLong),
      };
      const destinationAddress = {
        latitude: Number(data?.consigneeLat),
        longitude: Number(data?.consigneeLong),
      };
      setCurrentLocation(currentLocation);
      setDestination(destinationAddress);
      setPlaceOrderData(data);
      setRiderId(data?.assignRiderId);
      await setCanCancel(false);
      setCurrentStep(6);
      await navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error : ', error.messsge);
    }
  };

  return (
    <View style={Order.container}>
      <ScrollView style={{flex: 1}}>
        {orders?.length > 0 &&
          orders.map((val: any, key: any) => {
            const orderProgress = getOrderStatusText(val.orderStatus);
            const orderNumber = OrderIdSpliter(val.orderId);
            return (
              <TouchableOpacity
                key={key}
                onPress={async () => {
                  placeMyOrder(val);
                }}>
                <View style={Order.card}>
                  <View style={Order.row}>
                    <Icons.RedBox />
                    <View style={Order.iconSpacing}>
                      {/* Upper Status */}
                      <CustomText isBold={true} style={Order.statusText}>
                        {orderProgress}
                      </CustomText>
                      {/* Name of the customer */}
                      <CustomText isBold={true} style={Order.customerName}>
                        {val.consigneeName}
                      </CustomText>
                      {/* OrderId Text */}
                      <CustomText style={Order.orderIdText}>
                        {orderNumber}
                      </CustomText>
                    </View>
                  </View>
                  <View>
                    <MileStoneTracking
                      status={val.orderStatus}
                      colorless={true}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default OrderList;
