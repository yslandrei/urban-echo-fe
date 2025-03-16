import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { styles as appStyles } from './start-a-call'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Settings = () => {
  const { authState, onSignOut } = useAuth()
  const insets = useSafeAreaInsets()

  return (
    <View style={[appStyles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={appStyles.headerText}>Settings</Text>
      <View style={{ width: '100%', height: 1, backgroundColor: 'gray', marginTop: 10, marginBottom: 20 }} />
      <Text style={styles.text}>{`Your Friend Code is: ${authState?.friendCode}`}</Text>
      <Button title="Logout" onPress={() => onSignOut()} />
    </View>
  )
}
const styles = StyleSheet.create({
  text: {
    color: Colors.fontColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
})

export default Settings
