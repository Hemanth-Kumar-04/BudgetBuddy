// app/_layout.js or app/RootLayout.js
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen"
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="MonthListScreen"
        options={{ title: 'Months' }}
      />
      <Stack.Screen
        name="MonthDetailScreen"
        options={({ route }) => {
          const { month, year } = route.params;
          const monthName = new Date(year, month - 1)
            .toLocaleString('default', { month: 'long' });
          return { title: `${monthName} ${year}` };
        }}
      />
    </Stack>
  );
}
