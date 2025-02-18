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
    pitch: 0, // Default flat view
    heading: 0, // Default north
    zoom: 15, // Adjust zoom level
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      setKey(prev => prev + 1);
    }
  }, [currentStep]);

  useEffect(() => {
    if (mapRef.current && currentLocation) {
      console.log("Delaying camera animation for 500ms:", currentLocation);
  
      setTimeout(() => {
        mapRef.current?.animateCamera({
          center: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          zoom: 15,
        });
      }, 500);
    }
  }, [currentLocation]);
  

  const animatedRiderLocation = useRef(
    new AnimatedRegion({
      latitude: riderLocation?.latitude || 24.8607,
      longitude: riderLocation?.longitude || 67.0011,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
  ).current;

  const animatedHeading = useRef(new Animated.Value(heading || 0)).current;

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
  }, [riderLocation, heading]);

  // Function to update camera dynamically (handles zoom, rotation, and movement)
  const onRegionChangeComplete = (newRegion:any) => {
    setCamera((prevCamera) => ({
      ...prevCamera,
      center: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      },
      zoom: Math.log2(360 / newRegion.longitudeDelta), // Approximate zoom calculation
    }));
  };

  // Function to update heading when the user rotates the map
  // const onUserInteraction = () => {
  //   if (mapRef.current) {
  //     mapRef.current.getCamera().then((newCamera) => {
  //       setCamera(newCamera);
  //     });
  //   }
  // };


  // Function to update heading when the user rotates the map
  const onUserInteraction = () => {
    if (!mapRef.current) {
      console.warn("⚠️ Map reference is null, skipping getCamera()");
      return;
    }
  
    try {
      // Ensure this only runs on iOS
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

    if (!riderLocation || !destination) return null;

    return currentStep === 1 ? (
      <MapViewDirections
        origin={riderLocation}
        destination={destination}
        waypoints={[currentLocation]}
        apikey={GOOGLE_API_KEY}
        // apikey={`AIzaSyDFEo2Fh44h_Um_Et4HxST5r3uxcI_Eips`}
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
        // apikey={`AIzaSyDFEo2Fh44h_Um_Et4HxST5r3uxcI_Eips`}
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
        // apikey={`AIzaSyDFEo2Fh44h_Um_Et4HxST5r3uxcI_Eips`}
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
  try {
  return (
    
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      showsUserLocation={true}
      loadingEnabled={false}
      key={
        Platform.OS === 'android'
          ? `${key}-${currentLocation.latitude}-${currentLocation.longitude}`
          : 'map'
      }
      customMapStyle={mapStyle}
      onRegionChangeComplete={onRegionChangeComplete} // Capture zoom & position changes
      // onTouchEnd={onUserInteraction} // Detect user interaction to capture rotation
      // onPanDrag={onUserInteraction} // Capture rotation when dragging
      // onTouchEnd and onPanDrag commented bcz it was crashing the app
    >
      <Marker.Animated
        anchor={{ x: 0.1, y: 0.5 }}
        calloutAnchor={{ x: 0.5, y: 0.5 }}
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
          <Image source={Icons.rider} style={{ width: 40, height: 40 }} />
        </Animated.View>
      </Marker.Animated>

      {currentStep === 1 || currentStep === 2 ? (
        <Marker coordinate={currentLocation} draggable={false} image={Icons.pickUp} />
      ) : null}

      {currentStep === 1 || currentStep === 3 ? (
        <Marker coordinate={destination} draggable={false} image={Icons.destination} />
      ) : null}

    {renderDirections}

    </MapView>
    
  );
} catch (error) {
  console.error("Error in Map component:", error);
  return null;
}

}

export default Map;
