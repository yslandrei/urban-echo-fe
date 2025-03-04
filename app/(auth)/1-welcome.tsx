import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

const Welcome = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets();

  const redirectTo2ndStepWithCues = () => {
    router.push('/2-do-you-have-an-account?playAudioCues=1')
  }

  const redirectTo2nd = () => {
    router.push('/2-do-you-have-an-account')
  }

  return (
    <View style={styles.mainContainer}> 
      <TouchableOpacity style={[styles.topButton, { marginTop: 10 }]} onPress={ redirectTo2ndStepWithCues }>
        <Text style={[styles.headerText, { padding: 20, textAlign: 'center' }]}>I need visual assistance</Text>
      </TouchableOpacity>
      <View style={styles.middleBox}>
        <View style={styles.bar} />
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <Text style={[styles.headerText, { marginHorizontal: 15 }]}>Welcome to UrbanEcho</Text>
          <Text style={styles.subText}>See the world together</Text>
        </View>
        <View style={styles.bar} />
      </View>
      <TouchableOpacity style={[styles.bottomButton, { marginBottom: insets.bottom  }]} onPress={ redirectTo2nd }>
        <Text style={[styles.headerText, { padding: 20, textAlign: 'center' }]}>I'd like to help visually impaired people</Text>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    gap: 30
  },
  middleBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  headerText: {
    color: Colors.fontColor,
    fontWeight: 'bold',
    fontSize: 24,
  },
  subText: {
    color: Colors.fontColor,
    fontSize: 18,
  },
  bar: { 
    flex: 1, 
    height: 1, 
    backgroundColor: Colors.fontColor 
  },
  topButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  bottomButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
})

export default Welcome