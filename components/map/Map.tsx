import 'react-native-get-random-values'
import { useEffect, useState } from 'react'
import { useAnimatedRegion } from './useAnimatedRegion'
import { Easing } from 'react-native-reanimated'
import MapView, { Marker, Region } from 'react-native-maps'
import { AnimatedMarker } from '../call/AnimatedMarker'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, Polygon } from 'react-native-svg'
import Colors from '../../constants/Colors'
import { LocationUpdate } from '@/types/LocationUpdate'
import { MapViewRoute } from 'react-native-maps-routes'
import PlacesSearch from './PlacesSearch'

const DELTA = 0.003

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_KEY || 'google-api-key'

interface MapProps {
  expanded: boolean
  location: LocationUpdate
}

const Map: React.FC<MapProps> = ({ expanded, location }) => {
  const animatedRegion = useAnimatedRegion({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  })
  const [initialRegion, setInitialRegion] = useState<Region>()
  const [destinationRegion, setDestinationRegion] = useState<Region>()

  useEffect(() => {
    setInitialRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA,
    })
  }, [])

  useEffect(() => {
    animatedRegion.animate({
      latitude: location.latitude,
      longitude: location.longitude,
      duration: 1000,
      easing: Easing.linear,
    })
  }, [location])

  return (
    initialRegion && (
      <View>
        <MapView style={{ width: '100%', height: '100%' }} initialRegion={initialRegion}>
          {destinationRegion && (
            <MapViewRoute
              origin={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              }}
              destination={{
                latitude: destinationRegion.latitude,
                longitude: destinationRegion.longitude,
              }}
              strokeColor={Colors.secondary}
              apiKey={GOOGLE_API_KEY}
            />
          )}

          <AnimatedMarker animatedProps={animatedRegion.props}>
            {/* <View style={{ transform: [{ rotate: `${location.heading.toFixed(0)}deg` }] }}> */}
            <Svg height="38" width="38">
              {/* <Polygon points="19,0 8,19 30,19" fill={Colors.primary} /> */}
              <Circle cx="19" cy="19" r="10" fill={Colors.fontColor} />
              <Circle cx="19" cy="19" r="8" fill={Colors.primary} />
            </Svg>
            {/* </View> */}
          </AnimatedMarker>
          {destinationRegion && (
            <Marker
              coordinate={{
                latitude: destinationRegion.latitude,
                longitude: destinationRegion.longitude,
              }}
            />
          )}
        </MapView>
        {expanded && <PlacesSearch initialRegion={initialRegion} setDestinationRegion={setDestinationRegion} />}
      </View>
    )
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 0,
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
  },
})

export default Map
