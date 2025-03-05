import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Colors from '../../constants/Colors'

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        // headerTransparent: true,
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          color: Colors.background,
        },
      }}
    >
      <Stack.Screen name="1-welcome" options={{}} />
      <Stack.Screen name="2-do-you-have-an-account" options={{ headerBackTitle: 'Urban Echo' }} />
      <Stack.Screen name="3-sign-up-or-in" options={{ headerBackTitle: 'Back' }} />
    </Stack>
  )
}

export default Layout
