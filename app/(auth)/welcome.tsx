import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'

const Welcome = () => {
  const router = useRouter()

  const handleVisualAssistancePress = () => {
    router.push('/visually-impaired-auth')
  }

  const handleHelpPress = () => {
    router.push('/volunteer-auth')
  }

  return (
    <View style={styles.mainContainer}> 
      <TouchableOpacity style={styles.topButton} onPress={() => handleVisualAssistancePress()}>
        <Text style={styles.buttonText}>I need visual assistance</Text>
      </TouchableOpacity>
      <View style={styles.middleBox}>
        <View style={styles.bar} />
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={styles.headerText}>Welcome to UrbanEcho</Text>
          <Text style={styles.subText}>See the world together</Text>
        </View>
        <View style={styles.bar} />
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={() => handleHelpPress()}>
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
  },
  middleBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 30
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
    marginTop: 5
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
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    flexGrow: 1,
  },
  bottomButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    flexGrow: 1,
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