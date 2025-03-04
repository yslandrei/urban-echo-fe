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
      }}>
        <Stack.Screen name="welcome" options={{ headerShown: false }}/>
        <Stack.Screen name="visually-impaired-auth" options={{ headerBackTitle: "Urban Echo" }}/>
        <Stack.Screen name="volunteer-auth" options={{ headerBackTitle: "Urban Echo" }}/>
    </Stack>
  )
}

export default Layout