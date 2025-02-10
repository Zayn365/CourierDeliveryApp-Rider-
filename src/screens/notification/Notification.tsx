import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import useChatStore from '@utils/store/chatStore';

type Props = {};

const Notification = (props: Props) => {
  const {notification} = useChatStore();
  console.log('🚀 ~ Notification ~ notification:', notification);

  const renderNotificationItem = ({item}: {item: any}) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item?.title || 'No Title'}</Text>
      <Text style={styles.notificationBody}>{item?.body || 'No Content'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {notification?.length > 0 ? (
        <FlatList
          data={notification}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNotificationItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications available</Text>
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationBody: {
    fontSize: 14,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
