import React from 'react'
import { Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useCall } from '@stream-io/video-react-native-sdk'
import Colors from '@/constants/Colors'

interface BlindHangupCallButtonProps {
  onPress: () => void
}

export const BlindHangupCallButton: React.FC<BlindHangupCallButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, styles.hangupButton]}>
      <Text style={styles.buttonText}>Disconnect</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: '93%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  hangupButton: {
    backgroundColor: '#CD1C18',
  },
})
