import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { saveExpense } from '../store/asyncStorage';

export default function AddExpenseModal({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [category, setCategory] = useState('Groceries');
  const [note, setNote] = useState('');

  const categories = [
    'Groceries',
    'Entertainment',
    'Healthcare',
    'Education',
    'Shopping',
    'Travel',
    'Savings',
    'Others',
  ];

  const handleAmountChange = (text) => {
    let numeric = text.replace(/[^0-9.]/g, '');
    const parts = numeric.split('.');
    if (parts.length > 2) numeric = parts[0] + '.' + parts.slice(1).join('');
    setAmount(numeric);
  };

  const formatDate = (d) => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const submit = async () => {
    if (!amount) return;
    await saveExpense({ amount, date: date.toISOString(), category, note });
    setAmount('');
    setNote('');
    setCategory('Groceries');
    setDate(new Date());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            value={amount}
            onChangeText={handleAmountChange}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
            <Text>{formatDate(date)}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            date={date}
            onConfirm={(d) => {
              setShowPicker(false);
              setDate(d);
            }}
            onCancel={() => setShowPicker(false)}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={
                  category === cat
                    ? [styles.categoryButton, styles.categoryButtonSelected]
                    : styles.categoryButton
                }
              >
                <Text
                  style={
                    category === cat
                      ? [styles.categoryText, styles.categoryTextSelected]
                      : styles.categoryText
                  }
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Title/Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Title or Note"
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={submit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  label: { fontSize: 16, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    backgroundColor: 'white',
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: { fontSize: 14, color: '#333' },
  categoryTextSelected: { color: 'white' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
