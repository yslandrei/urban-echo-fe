import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { useCall } from '@stream-io/video-react-native-sdk'

interface CustomHangupCallButtonProps {
  onPress: () => void
}

export const CustomHangupCallButton: React.FC<CustomHangupCallButtonProps> = ({ onPress }) => {
  const call = useCall()

  return (
    <Pressable onPress={onPress} style={[styles.button, styles.hangupButton]}>
      <Text style={styles.buttonText}>Disconnect</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  hangupButton: {
    backgroundColor: '#CD1C18',
  },
})
