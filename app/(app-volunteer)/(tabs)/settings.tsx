import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'

const Settings = () => {
  const { onSignOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.font}>Settings</Text>
      <Button title="Logout" onPress={() => onSignOut()} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  font: {
    color: Colors.fontColor,
  },
})

export default Settings
