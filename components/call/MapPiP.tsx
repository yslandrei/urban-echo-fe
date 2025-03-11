import Colors from '@/constants/Colors'
import React, { useState, useRef, useEffect } from 'react'
import { View, Animated, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import Map from './Map'
import { LocationUpdate } from '@/types/LocationUpdate'

const { width, height } = Dimensions.get('window')

const WIDTH = 120
const HEIGHT = 220
const EXPANDED_WIDTH = width * 0.9
const EXPANDED_HEIGHT = height * 0.8
const DURATION = 250

interface MapPiPProps {
  location: LocationUpdate
}

const MapPiP: React.FC<MapPiPProps> = ({ location }) => {
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
        duration: DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(animHeight, {
        toValue: expanded ? HEIGHT : EXPANDED_HEIGHT,
        duration: DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(animX, {
        toValue: expanded ? width - WIDTH - 10 : (width - EXPANDED_WIDTH) / 2,
        duration: DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(animY, {
        toValue: expanded ? height - HEIGHT - 95 : (height - EXPANDED_HEIGHT) / 2,
        duration: DURATION,
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
          <View style={!showMap && { display: 'none' }}>
            <Map location={location} />
          </View>
          {!showMap && (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.background, margin: -5 }}></View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default MapPiP
