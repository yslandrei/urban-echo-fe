import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

const VolunteerAuth = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.font}>VolunteerAuth</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  font: {
    color: Colors.fontColor,
  },
})

export default VolunteerAuth
