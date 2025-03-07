import { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import User, { UserType } from '../types/User'
import { useRouter, useSegments } from 'expo-router'

interface AuthProps {
  authState: User | undefined
  onSignUp: (email: string, password: string, type: UserType) => Promise<any>
  onSignIn: (email: string, password: string) => Promise<any>
  onSignOut: () => Promise<any>
  onSetLanguages: (languages: string[]) => Promise<any>
}

const USER_KEY = 'stream-token'
export const API_URL = process.env.EXPO_PUBLIC_SERVER_URL
const AuthContext = createContext<AuthProps>({
  authState: undefined,
  onSignUp: async () => {},
  onSignIn: async () => {},
  onSignOut: async () => {},
  onSetLanguages: async () => {},
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<User | undefined>(undefined)
  const [initialized, setInitialized] = useState(false)

  // Load account data from storage
  useEffect(() => {
    const loadToken = async () => {
      const data = await SecureStore.getItemAsync(USER_KEY)
      if (data) {
        const object = JSON.parse(data)
        setAuthState({
          authenticated: true,
          id: object.user.id,
          email: object.user.email,
          type: object.user.type,
          languages: object.user.languages,
          jwtToken: object.jwtToken,
          streamToken: object.streamToken,
        })
      }
      setInitialized(true)
    }
    loadToken()
  }, [])

  // Redirect to login if not authenticated or to app if authenticated
  const segment = useSegments()[0]
  const router = useRouter()

  useEffect(() => {
    if (!initialized) return

    if (!!authState?.authenticated && authState?.languages.length === 0) {
      return
    }

    if (!!authState?.authenticated && segment === '(auth)') {
      router.replace(`/(app-${authState?.type === UserType.blind ? 'visually-impaired' : 'volunteer'})`)
    } else if (!authState?.authenticated && segment !== '(auth)') {
      router.replace('/(auth)/1-welcome')
    }
  }, [initialized, authState])

  const login = async (email: string, password: string) => {
    var json
    try {
      const result = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      json = await result.json()

      setAuthState({
        authenticated: true,
        id: json.user.id,
        email: json.user.email,
        type: json.user.type,
        languages: json.user.languages,
        jwtToken: json.jwtToken,
        streamToken: json.streamToken,
      })

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(json))

      return result
    } catch (e) {
      return { error: true, msg: json.error }
    }
  }

  const register = async (email: string, password: string, type: UserType) => {
    var json
    try {
      const result = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, type }),
      })

      json = await result.json()

      setAuthState({
        authenticated: true,
        id: json.user.id,
        email: json.user.email,
        type: json.user.type,
        languages: json.user.languages,
        jwtToken: json.jwtToken,
        streamToken: json.streamToken,
      })

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(json))

      return json
    } catch (e) {
      return { error: true, msg: json.error }
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(USER_KEY)

    setAuthState(undefined)
  }

  const setLanguages = async (languages: string[]) => {
    if (!authState) {
      return { error: true, msg: 'Not authenticated' }
    }

    const id = authState?.id
    const result = await fetch(`${API_URL}/api/user/setLanguages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState?.jwtToken}`,
      },
      body: JSON.stringify({ id, languages }),
    })

    const json = await result.json()

    if (json.error) {
      return { error: true, msg: json.error }
    }

    setAuthState((prevState) => {
      if (!prevState) return prevState
      return {
        ...prevState,
        languages,
      }
    })

    const storedUser = await SecureStore.getItemAsync(USER_KEY)
    let parsedUser = storedUser ? JSON.parse(storedUser) : {}
    parsedUser.languages = languages
    await SecureStore.setItemAsync(USER_KEY, parsedUser)

    return json
  }

  const value = {
    onSignUp: register,
    onSignIn: login,
    onSignOut: logout,
    onSetLanguages: setLanguages,
    authState,
    initialized,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
