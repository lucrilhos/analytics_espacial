import { Stack } from 'expo-router';
import { MissaoProvider } from '../context/MissaoContext';


export default function RootLayout() {
  return (
    <MissaoProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </MissaoProvider>
  );
}
