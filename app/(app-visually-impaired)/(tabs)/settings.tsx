import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { styles as appStyles } from './call'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Settings = () => {
  const { onSignOut } = useAuth()
  const insets = useSafeAreaInsets()

  return (
    <View style={[appStyles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={appStyles.headerText}>Settings</Text>
      <Button title="Logout" onPress={() => onSignOut()} />
    </View>
  )
}
const styles = StyleSheet.create({})

export default Settings
