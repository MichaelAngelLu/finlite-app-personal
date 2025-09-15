// packages/app/app/(app)/transactions.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@finlite/core";

type Transaction = {
  id: string;
  amount: number;
  description: string | null;
  category_id: string;
  transaction_date: string;
  type: "income" | "expense";
};

const groupByDate = (transactions: Transaction[]) =>
  transactions.reduce((groups: { [k: string]: Transaction[] }, tx) => {
    if (!groups[tx.transaction_date]) groups[tx.transaction_date] = [];
    groups[tx.transaction_date].push(tx);
    return groups;
  }, {});

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
    } else {
      const mapped: Transaction[] = data.map((tx: any) => ({
        id: tx.id,
        amount: tx.amount,
        description: tx.description,
        category_id: tx.category_id,
        transaction_date: tx.transaction_date.split("T")[0],
        type: tx.type,
      }));
      setTransactions(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();

    // Subscribe to all changes on the transactions table
    const channel = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          // Re-fetch whenever a row is inserted/updated/deleted
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = transactions.filter((tx) => {
    if (filter === "Income") return tx.type === "income";
    if (filter === "Expense") return tx.type === "expense";
    return true;
  });

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Transactions</Text>

      {/* Filter Buttons */}
      <View style={styles.filters}>
        {["All", "Income", "Expense"].map((label) => (
          <TouchableOpacity
            key={label}
            style={[styles.filterBtn, filter === label && styles.filterActive]}
            onPress={() => setFilter(label as "All" | "Income" | "Expense")}
          >
            <Text
              style={[
                styles.filterText,
                filter === label && styles.filterActiveText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={sortedDates}
          keyExtractor={(date) => date}
          renderItem={({ item: date }) => (
            <View style={styles.section}>
              <Text style={styles.dateLabel}>{formatDate(date)}</Text>
              {grouped[date].map((tx) => (
                <View key={tx.id} style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{tx.description || "—"}</Text>
                    <Text style={styles.subtitle}>Category: {tx.category_id}</Text>
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      tx.type === "income" ? styles.income : styles.expense,
                    ]}
                  >
                    {tx.type === "income"
                      ? `+₱${tx.amount.toFixed(2)}`
                      : `-₱${tx.amount.toFixed(2)}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function formatDate(date: string) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: { fontSize: 22, fontWeight: "700", marginVertical: 12 },
  filters: { flexDirection: "row", marginBottom: 12 },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterText: { fontSize: 14, fontWeight: "500" },
  filterActive: { backgroundColor: "#333", borderColor: "#333" },
  filterActiveText: { color: "#fff" },
  section: { marginBottom: 20 },
  dateLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { fontSize: 13, color: "#666" },
  amount: { fontSize: 15, fontWeight: "700" },
  income: { color: "green" },
  expense: { color: "red" },
});
