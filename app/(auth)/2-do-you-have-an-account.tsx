import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles }  from './1-welcome' 
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

const DoYouHaveAnAccount = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets();
  const { playAudioCues } = useLocalSearchParams();

  const redirectToSignIn = () => {
    router.push(`/3-sign-up-or-in?playAudioCues=${playAudioCues}&hasAccount=1`)
  }

  const redirectToSignUp = () => {
    router.push(`/3-sign-up-or-in?playAudioCues=${playAudioCues}`)
  }

  return (
    <View style={authStyles.mainContainer}> 
      <TouchableOpacity style={[authStyles.topButton, { marginTop: 10 }]} onPress={ redirectToSignIn }>
        <Text style={[authStyles.headerText, { padding: 20, textAlign: 'center' }]}>Yes</Text>
      </TouchableOpacity>
      <View style={authStyles.middleBox}>
        <View style={authStyles.bar} />
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={[authStyles.headerText, { marginHorizontal: 15 }]}>Do you have an account?</Text>
        </View>
        <View style={authStyles.bar} />
      </View>
      <TouchableOpacity style={[authStyles.bottomButton, { marginBottom: insets.bottom }]} onPress={redirectToSignUp}>
        <Text style={[authStyles.headerText, { padding: 20, textAlign: 'center' }]}>No</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
   
})

export default DoYouHaveAnAccount