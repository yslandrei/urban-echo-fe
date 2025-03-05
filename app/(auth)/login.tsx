import { View, Text, StyleSheet, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'
import { useAuth } from '../../context/auth'
import Spinner from 'react-native-loading-spinner-overlay'

const Auth = () => {
  const [loading, setLoading] = useState(false)
  const { onSignIn: onLogin, onSignUp: onRegister } = useAuth()

  // Sign in with email and password
  const onLoginpress = async () => {
    setLoading(true)

    try {
      const result = await onLogin('andrei@admin.com', 'pass')
    } catch (e) {
      Alert.alert('Error', 'Could not log in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} animation="fade" size={'small'} overlayColor="rgba(0, 0, 0, 0.5)" />
      <Text style={styles.font}>Login Page</Text>
      <Button title="Login" onPress={onLoginpress} />
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

export default Auth
