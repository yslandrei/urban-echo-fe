import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/auth'

const AppEntry = () => {
  const { onLogout } = useAuth()
  
  return (
    <View style={styles.container}> 
      <Text style={styles.font}>Inside App</Text>
      <Button title="Logout" onPress={() => onLogout()} />
      
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
  },
  font: {
    color: '#f0f0f0',
  }
})

export default AppEntry