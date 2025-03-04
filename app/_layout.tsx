import { AuthProvider } from '../context/auth';
import { Slot } from 'expo-router';

// SplashScreen.preventAutoHideAsync();

const Layout = () => {
  
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  )
}

export default Layout;