import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles } from './1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../context/auth'
import Spinner from 'react-native-loading-spinner-overlay'
import { useShake } from '../../context/shake'
import { UserType } from '../../types/User'

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

  // TODO: Use audio cues instead of alerts for visually impaired users for better accessibility
  const handleSignIn = async () => {
    if (!email || !pass) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    const result = await onSignIn(email, pass)
    if (result.error) {
      Alert.alert('Error', result.msg)
    }
    setLoading(false)
  }

  // TODO: After sign up we should select languages. So we should change useAuth and prob add a new variable "sign up finished"
  // and the also a function that completes it
  const handleSignUp = async () => {
    if (!email || !pass || !pass2) {
      alert('Please fill in all fields')
      return
    }
    if (pass !== pass2) {
      alert('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await onSignUp(email, pass, isVisuallyImpaired ? UserType.blind : UserType.volunteer)
    setLoading(false)
    if (result.error) {
      Alert.alert('Error', result.msg)
    }
    // else {
    //   router.push(`/(auth)/4-pick-languages?isVisuallyImpaired=${params.isVisuallyImpaired}`)
    // }
  }

  // TODO: Shake listener for audio input
  useShake(
    () => {
      if (!isVisuallyImpaired) return

      console.log('Device was shaken!')
    },
    {
      threshold: 800,
      debounceMs: 5000,
      updateInterval: 100,
      requiredMovements: 2,
    }
  )

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
        <Text style={isVisuallyImpaired ? authStyles.buttonText : authStyles.smallButtonText}>Next</Text>
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
