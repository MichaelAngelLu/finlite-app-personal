// packages/app/app/signup.tsx
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '@finlite/core';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);
    if (!session) Alert.alert('Success!', 'Please check your email for a confirmation link.');
    setLoading(false);
  }

  return (
    <View>
      <View style={styles.container1}>
        <Text style={styles.header}>FinLite</Text>
        <Text style={styles.header2}>Create Account</Text>
        <Text style={styles.subtext}>Start your financial journey today</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.header2}>Sign Up</Text>
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
            title={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={signUpWithEmail}
            disabled={loading}
            color={'#194F03'}
          />
        </View>
        <Link href="/login" style={{ textAlign: 'center', color: 'blue' }}>
          Already have an account? Log In
        </Link>
      </View>
    </View>
  );
}

// Re-using the same styles from your login page for consistency
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
  outer_container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
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