import {StyleSheet} from 'react-native';

const Order = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    paddingTop: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ED1C24',
    borderRadius: 19,
    paddingVertical: 15,
    paddingHorizontal: 6,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconSpacing: {
    paddingHorizontal: 20,
  },
  statusText: {
    letterSpacing: 5,
    fontSize: 10,
    marginBottom: 5,
    color: '#737B85',
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 22,
    color: '#465061',
  },
  orderIdText: {
    fontSize: 13,
    lineHeight: 15,
    color: '#737B85',
  },
});

export default Order;
