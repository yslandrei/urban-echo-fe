import React, { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { useAuth } from './auth'
import * as Notifications from 'expo-notifications'
import { Router, useRouter } from 'expo-router'

interface NotificationProps {
  onSendNotificationsToRandomVolunteers: () => Promise<any>
}

export const API_URL = process.env.EXPO_PUBLIC_SERVER_URL

const NotificationContext = createContext<NotificationProps>({
  onSendNotificationsToRandomVolunteers: async () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: any) => {
  const { authState } = useAuth()
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (authState?.jwtToken) {
      const socketInstance = io(API_URL)
      setSocket(socketInstance)

      socketInstance.on('notification', (data) => {
        console.log(data)
        Notifications.scheduleNotificationAsync({
          content: {
            title: data.title,
            data: {
              url: data.callId,
            },
          },
          trigger: null,
        })
      })

      const token = authState.jwtToken
      socketInstance.on('connect', () => {
        socketInstance.emit('register', token)
      })

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [authState])

  const sendNotification = async () => {
    try {
      const token = authState?.jwtToken
      const response = await fetch(`${API_URL}/api/notification/send-to-random-volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
    } catch (error) {
      console.error('Error sending notifications:', error)
    }
  }

  return (
    <NotificationContext.Provider value={{ onSendNotificationsToRandomVolunteers: sendNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const initializeNotifications = () => {
  Notifications.requestPermissionsAsync()
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })
}

export const redirectNotifications = (router: Router) => {
  useEffect(() => {
    let isMounted = true

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url
      if (url) {
        router.push(`/(app-volunteer)/(room)/${url}`)
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return
      }
      redirect(response?.notification)
    })

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      redirect(response.notification)
    })

    return () => {
      isMounted = false
      subscription.remove()
    }
  }, [])
}
