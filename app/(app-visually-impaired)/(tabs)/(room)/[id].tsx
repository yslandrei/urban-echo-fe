import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  Call,
  CallContent,
  CustomVideoEvent,
  StreamCall,
  StreamVideoEvent,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk'
import Spinner from 'react-native-loading-spinner-overlay'
import Colors from '../../../../constants/Colors'
import { CustomCallControls } from '../../../../components/call/CustomCallControls'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapPiP from '../../../../components/call/MapPiP'
import * as Location from 'expo-location'
import { LocationUpdate } from '../../../../types/LocationUpdate'
import CustomParticipantView from '@/components/call/CustomParticipantView'

const LOCATION_UPDATE_TYPE = 'location-update'
const LOCATION_UPDATE_INTERVAL = 1500

const Room = () => {
  const insets = useSafeAreaInsets()

  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const [call, setCall] = useState<Call | null>(null)
  const client = useStreamVideoClient()

  useEffect(() => {
    if (!client || call) return

    const joinCall = async () => {
      const call = client.call('default', id)
      await call.join({ create: true })
      setCall(call)
    }

    joinCall()
  }, [])

  useEffect(() => {
    if (!call) return

    let interval
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission denied')
        return
      }

      let loc = await Location.getCurrentPositionAsync()
      let heading = await Location.getHeadingAsync()

      await call?.sendCustomEvent({
        type: LOCATION_UPDATE_TYPE,
        data: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          heading: heading.trueHeading,
        },
      })
    }

    interval = setInterval(getCurrentLocation, LOCATION_UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [call])

  const [location, setLocation] = useState<LocationUpdate>()

  useEffect(() => {
    if (!call) return

    const handleCustomEvent = (event: StreamVideoEvent) => {
      const customEvent = event as CustomVideoEvent
      const payload = customEvent.custom
      if (payload.type === LOCATION_UPDATE_TYPE) {
        setLocation({
          latitude: payload.data.latitude,
          longitude: payload.data.longitude,
          heading: payload.data.heading,
        })
      }
    }

    call.on('custom', handleCustomEvent)

    return () => {
      call.off('custom', handleCustomEvent)
    }
  }, [call])

  const endCall = async () => {
    setCall(null)
    await call?.endCall()
    // Hack so useEffect is called again when user calls, disconnects and calls again
    // router.back()
    router.replace('/(app-visually-impaired)')
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 15, backgroundColor: 'black' }}>
        <Spinner visible={!call} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />

        {call && (
          <StreamCall call={call}>
            <CallContent
              CallControls={() => <CustomCallControls onPress={endCall} />}
              ParticipantView={CustomParticipantView}
            />
          </StreamCall>
        )}
        <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}>
          {call && location && <MapPiP location={location} />}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Room
