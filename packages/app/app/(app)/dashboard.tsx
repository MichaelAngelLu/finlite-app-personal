// packages/app/app/(app)/dashboard.tsx
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@finlite/core';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

type Transaction = {
  id: string;
  amount: number;
  description: string | null;
  category_id: string;
  transaction_date: string;
  type: 'income' | 'expense';
};

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
} as const;

export default function DashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        if (!session) return;

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
    }, [session])
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionCategory}>{item.category_id}</Text>
        <Text style={styles.transactionDate}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.transaction_date).toLocaleDateString('en-US', dateOptions)}
        </Text>
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

  const ListHeader = () => (
    <>
      <Text style={styles.header}>Your Financial Overview</Text>
      <Text style={styles.subHeader}>{new Date().toLocaleDateString('en-US', dateOptions)}</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>₱241,429.15</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceBox}>
            <Text style={styles.smallLabel}>Income</Text>
            <Text style={styles.smallValue}>₱183,082.25</Text>
          </View>
          <View style={styles.balanceBox}>
            <Text style={styles.smallLabel}>Expenses</Text>
            <Text style={styles.smallValue}>₱105,624.37</Text>
          </View>
          <View style={styles.balanceBox}>
            <Text style={styles.smallLabel}>Savings</Text>
            <Text style={styles.smallValue}>₱77,457.87</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Progress</Text>
        <Text>Groceries: 75%</Text>
        <Text>Entertainment: 45%</Text>
        <Text>Transport: 60%</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Insight</Text>
        <Text style={styles.insightText}>
          You’re on track! Your spending is 15% lower than last month. Keep it up!
        </Text>
        <Text style={styles.streak}>🔥 5 day streak • Budget Master</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add_transaction')}
            >
              <Text style={styles.addButtonText}>+ Add Transaction</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <>
              <ListHeader />
              <Text style={{ textAlign: 'center', marginTop: 20, paddingBottom: 20 }}>
                No transactions yet. Add one!
              </Text>
            </>
          }
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subHeader: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 16 },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: { fontSize: 14, color: '#555' },
  balanceValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceBox: { alignItems: 'center', flex: 1 },
  smallLabel: { fontSize: 12, color: '#777' },
  smallValue: { fontSize: 14, fontWeight: 'bold' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#333' },
  streak: { fontSize: 12, color: '#666', marginTop: 4 },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  transactionCategory: { fontSize: 14, fontWeight: 'bold' },
  transactionDate: { fontSize: 12, color: '#666' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#194F03',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8, // Add margin top to separate from list
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});