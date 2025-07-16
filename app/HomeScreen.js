// app/HomeScreen.js

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AddExpenseModal from '../components/AddExpenseModal';
import CategoryCard from '../components/CategoryCard';
import ExpenseCard from '../components/ExpenseCard';
import MonthCard from '../components/MonthCard';
import {
  deleteExpense,
  filterByMonth,
  getAllExpenses,
} from '../store/asyncStorage';

export default function HomeScreen() {
  const router = useRouter(); // ensure router is defined
  const [all, setAll] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // reload whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getAllExpenses();
        setAll(data);
      })();
    }, [])
  );

  const current = new Date();
  const m = current.getMonth() + 1;
  const y = current.getFullYear();
  const monthExpenses = filterByMonth(all, m, y);
  const total = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // category breakdown
  const categories = [
    'Groceries', 'Entertainment', 'Healthcare', 'Education',
    'Shopping', 'Travel', 'Savings', 'Others',
  ].map(cat => {
    const amt = monthExpenses
      .filter(e => e.category === cat)
      .reduce((s, e) => s + Number(e.amount), 0);
    return {
      title: cat,
      amount: amt,
      percent: total ? Math.round((amt / total) * 100) : 0,
    };
  });

  // today's expenses
  const today = new Date();
  const todays = all.filter(e => {
    const d = new Date(e.date);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth()    === today.getMonth()    &&
      d.getDate()     === today.getDate()
    );
  });

  const handleDelete = async (dateIso) => {
    const updated = await deleteExpense(dateIso);
    setAll(updated);
  };

  // last 6 months data
  const monthsArr = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mon = d.getMonth() + 1;
    const yr = d.getFullYear();
    const arr = filterByMonth(all, mon, yr);
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      year: yr,
      total: arr.reduce((s, e) => s + Number(e.amount), 0),
      m: mon,
      y: yr,
    };
  });

  // reload data callback for modal close
  const reloadData = async () => {
    const data = await getAllExpenses();
    setAll(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.total}>Month Expense: ₹{total}</Text>

      <Text style={styles.section}>Last 6 Months</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
      >
        {monthsArr.map(x => (
          <MonthCard
            key={`${x.m}-${x.y}`}
            month={x.month}
            year={x.year}
            total={x.total}
            onPress={() =>
              // navigate using router
              router.push({
                pathname: '/MonthDetailScreen',
                params: { month: x.m, year: x.y },
              })
            }
          />
        ))}

        <TouchableOpacity
          style={styles.seeMore}
          onPress={() => router.push('/MonthListScreen')}
        >
          <Text>See More</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.section}>Category Breakdown</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
      >
        {categories.map((c, i) => (
          <CategoryCard key={i} {...c} />
        ))}
      </ScrollView>

      <Text style={styles.section}>Today's Spending</Text>
      <ScrollView style={styles.list}>
        {todays.map(e => (
          <ExpenseCard
            key={e.date}
            title={e.note || e.category}
            amount={e.amount}
            date={e.date}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          reloadData();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  total: { fontSize: 24, fontWeight: 'bold', marginVertical: 8, paddingBottom: 6 },
  row: { maxHeight: 100, marginBottom: 16 },
  seeMore: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ccc',
    justifyContent: 'center',
  },
  section: { fontSize: 18, fontWeight: '600', marginVertical: 8 },
  list: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 24 },
});
