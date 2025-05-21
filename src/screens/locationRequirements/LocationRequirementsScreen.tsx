// LocationRequirementsScreen.tsx
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Linking, Platform
} from 'react-native';

interface Props {
  hasLocationPermission: boolean | null;
  isGpsEnabled: boolean | null;
  onRequestPermission: () => Promise<boolean>;
  onCheckGps: () => Promise<boolean>;
}

const LocationRequirementsScreen: React.FC<Props> = ({
  hasLocationPermission,
  isGpsEnabled,
  onRequestPermission,
  onCheckGps,
}) => {
  useEffect(() => {
    console.log('LocationRequirementsScreen mounted');
    console.log('GPS status:', isGpsEnabled);
    console.log('Location permission status:', hasLocationPermission);
  }, [isGpsEnabled, hasLocationPermission]);

  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
        .catch(() => Linking.openSettings());
    } else {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Services Required</Text>
      <Text style={styles.description}>
        TCS Now Courier requires GPS to be enabled and location permission to access your location in 
        the background to function properly.
      </Text>
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <View style={[
            styles.statusIndicator,
            isGpsEnabled ? styles.statusOn : styles.statusOff
          ]} />
          <Text style={styles.statusText}>
            GPS: {isGpsEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[
            styles.statusIndicator,
            hasLocationPermission ? styles.statusOn : styles.statusOff
          ]} />
          <Text style={styles.statusText}>
            Permission: {hasLocationPermission ? 'Granted' : 'Not Granted'}
          </Text>
        </View>
      </View>

      {!isGpsEnabled && (
        <TouchableOpacity style={styles.button} onPress={openLocationSettings}>
          <Text style={styles.buttonText}>Enable GPS</Text>
        </TouchableOpacity>
      )}

      {!hasLocationPermission && (
        <TouchableOpacity style={styles.button} onPress={openAppSettings}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (!hasLocationPermission) {
            await onRequestPermission();
          }
          await onCheckGps();
        }}
      >
        <Text style={styles.buttonText}>Check Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
    paddingTop:50,
    backgroundColor: '#fff'
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22
  },
  statusContainer: {
    width: '100%',
    marginBottom: 30
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10
  },
  statusOn: {
    backgroundColor: '#4CAF50'
  },
  statusOff: {
    backgroundColor: '#F44336'
  },
  statusText: {
    fontSize: 16,
    color: '#333'
  },
  button: {
    backgroundColor: '#ED1C24',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default LocationRequirementsScreen;