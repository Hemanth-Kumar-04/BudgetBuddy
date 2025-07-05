
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="HomeScreen" options={{ title: 'Home' }} />
      <Stack.Screen name="MonthListScreen" options={{ title: 'Months' }} />
      <Stack.Screen name="MonthDetailScreen" options={{ title: 'Details' }} />
      <Stack.Screen name="AddExpenseScreen" options={{ title: 'Add Expense' }} />
    </Stack>
  );
}
