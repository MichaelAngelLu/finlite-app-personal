// packages/app/app/(auth)/login.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '@finlite/core';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Google Auth Logic ---
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '158283164371-s3150n27j8l9fnklaphusgh4i7ubpkk7.apps.googleusercontent.com',
    androidClientId: '158283164371-ofmnchcscscmhb27nc4srs9tt1ub8659.apps.googleusercontent.com',
    // iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: 'finlite', // 👈 must match app.json
      path: 'auth/callback',
      preferLocalhost: false,
    }),
  });
  

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: id_token,
        });

        if (error) {
          Alert.alert('Google Sign-In Error', error.message);
        } else {
          router.replace('/'); // 👈 redirect after login
        }
      }
    };

    signInWithGoogle();
  }, [response]);
  // --- END Google Auth Logic ---

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert('Error', error.message);
    else router.replace('/');
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
            color={'#194F03'}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Button
            title="Sign In with Google"
            onPress={() => promptAsync()}
            disabled={!request}
            color="#4285F4"
          />
        </View>

        <Button
          title="Create An Account"
          onPress={() => router.push('/signup')}
          color={'#808080'}
        />
      </View>
    </View>
  );
}

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
    marginBottom: 10,
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
