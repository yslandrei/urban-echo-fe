import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { styles as globalStyles } from '../../(auth)/1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const StartACall = () => {
  const insets = useSafeAreaInsets()

  const router = useRouter()

  const { authState } = useAuth()

  const handleCallRandomVolunteer = () => {
    router.push(`/(room)/${authState?.id}`)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: 25, gap: 20 }]}>
      <TouchableOpacity style={[styles.topButton]} onPress={handleCallRandomVolunteer}>
        <Text style={[styles.headerText, { padding: 20, textAlign: 'center' }]}>Call a random volunteer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.bottomButton, { marginTop: 10 }]} onPress={() => {}}>
        <Text style={[styles.headerText, { padding: 20, textAlign: 'center' }]}>Call a designated volunteer</Text>
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
    fontSize: 24,
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
