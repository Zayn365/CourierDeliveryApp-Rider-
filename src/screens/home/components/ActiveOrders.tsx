import {FlatList, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '@utils/imagePaths/imagePaths';
import CustomText from '@components/Ui/CustomText';
import React from 'react';
import {
  getOrderStatusText,
  OrderIdSpliter,
} from '@utils/helper/helperFunctions';
import {styles} from '@assets/css/activeOrders';
import useMapStore from '@utils/store/mapStore';
import usePlaceOrder from '@utils/store/placeOrderStore';
import {OrderStatusEnum} from '@utils/enums/enum';

type Props = {
  orders: any[] | null;
};

const ActiveShipment: React.FC<Props> = ({orders}) => {
  const navigation: any = useNavigation();
  const place: any = usePlaceOrder();
  const {setCurrentStep} = place;
  const data: any = useMapStore();
  const {
    setCurrentLocation,
    setDestination,
    setCurrentAddress,
    setDestinationAddress,
  } = data;

  const setCurrent = (order: any) => {
    if (order.orderStatus === OrderStatusEnum.OUT_FOR_PICKUP) {
      setCurrentStep(2);
    } else if (
      order.orderStatus === OrderStatusEnum.IN_TRANSIT ||
      order.orderStatus === OrderStatusEnum.OUT_FOR_DELIVERY
    ) {
      setCurrentStep(3);
    } else {
      setCurrentStep(1);
    }
  };
  const LocationSetter = (order: any) => {
    if (order.orderStatus !== 6) {
      setCurrent(order);
      setCurrentLocation({
        longitude: Number(order.pickUpLong),
        latitude: Number(order.pickUpLat),
      });
      setDestination({
        longitude: Number(order.consigneeLong),
        latitude: Number(order.consigneeLat),
      });
      setCurrentAddress(order.pickUpAddress);
      setDestinationAddress(
        `${order.consigneeAddress}, ${order.consigneeLandmark}`,
      );

      navigation.navigate('Map', {currentOrder: order.id});
    }
  };
  const renderOrder = ({item: val}: any) => {
    console.log(val.orderStatus);
    const orderProgress = getOrderStatusText(val.orderStatus);
    const orderNumber = OrderIdSpliter(val.id);
    const Heading =
      val.orderStatus <= 4 || val.orderStatus === 10 ? 'Pickup' : 'Delivery';

    return (
      <TouchableOpacity onPress={() => LocationSetter(val)}>
        <View
          style={
            val.orderStatus > 2
              ? [(styles.card, styles.deliveryCard)]
              : [(styles.card, styles.card)]
          }>
          <View style={styles.row}>
            <View style={styles.row}>
              <Icons.Pin />
              <CustomText style={styles.label}>{Heading}</CustomText>
            </View>
            <View>
              <CustomText style={styles.bookingHead}>Booking #</CustomText>
              <CustomText style={styles.bookingNumber}>
                {orderNumber}
              </CustomText>
            </View>
          </View>
          <CustomText isBold={true} style={styles.name}>
            {val.consigneeName}
          </CustomText>
          <View style={styles.rowBottom}>
            <CustomText style={styles.address}>
              {val.consigneeAddress}, {val.consigneeLandmark}
            </CustomText>
            <View
              style={
                val.orderStatus > 2
                  ? [(styles.status, styles.pickedUp)]
                  : [(styles.status, styles.inProgress)]
              }>
              <CustomText
                isBold={true}
                style={
                  val.orderStatus === 3
                    ? styles.statusTextPickup
                    : styles.statusText
                }>
                {orderProgress}
              </CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CustomText>No Orders Available</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>ACTIVE SHIPMENT</CustomText>

      <FlatList
        // @ts-ignore
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default ActiveShipment;
