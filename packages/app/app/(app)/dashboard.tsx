// packages/app/app/(app)/dashboard.tsx
import { useCallback, useState } from 'react'; // <-- Changed from useCallback
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@finlite/core';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

type NewType = {
  id: string;
  amount: number;
  description: string | null;
  category_id: string;
  transaction_date: string;
  type: 'income' | 'expense';
};

type Transaction = NewType;

export default function DashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

 useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        if (!session) {
          console.log("No session found, skipping fetch.");
          return;
        }

        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('transaction_date', { ascending: false });

          if (error) throw error;

          setTransactions(data || []);
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert('Error', 'Failed to fetch transactions: ' + error.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchTransactions();
    }, [session]) // The function will re-run if the session changes while on the screen
  ); // Dependency array ensures it runs when the session is available

  const fetchTransactions = async () => {
    if (!session) {
      console.log("No session found, skipping fetch.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching transactions for user:", session.user.id);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('transaction_date', { ascending: false });

      console.log('Supabase data:', data);
      console.log('Supabase error:', error);

      if (error) throw error;

      console.log("Fetched data:", data);

      setTransactions(data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching transactions:", error.message);
        Alert.alert('Error', 'Failed to fetch transactions: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  // ---------------------------------

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionCategory}>{item.category_id}</Text>
        <Text style={styles.transactionDate}>{item.description}</Text>
        <Text style={styles.transactionDate}>{new Date(item.transaction_date).toLocaleDateString()}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? '#2ecc71' : '#e74c3c' },
        ]}
      >
        {item.type === 'income' ? '+' : '-'}₱{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={{ marginBottom: 16 }}>
        <Button
          title="Add New Transaction"
          onPress={() => router.push('/add_transaction')}
          color={'#194F03'}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet. Add one!</Text>}
          style={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Button title="Log Out" onPress={handleLogout} color="#c0392b" />
      </View>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  footer: {
    paddingTop: 10,
    marginBottom: 50, // Adjusted for better spacing
  },
});