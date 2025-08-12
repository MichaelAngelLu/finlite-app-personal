// packages/app/app/index.tsx
import { Text, View } from 'react-native';
import { Link } from 'expo-router'; // <-- Import Link

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>FinLite App</Text>
      <Link href="/login" style={{ marginTop: 16, color: 'blue' }}>
        Go to Log In
      </Link>
    </View>
  );
}