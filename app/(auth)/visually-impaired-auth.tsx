import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { styles as welcomeStyles }  from './welcome' 
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const VisuallyImpairedAuth = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={welcomeStyles.mainContainer}> 
      <TouchableOpacity style={[welcomeStyles.topButton, { marginTop: 10 }]} onPress={() => {}}>
        <Text style={welcomeStyles.buttonText}>I need visual assistance</Text>
      </TouchableOpacity>
      <View style={welcomeStyles.middleBox}>
        <View style={welcomeStyles.bar} />
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={welcomeStyles.headerText}>Do you have an account?</Text>
        </View>
        <View style={welcomeStyles.bar} />
      </View>
      <TouchableOpacity style={[welcomeStyles.bottomButton, { marginBottom: insets.bottom + 10 }]} onPress={() => {}}>
        <Text style={welcomeStyles.buttonText}>I'd like to help visually impaired people</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
   
})

export default VisuallyImpairedAuth