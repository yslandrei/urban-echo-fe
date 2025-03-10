import Colors from '@/constants/Colors'
import React, { useState, useRef, useEffect } from 'react'
import { View, Animated, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import MapView from 'react-native-maps'
import { AnimatedMapView } from 'react-native-maps/lib/MapView'
import { AnimatedMarker } from './AnimatedMarker'
import { useAnimatedRegion } from './useAnimatedRegion'
import { Easing } from 'react-native-reanimated'
import puck from '@/constants/puck'

const { width, height } = Dimensions.get('window')

const WIDTH = 120
const HEIGHT = 220
const EXPANDED_WIDTH = width * 0.9
const EXPANDED_HEIGHT = height * 0.8

const MapPiP = () => {
  const [expanded, setExpanded] = useState(false)
  const [showMap, setShowMap] = useState(true)

  const animWidth = useRef(new Animated.Value(WIDTH)).current
  const animHeight = useRef(new Animated.Value(HEIGHT)).current
  const animX = useRef(new Animated.Value(width - WIDTH - 10)).current
  const animY = useRef(new Animated.Value(height - HEIGHT - 95)).current

  const toggleExpand = () => {
    setShowMap(false)
    Animated.parallel([
      Animated.timing(animWidth, {
        toValue: expanded ? WIDTH : EXPANDED_WIDTH,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animHeight, {
        toValue: expanded ? HEIGHT : EXPANDED_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animX, {
        toValue: expanded ? width - WIDTH - 10 : (width - EXPANDED_WIDTH) / 2,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animY, {
        toValue: expanded ? height - HEIGHT - 95 : (height - EXPANDED_HEIGHT) / 2,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => setShowMap(true))
    setExpanded(!expanded)
  }

  return (
    <View style={{ flex: 1 }}>
      {expanded && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onPress={toggleExpand} // Tap outside to close
        />
      )}

      <Animated.View
        style={{
          position: 'absolute',
          width: animWidth,
          height: animHeight,
          left: animX,
          top: animY,
          backgroundColor: 'white',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} onLongPress={() => !expanded && toggleExpand()} activeOpacity={1}>
          {showMap ? (
            <Map />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.background, margin: -5 }}>
              <ActivityIndicator size="small" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const Map = () => {
  const animatedRegion = useAnimatedRegion({
    location: {
      latitude: 46.77092,
      longitude: 23.58992,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  })

  useEffect(() => {
    // we'll use this when we get websocket update. TODO: find a way to also display direction of phone
    animatedRegion.animate({
      latitude: 46.77192,
      longitude: 23.5899,
      duration: 500,
      easing: Easing.ease,
    })
  }, [])

  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitude: 46.77092,
        longitude: 23.58992,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <AnimatedMarker animatedProps={animatedRegion.props}>
        <View>{puck()}</View>
      </AnimatedMarker>
    </MapView>
  )
}

export default MapPiP
