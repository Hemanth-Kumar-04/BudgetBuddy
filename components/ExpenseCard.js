
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExpenseCard({ title, amount, date, onDelete }) {
  return (
    <View style={styles.card}>
      {onDelete && (
        <TouchableOpacity 
          onPress={() => onDelete(date)} 
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.main}>{title}</Text>
        <Text style={styles.text}>₹{amount}</Text>
      <Text style={styles.sub}>{new Date(date).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth:0.3,
    marginBottom: 8,
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  deleteText: {
    fontSize: 14,
    color: '#a00',
  },
  main: { fontWeight: '700', fontSize:16},
   text: { fontWeight: '500' },
  sub: { marginTop: 4, color: '#555' },
});
