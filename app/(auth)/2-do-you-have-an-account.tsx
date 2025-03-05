import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles } from './1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

const DoYouHaveAnAccount = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { isVisuallyImpaired } = useLocalSearchParams()

  const redirectToSignIn = () => {
    router.push(`/3-sign-up-or-in?isVisuallyImpaired=${isVisuallyImpaired}&hasAccount=1`)
  }

  const redirectToSignUp = () => {
    router.push(`/3-sign-up-or-in?isVisuallyImpaired=${isVisuallyImpaired}`)
  }

  return (
    <View style={[authStyles.mainContainer, { paddingBottom: insets.bottom }]}>
      {isVisuallyImpaired ? (
        <>
          <TouchableOpacity style={authStyles.topButton} onPress={redirectToSignIn}>
            <Text style={authStyles.headerText}>Yes</Text>
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
          <TouchableOpacity
            style={isVisuallyImpaired ? authStyles.topButton : authStyles.smallButton}
            onPress={redirectToSignIn}
          >
            <Text style={isVisuallyImpaired ? authStyles.headerText : authStyles.smallButtonText}>Yes</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={isVisuallyImpaired ? authStyles.bottomButton : authStyles.smallButton}
        onPress={redirectToSignUp}
      >
        <Text style={isVisuallyImpaired ? authStyles.headerText : authStyles.smallButtonText}>No</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})

export default DoYouHaveAnAccount
