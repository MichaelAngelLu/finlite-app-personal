// packages/app/app/login.tsx
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '@finlite/core';
import { useRouter } from 'expo-router'; // <-- 1. Import the useRouter hook

export default function LoginScreen() {
  const router = useRouter(); // <-- 2. Initialize the router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success!', 'You are now logged in.');
      router.replace('/dashboard'); // <-- 3. Navigate to the dashboard on success
    }
    setLoading(false);
  }

  return (
    <View>
      <View style={styles.container1}>
        <Text style={styles.header}>FinLite</Text>
        <Text style={styles.header2}>Welcome</Text>
        <Text style={styles.subtext}>Simplify your finances with FinLite</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.header2}>Log In</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={{ marginBottom: 16 }}>
          <Button
            title={loading ? 'Logging In...' : 'Log In'}
            onPress={signInWithEmail}
            disabled={loading}
            color={'#194F03'} // Your primary color
          />
        </View>

        {/* 3. Replace the <Link> with a secondary <Button> */}
        <Button
          title="Create An Account"
          onPress={() => router.push('/signup')} // Use router.push for navigation
          color={'#808080'} // A neutral secondary color
        />
      </View>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container1: {
    flex: 0,
    justifyContent: 'center',
    paddingTop: 16,
    marginTop: 16,
  },
  container2: {
    flex: 0,
    justifyContent: 'center',
    padding: 30,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    margin: 16,
  },
  // ... other styles
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 24,
    textAlign: 'center',
  },
  header2: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});