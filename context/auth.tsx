import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import User from '@/types/User';
import { useRouter, useSegments } from 'expo-router';

interface AuthProps {
  authState: User | undefined;
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
  initialized: boolean;
}

const USER_KEY = 'stream-token';
export const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const AuthContext = createContext<AuthProps>({
    authState: undefined,
    onRegister: async () => {},
    onLogin: async () => {},
    onLogout: async () => {},
    initialized: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<User | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);

  // Load account data from storage
  useEffect(() => {
    const loadToken = async () => {
      const data = await SecureStore.getItemAsync(USER_KEY);
      if (data) {
        const object = JSON.parse(data);
        setAuthState({
          authenticated: true,
          id: object.user.id,
          email: object.user.email,
          jwtToken: object.jwtToken,
          streamToken: object.streamToken,
        });
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  // Redirect to login if not authenticated or to app if authenticated
  const segment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (!!authState?.authenticated && segment === '(auth)') {
        router.replace('/(app)');
    } else if (!authState?.authenticated && segment !== '(auth)') {
        router.replace('/(auth)/welcome');
    }
  }, [initialized, authState]);

  const login = async (email: string, password: string) => {
    try {
      const result = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await result.json();

      setAuthState({
        authenticated: true,
        id: json.user.id,
        email: json.user.email,
        jwtToken: json.jwtToken,
        streamToken: json.streamToken,
      });

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(json));

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await result.json();
      console.log('register:', json);

      setAuthState({
        authenticated: true,
        id: json.user.id,
        email: json.user.email,
        jwtToken: json.jwtToken,
        streamToken: json.streamToken,
      });

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(json));

      return json;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(USER_KEY);

    setAuthState(undefined);
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    initialized,
  };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)
};