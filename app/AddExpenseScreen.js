import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { saveExpense } from '../store/asyncStorage';

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [category, setCategory] = useState('Groceries');
  const [note, setNote] = useState('');

  const handleAmountChange = (text) => {
    let numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length > 2) {
      numericText = parts[0] + '.' + parts.slice(1).join('');
    }
    setAmount(numericText);
  };

  const submit = async () => {
    if (!amount) return;
    await saveExpense({
      amount,
      date: date.toISOString(),
      category,
      note
    });
    navigation.goBack();
  };

  const onConfirmDate = (selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0.00"
        value={amount}
        onChangeText={handleAmountChange}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.input}
      >
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        date={date}
        onConfirm={onConfirmDate}
        onCancel={() => setShowPicker(false)}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
        >
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Entertainment" value="Entertainment" />
          <Picker.Item label="Healthcare" value="Healthcare" />
          <Picker.Item label="Education" value="Education" />
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Travel" value="Travel" />
          <Picker.Item label="Savings" value="Savings" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      <Text style={styles.label}>Title/Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Title or Note"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
