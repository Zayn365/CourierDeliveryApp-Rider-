import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapScreen from '../screens/mapScreen/MapScreen';
import OrderList from '../screens/orderList/OrderList';
import MyTabBar from '../components/Routing/Tabs';
import Wallet from '../screens/wallet/Wallet';
import Shipment from '../screens/shipment/Shipment';
import Settings from '../screens/settings/Settings';
import Home from '../screens/home/Home';
import ParcelDetailsScreen from '@screens/parcelDetail/ParcelDetail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 160,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarLabel: 'Wallet',
        }}
      />
      <Tab.Screen
        name="Shipments"
        component={Shipment}
        options={{
          tabBarLabel: 'Shipments',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator for handling screens outside of Tabs
const MainRouter = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ParcelDetails" component={ParcelDetailsScreen} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Home
const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="OrderList" component={OrderList} />
    </Stack.Navigator>
  );
};

export default MainRouter;
