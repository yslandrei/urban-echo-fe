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
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapPiP from '../../../../components/map/MapPiP'
import * as Location from 'expo-location'
import { LocationUpdate } from '../../../../types/LocationUpdate'
import CustomParticipantView from '@/components/call/CustomParticipantView'
import { useNotifications } from '@/context/notification'
import CustomFloatingParticipantView from '@/components/call/CustomFloatingParticipantView'
import { VolunteerCallControls } from '@/components/call/VolunteerCallControls'
import { BlindHangupCallButton } from '@/components/call/BlindHangupCallButton'
import { BlindCallControls } from '@/components/call/BlindCallControls'

export const LOCATION_UPDATE_TYPE = 'location-update'
const LOCATION_UPDATE_INTERVAL = 1500

const Room = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const [call, setCall] = useState<Call | null>(null)
  const client = useStreamVideoClient()

  const { onSendNotificationsToRandomVolunteers } = useNotifications()

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

    call.on('call.session_participant_left', onSendNotificationsToRandomVolunteers)

    return () => {
      clearInterval(interval)
      call.off('call.session_participant_left', onSendNotificationsToRandomVolunteers)
    }
  }, [call])

  const endCall = async () => {
    setCall(null)
    console.log('Leaving call')
    await call?.leave()
    // Hack so useEffect is called again when user calls, disconnects and calls again
    // router.back()
    router.replace('/(app-visually-impaired)')
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.backgroundLighter }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingBottom: 15, backgroundColor: 'black' }}>
          <Spinner visible={!call} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />

          {call && (
            <StreamCall call={call}>
              <CallContent
                CallControls={() => <BlindCallControls onPress={endCall} />}
                FloatingParticipantView={() => <CustomFloatingParticipantView />}
                // ParticipantView={CustomParticipantView}
              />
            </StreamCall>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({})

export default Room
