import React, { useEffect, useState, FC } from 'react';
import { View, Text, Button, Platform, Alert, Linking, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS, openSettings, Permission, PermissionStatus } from 'react-native-permissions';

interface LocationPermissionHandlerProps {
  onLocationReady?: () => void;
}

const LocationPermissionHandler: FC<LocationPermissionHandlerProps> = ({ onLocationReady }) => {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [gpsEnabled, setGpsEnabled] = useState<boolean>(false);

  const getLocationPermission = (): Permission => {
    return Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    const permission = getLocationPermission();
    
    const result: PermissionStatus = await request(permission);
    
    if (result === RESULTS.GRANTED) {
      setLocationPermission(true);
      return true;
    }
    
    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      Alert.alert(
        'Location Permission',
        'Location permission is required for this feature. Please enable it in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: () => openSettings()
          }
        ]
      );
    }
    
    return false;
  };

  const openGpsSettings = (): void => {
    if (Platform.OS === 'android') {
      // Most reliable way to directly open Android location settings
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS', [])
        .catch(err => {
          console.error('Failed to open location settings with intent', err);
          // Fallback to URL scheme
          Linking.openURL('android-app://com.android.settings/settings/location')
            .catch(() => {
              Alert.alert('Error', 'Could not open GPS settings. Please enable GPS manually.');
            });
        });
    } else if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    }
  };

  const checkGpsStatus = async (): Promise<void> => {
    try {
      // Configure geolocation
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
        enableBackgroundLocationUpdates: false,
      });

      // Try to get current position to check if GPS is enabled
      Geolocation.getCurrentPosition(
        () => {
          setGpsEnabled(true);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Error code 2 typically means GPS is disabled
          if (error.code === 2 || error.code === 3) {
            setGpsEnabled(false);
            showGpsAlert();
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.log('Error in checking GPS status:', error);
      setGpsEnabled(false);
    }
  };

  const showGpsAlert = (): void => {
    Alert.alert(
      'GPS Required',
      'Please enable your GPS to use location features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open GPS Settings', 
          onPress: openGpsSettings
        }
      ]
    );
  };

  // Check both GPS and permissions when component mounts
  useEffect(() => {
    const checkLocationSetup = async (): Promise<void> => {
      // First check if permission is granted
      const permResult: PermissionStatus = await check(getLocationPermission());
      
      if (permResult === RESULTS.GRANTED) {
        setLocationPermission(true);
        await checkGpsStatus();
      } else {
        const gotPermission = await requestLocationPermission();
        if (gotPermission) {
          await checkGpsStatus();
        }
      }
    };

    checkLocationSetup();
  }, []);

  // When both conditions are met, notify parent component
  useEffect(() => {
    if (locationPermission && gpsEnabled && onLocationReady) {
      onLocationReady();
    }
  }, [locationPermission, gpsEnabled, onLocationReady]);

  return (
    <View style={styles.container}>
      {(!locationPermission || !gpsEnabled) && (
        <>
          <Text style={styles.messageText}>
            {!locationPermission 
              ? 'Location permission is required.'
              : 'Please enable GPS to continue.'}
          </Text>
          <Button
            title={!locationPermission ? "Grant Permission" : "Open GPS Settings"}
            onPress={!locationPermission ? requestLocationPermission : openGpsSettings}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default LocationPermissionHandler;