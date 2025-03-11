import { useEffect } from 'react'
import { useAnimatedRegion } from './useAnimatedRegion'
import { Easing } from 'react-native-reanimated'
import MapView, { Marker } from 'react-native-maps'
import { AnimatedMarker } from './AnimatedMarker'
import { View, Text } from 'react-native'
import Svg, { Circle, Polygon } from 'react-native-svg'
import Colors from '../../constants/Colors'
import { LocationUpdate } from '@/types/LocationUpdate'

const DELTA = 0.003

interface MapProps {
  location: LocationUpdate
}

const Map: React.FC<MapProps> = ({ location }) => {
  const animatedRegion = useAnimatedRegion({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  })

  useEffect(() => {
    animatedRegion.animate({
      latitude: location.latitude,
      longitude: location.longitude,
      duration: 500,
      easing: Easing.linear,
    })
  }, [location])

  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: DELTA,
        longitudeDelta: DELTA,
      }}
    >
      <AnimatedMarker animatedProps={animatedRegion.props}>
        {/* <View style={{ transform: [{ rotate: `${location.heading.toFixed(0)}deg` }] }}> */}
        <Svg height="38" width="38">
          {/* <Polygon points="19,0 8,19 30,19" fill={Colors.primary} /> */}
          <Circle cx="19" cy="19" r="10" fill={Colors.fontColor} />
          <Circle cx="19" cy="19" r="8" fill={Colors.primary} />
        </Svg>
        {/* </View> */}
      </AnimatedMarker>
    </MapView>
  )
}

export default Map
