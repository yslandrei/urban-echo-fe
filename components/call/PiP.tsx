import React, { useState, useRef, useEffect } from 'react'
import { View, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'

const { width, height } = Dimensions.get('window')
const WIDTH = 120
const HEIGHT = 220
const EXPANDED_WIDTH = width * 0.9
const EXPANDED_HEIGHT = height * 0.8

const PiP = () => {
  const pan = useRef(new Animated.ValueXY()).current
  const initialX = width - WIDTH - 10
  const initialY = height - HEIGHT - 95
  const panOffset = useRef({ x: initialX, y: initialY })
  const [expanded, setExpanded] = useState(false)

  const onGestureEvent = Animated.event([{ nativeEvent: { translationX: pan.x, translationY: pan.y } }], {
    useNativeDriver: false,
  })

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const posX = panOffset.current.x + event.nativeEvent.translationX
      const posY = panOffset.current.y + event.nativeEvent.translationY
      const snapX = posX + WIDTH / 2 > width / 2 ? width - WIDTH - 10 : 10
      const snapY = posY + HEIGHT / 2 > height / 2 ? height - HEIGHT - 95 : 50

      Animated.spring(pan, {
        toValue: {
          x: snapX - panOffset.current.x,
          y: snapY - panOffset.current.y,
        },
        useNativeDriver: false,
        friction: 5,
      }).start(() => {
        panOffset.current = { x: snapX, y: snapY }
        pan.flattenOffset()
        pan.setValue({ x: 0, y: 0 })
        pan.setOffset(panOffset.current)
      })
    }
  }

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 })
    pan.setOffset(panOffset.current)
  }, [])

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const getCenteredStyle = () => {
    if (expanded) {
      return {
        left: (width - EXPANDED_WIDTH) / 2,
        top: (height - EXPANDED_HEIGHT) / 2,
      }
    }
    return {}
  }

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        backgroundColor: expanded ? 'rgba(0,0,0,0.5)' : 'transparent',
        width: '100%',
        height: '100%',
      }}
    >
      {expanded && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          onPress={toggleExpand}
        />
      )}

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!expanded}
      >
        <Animated.View
          style={{
            position: 'absolute',
            width: expanded ? EXPANDED_WIDTH : WIDTH,
            height: expanded ? EXPANDED_HEIGHT : HEIGHT,
            backgroundColor: 'white',
            borderRadius: 10,
            transform: [{ translateX: expanded ? 0 : pan.x }, { translateY: expanded ? 0 : pan.y }],
            ...getCenteredStyle(),
          }}
        >
          {!expanded && <TouchableOpacity style={{ flex: 1 }} onPress={toggleExpand} />}
          <View style={{ flex: 1 }}></View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default PiP
