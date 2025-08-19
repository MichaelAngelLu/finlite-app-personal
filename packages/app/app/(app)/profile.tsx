// packages/app/app/(app)/profile.tsx
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { supabase } from '@finlite/core';
import { useRouter } from 'expo-router';



export default function ProfileScreen() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Page</Text>
        <TouchableOpacity
            style={styles.addButton}
            onPress={handleLogout}
                    >
            <Text style={styles.addButtonText}>Log Out</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
  addButton: {
    backgroundColor: '#c80000ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8, // Add margin top to separate from list
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
