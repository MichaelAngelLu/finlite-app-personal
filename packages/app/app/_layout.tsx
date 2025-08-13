// packages/app/app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native'; // Import loading spinner

const InitialLayout = () => {
  const { session } = useAuth(); // Get session state from AuthProvider
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization logic or replace with actual logic from AuthProvider if available
    setInitialized(true);
  }, []);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until the session is initialized AND the router is ready
    if (
      !initialized ||
      !Array.isArray(segments) ||
      [...segments].length === 0
    ) {
      return;
    }

    const inAppGroup = segments[0] === '(app)';

    if (session && !inAppGroup) {
      // User is signed in but not in the main app section, redirect to dashboard.
      router.replace('/dashboard');
    } else if (!session && inAppGroup) {
      // User is not signed in but is in the main app section, redirect to login.
      router.replace('/login');
    }
  }, [session, initialized, segments]);

  // If the session is still being initialized, show a loading spinner
  // This prevents the <Stack> from rendering too early.
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once initialized, render the main navigator
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}