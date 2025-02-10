import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import CustomText from '@components/Ui/CustomText';
import {
  callFunction,
  getOrderStatusColor,
  getOrderStatusText,
  getParcelTypeText,
} from '@utils/helper/helperFunctions';
import CustomIcons from '@utils/imagePaths/customSvgs';
import {OrderIdSpliter} from '@utils/helper/helperFunctions';
const ParcelDetailsScreen = ({route}: any) => {
  const {parcel} = route.params;
  const styling = {
    color: `${getOrderStatusColor(parcel.orderStatus)}`,
    fontSize: 16,
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <CustomText style={styles.label}>Booking ID</CustomText>
        <CustomText style={styles.value}>
          {OrderIdSpliter(parcel.id)}
        </CustomText>
      </View>

      <View style={styles.section}>
        <CustomText style={styles.label}>Booking Status</CustomText>
        <CustomText style={styling}>
          {getOrderStatusText(parcel.orderStatus)}
        </CustomText>
      </View>

      <View style={styles.section}>
        <CustomText style={styles.label}>Parcel Type</CustomText>
        <CustomText style={styles.value}>
          {getParcelTypeText(parcel.parcelType)}
        </CustomText>
      </View>
      {parcel.parcelType === 1 && (
        <View style={styles.section}>
          <CustomText style={styles.label}>Parcel Weight</CustomText>
          <CustomText style={styles.value}>{parcel.weight} Kg</CustomText>
        </View>
      )}
      <View style={styles.section}>
        <CustomText style={styles.label}>Consignment Number</CustomText>
        <CustomText style={styles.value}>
          {parcel.orderId ? parcel.orderId : 'Not Available'}
        </CustomText>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <View style={styles.column}>
            <CustomText style={styles.label}>Shipper Name</CustomText>
            <CustomText style={styles.value}>{parcel.customer.name}</CustomText>
          </View>
          <TouchableOpacity
            onPress={() => {
              callFunction(parcel.customer.mobile);
            }}>
            <CustomIcons.CallIcon width={50} height={50} color="#4CD964" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <CustomText style={styles.label}>Shipper Address</CustomText>
        <CustomText style={styles.valueAddress}>
          {parcel.pickUpAddress}
        </CustomText>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <CustomText style={styles.label}>Service Fee</CustomText>
        </View>
        <View style={styles.sectionRow}>
          <CustomText style={styles.value}>Rs. {parcel.price}</CustomText>
          <View style={styles.paidBadge}>
            <CustomText style={styles.paidText}>
              {parcel.paymentTypeString}
            </CustomText>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <View style={styles.column}>
            <CustomText style={styles.label}>Consignee Name</CustomText>
            <CustomText style={styles.value}>{parcel.consigneeName}</CustomText>
          </View>
          <TouchableOpacity
            onPress={() => {
              callFunction(parcel.consigneePhone);
            }}>
            <CustomIcons.CallIcon width={50} height={50} color="#4CD964" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <CustomText style={styles.label}>Consignee Address</CustomText>
        <CustomText style={styles.valueAddress}>
          {parcel.consigneeAddress}
        </CustomText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 12,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#66666690',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  valueAddress: {
    fontSize: 16,
    color: '#333',
    paddingRight: 30,
  },
  status: {
    fontSize: 14,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  paidBadge: {
    backgroundColor: '#4CD96420',
    borderColor: '#4CD964',
    borderWidth: 1,
    paddingHorizontal: 17,
    paddingVertical: 4,
    borderRadius: 100,
    marginLeft: 10,
  },
  paidText: {
    color: '#2D8D3D',
    fontSize: 12,
  },
});

export default ParcelDetailsScreen;
