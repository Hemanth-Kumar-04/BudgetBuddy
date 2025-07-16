// app/MonthListScreen.js

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { filterByMonth, getAllExpenses } from '../store/asyncStorage';

export default function MonthListScreen() {
  const router = useRouter();
  const [months, setMonths] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await getAllExpenses();
      const uniq = {};
      all.forEach(e => {
        const d = new Date(e.date);
        const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
        uniq[key] = true;
      });
      const arr = Object.keys(uniq).map(k => {
        const [m, y] = k.split('-').map(Number);
        const slice = filterByMonth(all, m, y);
        return {
          month: new Date(y, m - 1).toLocaleString('default', { month: 'long' }),
          year: y,
          total: slice.reduce((s, e) => s + Number(e.amount), 0),
          m, y,
        };
      });
      setMonths(arr);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={months}
        keyExtractor={i => `${i.m}-${i.y}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/MonthDetailScreen',
                params: { month: item.m, year: item.y },
              })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.monthText}>
                {item.month} {item.year}
              </Text>
              <Text style={styles.amountText}>₹{item.total}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    borderWidth: 0.3,
    elevation: 1,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
