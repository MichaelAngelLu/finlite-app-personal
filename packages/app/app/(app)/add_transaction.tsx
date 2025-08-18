// packages/app/app/(app)/add_transaction.tsx
import { useState } from 'react';
import { Alert, Button, Platform, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { supabase } from '@finlite/core';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTransactionScreen() {
  const router = useRouter();
  // New state variables
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, the picker stays open
    setDate(currentDate);
  };

  async function handleAddTransaction() {
    if (!amount || !category) {
      Alert.alert('Error', 'Amount and Category are required.');
      return;
    }

    setLoading(true);
    try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found. Please log in again.");

    const { error } = await supabase.from('transactions').insert([
      {
          amount: parseFloat(amount),
          category_id: category,
          description: description,
          id: "0000-0004", // Placeholder ID, replace with actual logic if needed
          receipt_id: null, // Assuming no receipt for now
          transaction_date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          type: transactionType,
          user_id: user.id,
          created_at: new Date().toISOString().split('T')[0], // Use current date for created_at
          update_at: new Date().toISOString().split('T')[0], // Use current date for update_at
        },
      ]);

      if (error) {
        Alert.alert('Error', error.message);
      } 
        Alert.alert('Success', 'Transaction added!');
        router.back();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
        // This block will run no matter what, ensuring the loading state is always reset
        setLoading(false);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Transaction</Text>

      {/* Transaction Type Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.typeText}>Expense</Text>
        <Switch
          trackColor={{ false: '#f44336', true: '#4CAF50' }}
          thumbColor={'#f4f3f4'}
          onValueChange={() => setTransactionType(prev => prev === 'expense' ? 'income' : 'expense')}
          value={transactionType === 'income'}
        />
        <Text style={styles.typeText}>Income</Text>
      </View>

      {/* Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      
      {/* Category Input */}
      <TextInput
        style={styles.input}
        placeholder="Category (e.g., Food, Transport)"
        value={category}
        onChangeText={setCategory}
      />
      
      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
      />

      {/* Date Picker Input */}
      <Pressable onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date.toLocaleDateString()}
          editable={false} // Prevents keyboard from opening
        />
      </Pressable>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}

      <Button
        title={loading ? 'Adding...' : 'Add Transaction'}
        onPress={handleAddTransaction}
        disabled={loading}
        color={'#194F03'}
      />
    </View>
  );
}

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeText: {
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: '500',
  },
});