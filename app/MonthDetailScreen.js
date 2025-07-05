// app/MonthDetailScreen.js

import React, { useState, useCallback } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import {
  getAllExpenses,
  filterByMonth,
  deleteExpense,
} from '../store/asyncStorage';
import CategoryCard from '../components/CategoryCard';
import ExpenseCard from '../components/ExpenseCard';

export default function MonthDetailScreen() {
  // grab params from URL
  const params = useLocalSearchParams();
  const month = Number(params.month);
  const year = Number(params.year);

  const [data, setData] = useState([]);

  // reload when focused
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await getAllExpenses();
        setData(all);
      })();
    }, [])
  );

  // filter for this month
  const me = filterByMonth(data, month, year);
  const total = me.reduce((sum, e) => sum + Number(e.amount), 0);

  // build category breakdown
  const categories = [
    'Groceries','Entertainment','Healthcare','Education',
    'Shopping','Travel','Savings','Others',
  ].map(cat => {
    const amt = me
      .filter(e => e.category === cat)
      .reduce((s, e) => s + Number(e.amount), 0);
    return {
      title: cat,
      amount: amt,
      percent: total ? Math.round((amt / total) * 100) : 0,
    };
  });

  const handleDelete = async (dateIso) => {
    const updated = await deleteExpense(dateIso);
    setData(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Category Breakdown</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
      >
        {categories.map((c, i) => (
          <CategoryCard key={i} {...c} />
        ))}
      </ScrollView>

      <Text style={styles.header}>Total: ₹{total}</Text>

      {me.map(e => (
        <ExpenseCard
          key={e.date}
          title={e.note || e.category}
          amount={e.amount}
          date={e.date}
          onDelete={handleDelete}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  header: { fontSize: 18, fontWeight: '600', marginVertical: 8 },
  row: { maxHeight: 100, marginBottom: 16 },
});
