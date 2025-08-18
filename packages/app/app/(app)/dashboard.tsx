// packages/app/app/(app)/dashboard.tsx
import { useCallback, useState } from 'react'; // <-- Changed from useCallback
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

// packages/app/app/(app)/dashboard.tsx
// ...imports remain the same
import { Ionicons } from '@expo/vector-icons'; // optional icons

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

  // ----------------------
  // Bottom Nav Items
  // ----------------------
  const navItems = [
    { label: 'Home', icon: 'home-outline', route: '/dashboard' },
    { label: 'Transactions', icon: 'list-outline', route: '/transactions' },
    { label: 'Budget', icon: 'pie-chart-outline', route: '/budget' },
    { label: 'Scan', icon: 'camera-outline', route: '/scan' },
    { label: 'Rewards', icon: 'gift-outline', route: '/rewards' },
  ];

  // ----------------------
  // UI Renderers
  // ----------------------
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionCategory}>{item.category_id}</Text>
        <Text style={styles.transactionDate}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.transaction_date).toLocaleDateString()}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Your Financial Overview</Text>
      <Text style={styles.subHeader}>September 2023</Text>

      {/* Balance Summary */}
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

      {/* Budget Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Progress</Text>
        {/* TODO: Replace with pie chart */}
        <Text>Groceries: 75%</Text>
        <Text>Entertainment: 45%</Text>
        <Text>Transport: 60%</Text>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Insight</Text>
        <Text style={styles.insightText}>
          You’re on track! Your spending is 15% lower than last month. Keep it up!
        </Text>
        <Text style={styles.streak}>🔥 5 day streak • Budget Master</Text>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={transactions.slice(0, 5)} // show only top 5 recent
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No transactions yet. Add one!</Text>}
          />
        )}
      </View>

      {/* Add Transaction Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add_transaction')}
      >
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon as any} size={20} color="#333" />
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subHeader: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 16 },

  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
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
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#333' },
  streak: { fontSize: 12, color: '#666', marginTop: 4 },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 8,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, marginTop: 2, color: '#333' },
});
