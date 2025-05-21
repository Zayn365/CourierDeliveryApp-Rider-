import { LogBox } from "react-native";
LogBox.ignoreAllLogs(false); // Ensure all logs are enabled

ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error("🔥 Caught Unhandled Error:", error);
  console.error("🔥 Is Fatal:", isFatal);
});

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Animated, Platform } from 'react-native';
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE, Camera } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_API_KEY } from '@env';
import { mapStyle } from '@assets/css/mapStyle';
import useMapStore from '@utils/store/mapStore';
import Icons from '@utils/imagePaths/imagePaths';

type Prop = {
  currentStep: number;
};

const Map: React.FC<Prop> = ({ currentStep }) => {

  const data: any = useMapStore();
  const { destination, setDistance, setDuration, currentLocation, riderLocation, heading } = data;

  const [key, setKey] = useState(0);
  const mapRef = useRef<MapView | null>(null);

  // Maintain camera state
  const [camera, setCamera] = useState<Camera>({
    center: {
      latitude: riderLocation?.latitude || 24.8607,
      longitude: riderLocation?.longitude || 67.0011,
    },
    pitch: 0,
    heading: 0,
    zoom: 15,
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      setKey(prev => prev + 1);
    }
  }, [currentStep]);

  useEffect(() => {
    if (mapRef.current && currentLocation) {
      console.log("Animating camera to currentLocation:", currentLocation);
      setTimeout(() => {
        mapRef.current?.animateCamera({
          center: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          zoom: 12,
        });
      }, 1000);
    }
  }, [currentLocation, currentStep]);

  const animatedRiderLocation = useRef(
    new AnimatedRegion({
      latitude: riderLocation?.latitude || 24.8607,
      longitude: riderLocation?.longitude || 67.0011,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  ).current;

  const animatedHeading = useRef(new Animated.Value(heading || 0)).current;

  useEffect(() => {

    console.log("rider location from map screen:", riderLocation);
    
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

  }, [riderLocation, heading]);

  const onRegionChangeComplete = (newRegion: any) => {
    setCamera((prevCamera) => ({
      ...prevCamera,
      center: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      },
      zoom: Math.log2(360 / newRegion.longitudeDelta),
    }));
  };

  const onUserInteraction = () => {
    if (!mapRef.current) {
      console.warn("⚠️ Map reference is null, skipping getCamera()");
      return;
    }
    try {
      if (Platform.OS === "ios") {
        mapRef.current.getCamera().then((newCamera) => {
          setCamera(newCamera);
        }).catch((error) => {
          console.error("❌ Failed to get camera details:", error);
        });
      } else {
        console.log("Skipping getCamera() on Android to prevent crashes.");
      }
    } catch (error) {
      console.error("❌ Exception in onUserInteraction:", error);
    }
  };

  const renderDirections = useMemo(() => {
    // Log all coordinates to debug
    // console.log('renderDirections - currentStep:', currentStep);
    // console.log('riderLocation:', riderLocation);
    // console.log('destination:', destination);
    // console.log('currentLocation:', currentLocation);

    if (!riderLocation || !destination) {
      console.log('Missing required coordinates for directions');
      return null;
    }

    // Simplified logic based on currentStep
    if (currentStep === 1) {
      if (!currentLocation) {
        console.log('Missing currentLocation for step 1');
        return null;
      }
      return (
        <MapViewDirections
          origin={riderLocation}
          destination={destination}
          waypoints={[currentLocation]}
          apikey={GOOGLE_API_KEY}
          strokeColor="#4CD964"
          strokeWidth={4}
          optimizeWaypoints={true}
          mode="DRIVING"
          resetOnChange={false}
          onReady={result => {
            console.log('Directions onReady (Step 1):', result);
            setDistance(result.distance);
            setDuration(result.duration);
          }}
          onError={errorMessage => {
            console.error('Directions error (Step 1):', errorMessage);
          }}
        />
      );
    } else if (currentStep === 2 || currentStep === 66) {
      if (!currentLocation) {
        console.log('Missing currentLocation for step 2');
        return null;
      }
      return (
        <MapViewDirections
          origin={riderLocation}
          destination={currentLocation}
          apikey={GOOGLE_API_KEY}
          strokeColor="#4CD964"
          strokeWidth={4}
          optimizeWaypoints={true}
          mode="DRIVING"
          resetOnChange={false}
          onReady={result => {
            console.log('Directions onReady (Step 2):', result);
            setDistance(result.distance);
            setDuration(result.duration);
          }}
          onError={errorMessage => {
            console.error('Directions error (Step 2):', errorMessage);
          }}
        />
      );
    } else if (currentStep != 4 && currentStep != 67){
      return (
        <MapViewDirections
          origin={riderLocation}
          destination={destination}
          apikey={GOOGLE_API_KEY}
          strokeColor="#4CD964"
          strokeWidth={4}
          optimizeWaypoints={true}
          mode="DRIVING"
          resetOnChange={false}
          onReady={result => {
            console.log('Directions onReady (Step 3):', result);
            setDistance(result.distance);
            setDuration(result.duration);
          }}
          onError={errorMessage => {
            console.error('Directions error (Step 3):', errorMessage);
          }}
        />
      );
    }
  }, [riderLocation, destination, currentLocation, currentStep, setDistance, setDuration]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      showsUserLocation={true}
      loadingEnabled={false}
      key={
        Platform.OS === 'android'
          ? `${key}-${currentLocation?.latitude}-${currentLocation?.longitude}-${currentStep === 3 ? 'step3' : ''}`
          : 'map'
      }
      customMapStyle={mapStyle}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      <Marker.Animated
        anchor={{ x: 0.1, y: 0.5 }}
        calloutAnchor={{ x: 0.5, y: 0.5 }}
        coordinate={{
          latitude: animatedRiderLocation.latitude,
          longitude: animatedRiderLocation.longitude,
        }}
      >
        <Animated.View
          style={{
            // transform: [
            //   {
            //     rotate: animatedHeading.interpolate({
            //       inputRange: [0, 500],
            //       outputRange: ['0deg', '360deg'],
            //     }),
            //   },
            // ],
          }}
        >
          <Image source={Icons.rider} style={{ width: 30, height: 30 }} />
        </Animated.View>
      </Marker.Animated>

      {(currentStep === 1 || currentStep === 2 || currentStep === 66) && currentLocation && (
        <Marker coordinate={currentLocation} draggable={false} image={Icons.pickUp} style={{ width: 30, height: 30 }} />
      )}

      {(currentStep === 1 || currentStep === 3 ) && destination && (
        <Marker coordinate={destination} draggable={false} image={Icons.destination} style={{ width: 30, height: 30 }} />
      )}

      {renderDirections}
    </MapView>
  );
};

export default Map;
