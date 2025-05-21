import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: '#737B85',
    letterSpacing: 2,
    lineHeight: 24,
    marginBottom: 12,
    marginLeft: 16,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    marginVertical: 12,
    backgroundColor: '#F5F4F7',
  },
  deliveryCard: {
    padding: 16,
    borderRadius: 18,
    marginVertical: 12,
    backgroundColor: '#FFE5E5',
    borderWidth: 1.5,
    borderColor: '#ED1C24',
  },
  consignmentHead: {
    fontSize: 12,
    color: '#757575',
  },
  consignmentNumber: {
    textAlign: 'right',
    marginRight: 8,
    fontSize: 17.5,
    color: '#465061',
    fontWeight:'bold'
  },
  pickupCard: {
    backgroundColor: '#F5F5F5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 4,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 4,
    // marginRight: 24,
  },
  label: {
    marginLeft: 6,
    letterSpacing: 4,
    lineHeight: 24,
    fontSize: 14,
    color: '#737B85',
    textTransform: 'uppercase',
  },
  bookingHead: {
    fontSize: 16,
    color: '#757575',
  },
  bookingNumber: {
    textAlign: 'right',
    marginRight: 8,
    fontSize: 20,
    color: '#465061',
  },
  name: {
    fontSize: 17,
    marginTop: 8,
    color: '#465061',
  },
  address: {
    fontSize: 12,
    color: '#757575',
    // marginBottom: 12,
    lineHeight: 20,
    maxWidth: '50%',
  },
  status: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 16,
  },
  pickedUp: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderRadius: 16,
    borderColor: '#4CAF50',
  },
  inProgress: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    backgroundColor: '#FFF3E0',
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderColor: '#E9B37B',
  },
  statusText: {
    fontSize: 11,
    color: '#E9B37B',
    // color: '#737B85',
  },
  statusTextPickup: {
    fontSize: 11,
    color: '#4CAF50',
  },
});
