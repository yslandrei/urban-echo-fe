import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Colors from '../../../constants/Colors'
import { AuthProvider, useAuth } from '../../../context/auth'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { Slot, Stack, Tabs } from 'expo-router'
import { useEffect, useState } from 'react'
import { StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-native-sdk'

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY || 'stream-api-key'

const Layout = () => {
  const [client, setClient] = useState<StreamVideoClient | null>(null)

  const { authState } = useAuth()

  useEffect(() => {
    if (!authState?.authenticated) {
      console.log('disconnect user')
      // TODO: disconnect the user when he closes the app. currently this is not working through this
      client?.disconnectUser()
    }

    if (authState?.authenticated && authState.streamToken) {
      const user: User = { id: authState.id }

      try {
        const client = new StreamVideoClient({ apiKey: STREAM_KEY, user, token: authState.streamToken })
        setClient(client)
        setTimeout(() => {
          console.log('client: ', client)
        }, 1000)
      } catch (e) {
        console.log('Error creating client: ', e)
      }
    }
  }, [authState])

  return (
    <>
      {client ? (
        <StreamVideo client={client}>
          <InsideLayout />
        </StreamVideo>
      ) : (
        <InsideLayout />
      )}
    </>
  )
}

const InsideLayout = () => {
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
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="phone" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="cog-outline" color={color} />,
        }}
      />
    </Tabs>
  )
}

export default Layout
