// packages/app/app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const InitialLayout = () => {
  const { session } = useAuth(); // Get session state from AuthProvider
  const [initialized, setInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || !Array.isArray(segments) || [...segments].length === 0) {
      return;
    }

    const inAppGroup = segments[0] === "(app)";

    if (session && !inAppGroup) {
      // User is signed in but not in the app group → go to dashboard
      router.replace("/(app)/dashboard");
    } else if (!session && inAppGroup) {
      // User not signed in but inside app → go to login
      router.replace("/login");
    }
  }, [session, initialized, segments]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If not authenticated yet, show Stack (login/signup flows).
  // Once inside (app), that folder will define its own Tabs.
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
