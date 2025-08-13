// packages/app/app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { useEffect } from 'react';

const InitialLayout = () => {
  const { session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if the router is ready
    if (!segments[0]) {
      return;
    }

    const inAppGroup = segments[0] === '(app)';

    if (session && !inAppGroup) {
      // Redirect authenticated users to the main app (dashboard)
      router.replace('/dashboard');
    } else if (!session && inAppGroup) {
      // Redirect unauthenticated users to the login screen
      router.replace('/login');
    }
  }, [session, segments]); // <-- Add 'segments' to the dependency array

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}