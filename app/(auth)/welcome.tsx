import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

const Welcome = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets();

  const handleVisualAssistancePress = () => {
    router.push('/visually-impaired-auth')
  }

  const handleHelpPress = () => {
    router.push('/volunteer-auth')
  }

  return (
    <View style={styles.mainContainer}> 
      <TouchableOpacity style={[styles.topButton, { marginTop: 10 }]} onPress={() => handleVisualAssistancePress()}>
        <Text style={styles.buttonText}>I need visual assistance</Text>
      </TouchableOpacity>
      <View style={styles.middleBox}>
        <View style={styles.bar} />
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <Text style={styles.headerText}>Welcome to UrbanEcho</Text>
          <Text style={styles.subText}>See the world together</Text>
        </View>
        <View style={styles.bar} />
      </View>
      <TouchableOpacity style={[styles.bottomButton, { marginBottom: insets.bottom + 10 }]} onPress={() => handleHelpPress()}>
        <Text style={styles.buttonText}>I'd like to help visually impaired people</Text>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 22,
    marginHorizontal: 10
  },
  subText: {
    color: Colors.fontColor,
    fontSize: 20,
  },
  bar: { 
    flex: 1, 
    height: 1, 
    backgroundColor: Colors.fontColor 
  },
  topButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  bottomButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  buttonText: {
    color: Colors.fontColor,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10
  }
})

export default Welcome