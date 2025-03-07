import Colors from '../../../constants/Colors'
import { AuthProvider } from '@/context/auth'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { Slot, Stack, Tabs } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { View, StyleSheet } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.backgroundLighter,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="call"
        options={{
          title: 'Call',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen name="settings" />
    </Tabs>
  )
}

export default Layout
