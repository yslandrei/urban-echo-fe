import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import { useFocusEffect, useRouter } from 'expo-router'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Speech from 'expo-speech'
import { useShake } from '@/context/shake'
import Voice from '@react-native-voice/voice'
import { useVoiceCommands } from '@/context/voiceCommands'

const Welcome = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const redirectTo2ndStepWithCues = () => {
    router.push('/2-do-you-have-an-account?isVisuallyImpaired=1')
  }

  const redirectTo2nd = () => {
    router.push('/2-do-you-have-an-account')
  }

  useVoiceCommands({
    isVisuallyImpaired: true,
    preface:
      'Welcome to UrbanEcho! This app helps visually impaired users explore the world. Navigation through the app can be done both by pressing buttons or voice commands',
    commands: {
      'I need visual assistance': redirectTo2ndStepWithCues,
      'I would like to volunteer': redirectTo2nd,
    },
  })

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={[styles.topButton, { marginTop: 10 }]} onPress={redirectTo2ndStepWithCues}>
        <Text style={[styles.buttonText, { padding: 20, textAlign: 'center' }]}>I need visual assistance</Text>
      </TouchableOpacity>
      <View style={styles.middleBox}>
        <View style={styles.bar} />
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <Text style={[styles.headerText, { marginHorizontal: 15 }]}>Welcome to UrbanEcho</Text>
          <Text style={styles.subText}>Navigate the world together</Text>
        </View>
        <View style={styles.bar} />
      </View>
      <TouchableOpacity style={[styles.bottomButton, { marginBottom: insets.bottom }]} onPress={redirectTo2nd}>
        <Text style={[styles.buttonText, { padding: 20, textAlign: 'center' }]}>
          I'd like to help visually impaired people
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    gap: 30,
  },
  middleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.fontColor,
    fontWeight: 'bold',
    fontSize: 24,
  },
  buttonText: {
    color: Colors.fontColor,
    fontWeight: 'bold',
    fontSize: 32,
  },
  subText: {
    color: Colors.fontColor,
    fontSize: 18,
  },
  bar: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.fontColor,
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
  smallButton: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  smallButtonText: {
    color: Colors.fontColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default Welcome
