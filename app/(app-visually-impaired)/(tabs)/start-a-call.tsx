import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { styles as globalStyles } from '../../(auth)/1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useNotifications } from '@/context/notification'
import { useVoiceCommands } from '@/context/voiceCommands'

const StartACall = () => {
  const insets = useSafeAreaInsets()

  const router = useRouter()

  const { authState } = useAuth()

  const { onSendNotificationsToRandomVolunteers, onSendNotificationsToDesignatedVolunteers } = useNotifications()

  const handleCallRandomVolunteer = () => {
    onSendNotificationsToRandomVolunteers()
    router.push(`/(room)/${authState?.id}`)
  }

  const handleCallDesignatedVolunteer = () => {
    onSendNotificationsToDesignatedVolunteers()
    router.push(`/(room)/${authState?.id}`)
  }

  useVoiceCommands({
    isVisuallyImpaired: true,
    preface: 'Call tab.',
    commands: {
      'Call a random volunteer': handleCallRandomVolunteer,
      'Call an assigned volunteer': handleCallDesignatedVolunteer,
      'Settings tab': () => router.push('/settings'),
    },
  })

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: 25, gap: 20 }]}>
      <TouchableOpacity onPress={handleCallRandomVolunteer} style={[styles.topButton]}>
        <Text style={[styles.headerText, { padding: 20, textAlign: 'center' }]}>Call a random volunteer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCallDesignatedVolunteer} style={[styles.bottomButton, { marginTop: 10 }]}>
        <Text style={[styles.headerText, { padding: 20, textAlign: 'center' }]}>Call an assigned volunteer</Text>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  headerText: {
    color: Colors.fontColor,
    fontWeight: 'bold',
    fontSize: 32,
  },
  topButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
})

export default StartACall
