import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Call, CallContent, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import Spinner from 'react-native-loading-spinner-overlay'
import Colors from '../../../../constants/Colors'
import { CustomCallControls } from '../../../../components/call/CustomCallControls'
import PiP from '@/components/call/PiP'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapPiP from '@/components/call/MapPiP'

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

  const endCall = async () => {
    setCall(null)
    await call?.endCall()
    // Hack so useEffect is called again when user calls, disconnects and calls again
    // router.back()
    router.replace('/(app-visually-impaired)')
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 15, backgroundColor: 'black' }}>
        <Spinner visible={!call} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />

        {call && (
          <StreamCall call={call}>
            <CallContent CallControls={() => <CustomCallControls onPress={endCall} />} />
          </StreamCall>
        )}
        <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}>{call && <MapPiP />}</View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({})

export default Room
