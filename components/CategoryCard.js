import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CATEGORY_COLORS = {
  Groceries:    '#c8e6c9',  // light green
  Entertainment:'#f8bbd0',  // pink
  Healthcare:   '#bbdefb',  // light blue
  Education:    '#fff9c4',  // light yellow
  Shopping:     '#d1c4e9',  // lavender
  Travel:       '#b2dfdb',  // teal
  Savings:      '#ffe0b2',  // peach
  Others:       '#f0f4c3',  // lime
};

export default function CategoryCard({ title, percent, amount }) {
  const bgColor = CATEGORY_COLORS[title] || '#e0e0e0';

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.title}> {title}</Text>
      <Text style={styles.percent}>{percent}%</Text>
      <Text style={styles.amount}>₹{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth:150,
    elevation: 1,
    borderWidth: 0.07,
    alignContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  title: { 
    fontWeight: '500',
    fontSize: 17,
  },
    percent: { 
    fontWeight: '600',
    fontSize: 16,

  },
  amount: { 
    fontSize:14,
    marginTop: 4,
    fontWeight: '500',
  },
});
