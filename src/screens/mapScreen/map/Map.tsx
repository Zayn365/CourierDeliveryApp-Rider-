import React, {useEffect, useMemo, useRef} from 'react';
import {Image, StyleSheet, Animated} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY} from '@env';
import {mapStyle} from '@assets/css/mapStyle';
import useMapStore from '@utils/store/mapStore';
import Icons from '@utils/imagePaths/imagePaths';

type Prop = {
  currentStep: number;
};

const Map: React.FC<Prop> = ({currentStep}) => {
  const data: any = useMapStore();
  const {
    destination,
    setDistance,
    setDuration,
    currentLocation,
    riderLocation,
    heading,
  } = data;

  // const mapRef = useRef<MapView | null>(null);

  const animatedRiderLocation = useRef(
    new AnimatedRegion({
      latitude: riderLocation?.latitude || 24.8607,
      longitude: riderLocation?.longitude || 67.0011,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
  ).current;

  const animatedHeading = useRef(new Animated.Value(heading || 0)).current;

  // const adjustMapToCoordinates = (coordinates: any) => {
  //   if (mapRef?.current) {
  //     mapRef.current.fitToCoordinates(coordinates, {
  //       edgePadding: {
  //         top: 190,
  //         right: 150,
  //         bottom: 50,
  //         left: 50,
  //       },
  //       animated: true,
  //     });
  //   }
  // };

  useEffect(() => {
    if (riderLocation) {
      animatedRiderLocation
        .timing({
          latitude: riderLocation.latitude,
          longitude: riderLocation.longitude,
          duration: 1000,
          useNativeDriver: false,
          toValue: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        })
        .start();
    }

    if (heading !== null) {
      Animated.timing(animatedHeading, {
        toValue: heading,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [riderLocation, heading, animatedRiderLocation, animatedHeading]);
  const renderDirections = useMemo(() => {
    if (!riderLocation || !destination) return null;

    return currentStep === 1 ? (
      <MapViewDirections
        origin={riderLocation}
        destination={destination}
        waypoints={[currentLocation]}
        apikey={GOOGLE_API_KEY}
        strokeColor={'#4CD964'}
        strokeWidth={4}
        optimizeWaypoints={true}
        mode="DRIVING"
        onReady={result => {
          setDistance(result.distance);
          setDuration(result.duration);
          // adjustMapToCoordinates(result.coordinates);
        }}
        onError={errorMessage => {
          console.error('Error with MapViewDirections:', errorMessage);
        }}
      />
    ) : currentStep === 2 ? (
      <MapViewDirections
        origin={riderLocation}
        destination={currentLocation}
        apikey={GOOGLE_API_KEY}
        strokeColor={'#4CD964'}
        strokeWidth={4}
        optimizeWaypoints={true}
        mode="DRIVING"
        onReady={result => {
          setDistance(result.distance);
          setDuration(result.duration);
          // adjustMapToCoordinates(result.coordinates);
        }}
        onError={errorMessage => {
          console.error('Error with MapViewDirections:', errorMessage);
        }}
      />
    ) : (
      <MapViewDirections
        origin={riderLocation}
        destination={destination}
        apikey={GOOGLE_API_KEY}
        strokeColor={'#4CD964'}
        strokeWidth={4}
        optimizeWaypoints={true}
        mode="DRIVING"
        onReady={result => {
          setDistance(result.distance);
          setDuration(result.duration);
          // adjustMapToCoordinates(result.coordinates);
        }}
        onError={errorMessage => {
          console.error('Error with MapViewDirections:', errorMessage);
        }}
      />
    );
  }, [
    riderLocation,
    destination,
    currentStep,
    currentLocation,
    setDistance,
    setDuration,
  ]);
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      showsUserLocation={true}
      loadingEnabled={false}
      key={`${riderLocation?.latitude}-${riderLocation.longitude}-${currentStep}`}
      customMapStyle={mapStyle}
      region={{
        latitude: riderLocation?.latitude || 24.8607,
        longitude: riderLocation?.longitude || 67.0011,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      initialRegion={{
        latitude: riderLocation?.latitude || 24.8607,
        longitude: riderLocation?.longitude || 67.0011,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      <Marker.Animated
        anchor={{x: 0.5, y: 0.5}}
        calloutAnchor={{x: 0.5, y: 0.5}}
        coordinate={{
          latitude: animatedRiderLocation.latitude,
          longitude: animatedRiderLocation.longitude,
        }}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animatedHeading.interpolate({
                  inputRange: [0, 500],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}>
          <Image source={Icons.rider} style={{width: 40, height: 40}} />
        </Animated.View>
      </Marker.Animated>

      {currentStep === 1 || currentStep === 2 ? (
        <Marker
          coordinate={currentLocation}
          draggable={false}
          image={Icons.pickUp}
        />
      ) : (
        ''
      )}
      {currentStep === 1 || currentStep === 3 ? (
        <Marker
          coordinate={destination}
          draggable={false}
          image={Icons.destination}
        />
      ) : (
        ''
      )}

      {renderDirections}
    </MapView>
  );
};

export default Map;
