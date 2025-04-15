import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles } from './1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../context/auth'
import Spinner from 'react-native-loading-spinner-overlay'
import { UserType } from '../../types/User'
import { useVoiceCommands } from '@/context/voiceCommands'
import * as Speech from 'expo-speech'

const SignUpOrIn = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const params = useLocalSearchParams()
  const isVisuallyImpaired = params.isVisuallyImpaired === '1'
  const hasAccount = params.hasAccount === '1'

  const { onSignIn, onSignUp } = useAuth()

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    if (!email || !pass) {
      alertUser('Alert', 'Please fill in all fields')
      return
    }

    setLoading(true)
    const result = await onSignIn(email, pass)
    if (result.error) {
      alertUser('Error', result.msg)
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    if (!email || !pass || !pass2) {
      alertUser('Alert', 'Please fill in all fields')
      return
    }
    if (pass !== pass2) {
      alertUser('Alert', 'Passwords do not match')
      return
    }

    setLoading(true)
    const result = await onSignUp(email, pass, isVisuallyImpaired ? UserType.blind : UserType.volunteer)
    setLoading(false)
    if (result.error) {
      alertUser('Error', result.msg)
    }
  }

  const alertUser = (title: string, msg: string) => {
    if (isVisuallyImpaired) {
      if (speechInProgressRef.current) return
      speechInProgressRef.current = true
      Speech.speak(title + '. ' + msg, {
        onDone: () => {
          speechInProgressRef.current = false

          playVoiceCommands()
        },
      })
    } else {
      Alert.alert(title, msg)
    }
  }

  const { playVoiceCommands, onEnterEmail, onEnterPassword, speechInProgressRef } = useVoiceCommands({
    isVisuallyImpaired,
    preface: hasAccount ? 'Sign In' : 'Sign up',
    commands: {
      'Enter email': () => onEnterEmail(setEmail),
      'Enter password': () => onEnterPassword(setPass, setPass2),
      Submit: () => {
        hasAccount ? handleSignIn() : handleSignUp()
      },
      Back: () => router.back(),
    },
  })

  return (
    <View style={[authStyles.mainContainer, { paddingTop: 10 }]}>
      <Spinner visible={loading} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />
      <Text style={authStyles.headerText}>{hasAccount ? 'Sign In' : 'Sign up'}</Text>
      <TextInput
        style={[styles.input, { fontSize: 18 }]}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />
      {!hasAccount && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          value={pass2}
          onChangeText={setPass2}
          secureTextEntry
        />
      )}
      {isVisuallyImpaired && <View style={{ flexGrow: 1 }}></View>}
      <TouchableOpacity
        style={[
          authStyles.smallButton,
          isVisuallyImpaired && { marginBottom: insets.bottom, height: '42%', justifyContent: 'center' },
        ]}
        onPress={() => {
          hasAccount ? handleSignIn() : handleSignUp()
        }}
      >
        <Text style={isVisuallyImpaired ? authStyles.buttonText : authStyles.smallButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLighter,
    color: 'white',
  },
})

export default SignUpOrIn
