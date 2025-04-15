import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles } from './1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useVoiceCommands } from '@/context/voiceCommands'
import Voice from '@react-native-voice/voice'

const DoYouHaveAnAccount = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const params = useLocalSearchParams()
  const isVisuallyImpaired = params.isVisuallyImpaired === '1'

  const redirectToSignIn = () => {
    router.push(`/3-sign-up-or-in?isVisuallyImpaired=${params.isVisuallyImpaired}&hasAccount=1`)
  }

  const redirectToSignUp = () => {
    router.push(`/3-sign-up-or-in?isVisuallyImpaired=${params.isVisuallyImpaired}`)
  }

  useVoiceCommands({
    isVisuallyImpaired,
    preface: 'Do you have an account?',
    commands: {
      Yes: redirectToSignIn,
      No: redirectToSignUp,
      Back: () => router.back(),
    },
  })

  return (
    <View style={[authStyles.mainContainer, { paddingBottom: insets.bottom }]}>
      {isVisuallyImpaired ? (
        <>
          <TouchableOpacity style={[authStyles.topButton, { marginTop: 10 }]} onPress={redirectToSignIn}>
            <Text style={authStyles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <View style={authStyles.middleBox}>
            <View style={authStyles.bar} />
            <Text style={[authStyles.headerText, { marginHorizontal: 15 }]}>Do you have an account?</Text>
            <View style={authStyles.bar} />
          </View>
        </>
      ) : (
        <>
          <View style={[authStyles.middleBox, { marginTop: 10 }]}>
            <Text style={authStyles.headerText}>Do you have an account?</Text>
          </View>
          <TouchableOpacity style={authStyles.smallButton} onPress={redirectToSignIn}>
            <Text style={authStyles.smallButtonText}>Yes</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={isVisuallyImpaired ? authStyles.bottomButton : authStyles.smallButton}
        onPress={redirectToSignUp}
      >
        <Text style={isVisuallyImpaired ? authStyles.buttonText : authStyles.smallButtonText}>No</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})

export default DoYouHaveAnAccount
