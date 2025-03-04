import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles }  from './1-welcome' 
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../context/auth'
import Spinner from 'react-native-loading-spinner-overlay'
// import RNShake from 'react-native-shake';

const SignUpOrIn = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets();
  const { onSignIn, onSignUp } = useAuth();
  const { playAudioCues, hasAccount } = useLocalSearchParams();

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !pass) {
        alert('Please fill in all fields')
        return
    }
    setLoading(true);
    try {
        await onSignIn(email, pass);
    } catch (e) {
        Alert.alert('Error', 'Could not log in');
    } finally {
        setLoading(false);
    }
  }

  // TODO: After sign up we should select languages. So we should change useAuth and prob add a new variable "sign up finished"
  // and the also a function that completes it
  const handleSignUp = async () => {
    if (!email || !pass || !pass2) {
      alert('Please fill in all fields')
      return
    }
    if (pass !== pass2) {
      alert('Passwords do not match')
      return
    }
    try {
        await onSignUp(email, pass);
    } catch (e) {
        Alert.alert('Error', 'Could not log in');
    } finally {
        setLoading(false);
    }
  }


  // To Do: Shake listener for audio input
//   React.useEffect(() => {
//     const subscription = RNShake.addListener(() => {
//       console.log('Shake detected!');
//     });

//     return () => {
//       console.log('dont know what this does');
//       subscription.remove();
//     };
//   }, []);

  return (
    <View style={[authStyles.mainContainer, { paddingTop: 10 }]}> 
      <Spinner 
        visible={loading} 
        animation='fade' 
        size={'small'}
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
      <Text style={authStyles.headerText}>{hasAccount ? 'Sign In' : 'Sign up'}</Text>
      <TextInput
        style={[styles.input, {fontSize: 18}]}
        placeholder="Email"
        placeholderTextColor='gray'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor='gray'
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />
      {!hasAccount && <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor='gray'
        value={pass2}
        onChangeText={setPass2}
        secureTextEntry
      />}
      {playAudioCues === '1' && <View style={{ flexGrow: 1 }}></View>}
      <TouchableOpacity 
        style={[styles.button, playAudioCues === '1' && { marginBottom: insets.bottom, height: '30%', justifyContent: 'center' }]} 
        onPress={() => { hasAccount ? handleSignIn() : handleSignUp() }}
      >
        <Text style={playAudioCues === '1' ? authStyles.headerText : styles.buttonText }>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    input: {
      width: '100%',
      padding: 15, 
      fontSize: 18,
      borderRadius: 10,
      backgroundColor: Colors.backgroundLighter,
      color: 'white',
    },
    button: {
      width: '100%',
      padding: 15,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: Colors.fontColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
})

export default SignUpOrIn