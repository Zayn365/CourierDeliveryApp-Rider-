import React, {useState} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomText from '@components/Ui/CustomText';
import {
  formatDate,
  formatTime,
  OrderIdSpliter,
  getOrderStatusText,
  getOrderStatusColor,
} from '@utils/helper/helperFunctions';

const ParcelList = ({list, refetch}: any) => {
  // console.log();
  
  const navigation: any = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePress = (item: any) => {
    navigation.navigate('ParcelDetails', {parcel: item});
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch(); // Calls the provided refetch function
    setIsRefreshing(false);
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.itemContainer}>
        <View>
          <CustomText isBold={true} style={styles.idText}>
            {OrderIdSpliter(item.id)}
          </CustomText>
          <View style={styles.statusContainer}>
            <CustomText
              style={{
                backgroundColor: getOrderStatusColor(item.orderStatus),
                ...styles.statusText,
              }}>
              {getOrderStatusText(item.orderStatus)}
            </CustomText>
          </View>
        </View>
        <View>
          <CustomText style={styles.dateText}>
            {formatDate(item.createdAt)}
          </CustomText>
          <CustomText style={styles.timeText}>
            {formatTime(item.createdAt)}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={list}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={
        list && list?.length === 0
          ? styles.emptyContainer
          : styles.listContainer
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <CustomText isBold style={styles.emptyText}>
            No orders found
          </CustomText>
        </View>
      }
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300, // Adjust based on design
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  idText: {
    fontSize: 18,
    color: '#333',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ParcelList;
