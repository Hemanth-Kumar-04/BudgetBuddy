import AsyncStorage from '@react-native-async-storage/async-storage';

const EXP_KEY = 'expenses';

export async function getAllExpenses() {
  const json = await AsyncStorage.getItem(EXP_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveExpense(item) {
  const all = await getAllExpenses();
  all.push(item);
  await AsyncStorage.setItem(EXP_KEY, JSON.stringify(all));
}

export function filterByMonth(expenses, month, year) {
  return expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
}

export async function deleteExpense(dateIsoString) {
  const all = await getAllExpenses();
  const filtered = all.filter(e => e.date !== dateIsoString);
  await AsyncStorage.setItem(EXP_KEY, JSON.stringify(filtered));
  return filtered;
}
