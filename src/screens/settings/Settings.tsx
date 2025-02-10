import CustomText from '@components/Ui/CustomText';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import useAuthStore from '@utils/store/authStore';
import useMapStore from '@utils/store/mapStore';
import CustomIcons from '@utils/imagePaths/customSvgs';

// type Props = {};

const Settings = () => {
  const {logout, token}: any = useAuthStore();
  // const {orders}: any = usePlaceOrder();

  // const filteredOrders =
  //   orders &&
  //   orders?.length > 0 &&
  //   orders?.filter((val: any) => val.orderStatus <= 6);
  const data: any = useMapStore();
  const {} = data;
  // console.log(
  //   'TCL ~ file: Map.tsx:24 ~ currentLocation',
  //   currentLocation,
  //   ', currentLocation',
  //   riderLocation,
  //   'Rider',
  //   destination,
  // );
  const menuItems = [
    {
      id: '1',
      title: 'My Profile',
      icon: <CustomIcons.ArrowRight color="#465061" />,
      onClick: () => {},
    },
    {
      id: '2',
      title: 'Contact Operations',
      icon: <CustomIcons.CallIcon color="#465061" isBg={false} />,
      onClick: () => {},
    },
    {
      id: '4',
      title: 'Log out',
      icon: <CustomIcons.logOutIcon color="#465061" />,
      onClick: () => {
        logout(token);
      },
    },
  ];
  const renderItem = ({item}: any) => (
    <TouchableOpacity onPress={item.onClick} style={styles.itemContainer}>
      <CustomText style={styles.itemText}>{item.title}</CustomText>
      {item.value && (
        <CustomText style={styles.versionText}>{item.value}</CustomText>
      )}
      <View style={item.id === '2' ? '' : {marginRight: 15}}>
        {item.icon && item.icon}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <CustomText style={styles.AppVersion}>App Version: v2.1</CustomText>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
  },
  AppVersion: {
    textAlign: 'center',
    color: '#46506160',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  versionText: {
    fontSize: 16,
    color: '#666',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#333', // Adjust if needed
  },
});
export default Settings;
