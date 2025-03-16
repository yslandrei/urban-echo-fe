import { NotificationProvider, initializeNotifications, redirectNotifications } from '@/context/notification'
import { AuthProvider } from '../context/auth'
import { Slot, useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'

// SplashScreen.preventAutoHideAsync();

initializeNotifications()

const Layout = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/(auth)')
  }, [])

  redirectNotifications(router)

  return (
    <AuthProvider>
      <NotificationProvider>
        <Slot />
      </NotificationProvider>
    </AuthProvider>
  )
}

export default Layout
