import { Stack } from 'expo-router';
import { MissaoProvider, useMissao } from '../context/MissaoContext';
import { View, ActivityIndicator } from 'react-native';

function AppCarregando() {
  const { carregando } = useMissao();
  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0e1a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <MissaoProvider>
      <AppCarregando />
    </MissaoProvider>
  );
}