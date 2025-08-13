// packages/app/app/(app)/dashboard.tsx
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@finlite/core';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  async function handleLogout() {
    // ... (logout logic remains the same)
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Your Dashboard!</Text>
      
      {/* ADD THIS BUTTON */}
      <View style={{ marginBottom: 16 }}>
        <Button
          title="Add New Transaction"
          onPress={() => router.push('/add_transaction')}
          color={'#194F03'}
        />
      </View>

      <Button title="Log Out" onPress={handleLogout} color="#c0392b" />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (styles remain the same)
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});