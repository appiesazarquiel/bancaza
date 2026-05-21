import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'BancAza' }} />
      <Stack.Screen name="detail" options={{ title: 'Detail' }} />
      <Stack.Screen name="qrScan" options={{ title: 'QR Libro' }} />
    </Stack>
  );
}
