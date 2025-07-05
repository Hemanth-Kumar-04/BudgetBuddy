import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MonthCard({ month, year, total, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.label}>{month} {year}</Text>
      <Text style={styles.amount}>₹{total}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation:1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 0.3,
    minWidth:110,
    alignItems: 'center',
  },
  label: { fontWeight: '600',fontSize:16.5 },
  amount: { marginTop: 4, fontSize: 18 },
});
