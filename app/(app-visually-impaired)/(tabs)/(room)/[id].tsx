import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Call, CallContent, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import Spinner from 'react-native-loading-spinner-overlay'
import Colors from '../../../../constants/Colors'
import { CustomCallControls } from '../../../../components/call/CustomCallControls'

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
    <View style={{ flex: 1, paddingBottom: 15, backgroundColor: Colors.background }}>
      <Spinner visible={!call} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />

      {call && (
        <StreamCall call={call}>
          <CallContent CallControls={() => <CustomCallControls onPress={endCall} />} />
        </StreamCall>
      )}
    </View>
  )
}

const styles = StyleSheet.create({})

export default Room
