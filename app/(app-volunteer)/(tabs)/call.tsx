import { View, Text, StyleSheet, Button, Switch, LayoutAnimation, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'

const Call = () => {
  const insets = useSafeAreaInsets()

  const [isEnabled, setIsEnabled] = useState(false)
  const [expandedFirst, setExpandedFirst] = useState(false)
  const [expandedSecond, setExpandedSecond] = useState(false)
  const [expandedThird, setExpandedThird] = useState(false)

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState)
    setExpandedFirst(false)
    setExpandedSecond(false)
    setExpandedThird(false)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.titleText}>Home</Text>
      <View style={{ width: '100%', height: 1, backgroundColor: 'gray', marginTop: 10, marginBottom: 20 }} />
      <Text style={styles.text}>
        {isEnabled
          ? "You're all set! Now you can receive calls from visually impaired users"
          : 'You are not available to receive calls. Turn on your availability to start receiving calls.'}
      </Text>

      <View style={styles.settingBox}>
        <View style={styles.row}>
          <Text style={styles.text}>✅ Availability</Text>
          <Switch
            trackColor={{ true: Colors.primary, false: '#767577' }}
            thumbColor={Colors.fontColor}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      {isEnabled && (
        <TouchableOpacity
          onPress={() => {
            setExpandedFirst(!expandedFirst)
            setExpandedSecond(false)
            setExpandedThird(false)
          }}
        >
          <View style={styles.row}>
            <Text style={styles.subtitle}>What happens next?</Text>
            <Text style={styles.subtitle}>{expandedFirst ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>
      )}
      {isEnabled && expandedFirst && (
        <View style={styles.paragraph}>
          <Text style={styles.paragraphText}>
            Whenever a visually impaired user will request assistance, you will receive a call notification. If you
            accept it you'll be redirected into a video call with them where you can provide assistance with their
            navigation
          </Text>
        </View>
      )}
      <View style={{ height: 15 }} />
      {isEnabled && (
        <TouchableOpacity
          onPress={() => {
            setExpandedSecond(!expandedSecond)
            setExpandedFirst(false)
            setExpandedThird(false)
          }}
        >
          <View style={styles.row}>
            <Text style={styles.subtitle}>How to provide assistance?</Text>
            <Text style={styles.subtitle}>{expandedSecond ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>
      )}
      {isEnabled && expandedSecond && (
        <View style={styles.paragraph}>
          <Text style={styles.paragraphText}>
            Once you accept the call, you’ll be able to view the visually impaired user's back camera feed in real time.
            You can then enter their desired destination on a map view and guide them by providing directions based on
            their current location, surroundings, and the route displayed on the map
          </Text>
        </View>
      )}
      <View style={{ height: 15 }} />
      {isEnabled && (
        <TouchableOpacity
          onPress={() => {
            setExpandedThird(!expandedThird)
            setExpandedFirst(false)
            setExpandedSecond(false)
          }}
        >
          <View style={styles.row}>
            <Text style={styles.subtitle}>Can I directly help a visually impaired friend?</Text>
            <View>
              <Text style={styles.subtitle}>{expandedThird ? '▼' : '▶'}</Text>
              <Text style={styles.subtitle}></Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {isEnabled && expandedThird && (
        <View style={styles.paragraph}>
          <Text style={styles.paragraphText}>
            Yes! You can become a designated volunteer for a visually impaired user from the settings tab. They can
            share their friend code with you, and once you enter it, you will be able to receive calls from them
            directly
          </Text>
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  paragraph: { marginTop: 10, paddingLeft: 15 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  titleText: {
    color: Colors.fontColor,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.fontColor,
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    color: Colors.fontColor,
    fontSize: 18,
  },
  paragraphText: {
    color: 'lightgray',
    fontSize: 16,
  },
  settingBox: {
    backgroundColor: Colors.backgroundLighter,
    borderRadius: 10,
    padding: 20,
    paddingVertical: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default Call
