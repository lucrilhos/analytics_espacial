import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import BadgeAlerta from '../../components/BadgeAlerta';


export default function TabsLayout() {
  const { cores } = useMissao();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.tabBar,
          borderTopColor: cores.borda,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: cores.tabBarAtivo,
        tabBarInactiveTintColor: cores.tabBarInativo,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="Monitoramento Pluto"
        options={{
          title: 'Missão',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="rocket-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sensores"
        options={{
          title: 'Sensores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="energia"
        options={{
          title: 'Energia',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="battery-charging-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="comunicacao"
        options={{
          title: 'Sinal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <BadgeAlerta>
              <Ionicons name="warning-outline" size={size} color={color} />
            </BadgeAlerta>
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
