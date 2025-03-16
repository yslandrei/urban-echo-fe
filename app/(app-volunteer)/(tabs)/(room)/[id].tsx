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
  useCallStateHooks,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk'
import Spinner from 'react-native-loading-spinner-overlay'
import Colors from '../../../../constants/Colors'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapPiP from '../../../../components/map/MapPiP'
import * as Location from 'expo-location'
import { LocationUpdate } from '../../../../types/LocationUpdate'
import CustomParticipantView from '@/components/call/CustomParticipantView'
import { useNotifications } from '@/context/notification'
import { LOCATION_UPDATE_TYPE } from '@/app/(app-visually-impaired)/(tabs)/(room)/[id]'
import CustomFloatingParticipantView from '@/components/call/CustomFloatingParticipantView'
import { VolunteerCallControls } from '@/components/call/VolunteerCallControls'

const Room = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const [call, setCall] = useState<Call | null>(null)
  const client = useStreamVideoClient()

  useEffect(() => {
    if (!client || call) return

    const joinCall = async () => {
      console.log(id)
      const call = client.call('default', id)
      await call.join()
      setCall(call)
    }

    joinCall()
  }, [])

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

    const endCall = (event: StreamVideoEvent) => {
      // We end the call since the visually impaired user left
      call?.endCall()
      setCall(null)

      // Hack so useEffect is called again when user calls, disconnects and calls again
      // router.back()
      router.replace('/(app-volunteer)')
    }

    call.on('custom', handleCustomEvent)
    call.on('call.session_participant_left', endCall)

    return () => {
      call.off('custom', handleCustomEvent)
      call.off('call.session_participant_left', endCall)
    }
  }, [call])

  const leaveCall = async () => {
    await call?.leave()
    setCall(null)
    // Hack so useEffect is called again when user calls, disconnects and calls again
    // router.back()
    router.replace('/(app-volunteer)')
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.backgroundLighter }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingBottom: 15, backgroundColor: 'black' }}>
          <Spinner visible={!call} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />

          {call && (
            <StreamCall call={call}>
              <CallContent
                CallControls={() => <VolunteerCallControls onPress={leaveCall} />}
                FloatingParticipantView={() => <CustomFloatingParticipantView />}
                // ParticipantView={CustomParticipantView}
              />
            </StreamCall>
          )}
          <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}>
            {call && location && <MapPiP location={location} />}
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({})

export default Room
