import { useCallback } from 'react'
import { MapMarker, MapMarkerProps } from 'react-native-maps'
import Animated from 'react-native-reanimated'

type MarkerProps = Omit<MapMarkerProps, 'coordinate'> & {
  coordinate?: MapMarkerProps['coordinate']
}

export const AnimatedMarker = Animated.createAnimatedComponent(MapMarker as React.ComponentClass<MarkerProps>)
