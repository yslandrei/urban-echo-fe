import { View, Text, StyleSheet, Button, TouchableOpacity, Share } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { styles as appStyles } from './start-a-call'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useVoiceCommands } from '@/context/voiceCommands'

const Settings = () => {
  const { authState, onSignOut } = useAuth()
  const insets = useSafeAreaInsets()

  const router = useRouter()

  const redirectToPickLanguages = () => {
    router.push(`/(auth)/4-pick-languages?isVisuallyImpaired=1`)
  }

  const handleShareFriendCode = () => {
    Share.share({
      message: 'Become my designated volunteer on the UrbanEcho app! My friend code is ' + authState?.friendCode,
    })
  }

  useVoiceCommands({
    isVisuallyImpaired: true,
    preface: 'Settings tab. Your friend code is ' + authState?.friendCode.split('').join(', ') + '.',
    commands: {
      'Change languages': redirectToPickLanguages,
      'Share friend code': handleShareFriendCode,
      'Call tab': () => router.push('/start-a-call'),
    },
  })

  return (
    <View style={[appStyles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={appStyles.headerText}>Settings</Text>
      <View style={{ width: '100%', height: 1, backgroundColor: 'gray', marginTop: 10, marginBottom: 20 }} />
      <View style={styles.settingBox}>
        <View style={styles.row}>
          <Text style={styles.text}>
            👤 Friend Code: <Text style={{ fontWeight: 'bold' }}> {authState?.friendCode}</Text>
          </Text>
          <TouchableOpacity onPress={handleShareFriendCode} style={{ marginBottom: 7 }}>
            <Ionicons size={26} color={Colors.fontColor} name="share-outline" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtext}>
          Volunteers can assign themselves to you using this code. Once assigned, you can call them directly
        </Text>
      </View>
      <TouchableOpacity onPress={redirectToPickLanguages} style={styles.settingBox}>
        <View style={styles.row}>
          <Text style={styles.text}>🌍 Change Languages</Text>
          <Ionicons size={26} color={Colors.fontColor} name="chevron-forward-outline" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSignOut} style={styles.settingBox}>
        <View style={styles.row}>
          <Text style={styles.text}>👋 Sign Out</Text>
          <Ionicons size={26} color={Colors.fontColor} name="chevron-forward-outline" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  text: {
    color: Colors.fontColor,
    fontSize: 22,
  },
  subtext: {
    color: 'lightgray',
    fontSize: 18,
    marginTop: 3,
  },
  settingBox: {
    backgroundColor: Colors.backgroundLighter,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default Settings
