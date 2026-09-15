import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Menu from './src/screens/Menu';
import Compromissos from './src/screens/Compromissos';
import Contato from './src/screens/Configuracoes';
import Confirmacao from './src/screens/Confirmacao';
import { AgendamentosProvider } from './src/context/AgendamentosContext';
import { AuthProvider } from './src/context/AuthContext';
import { abrirBd, criarTabelaUsuarios } from './src/database/databse';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const icones = { 'Página Inicial': 'home', Agendamentos: 'calendar', Contato: 'call' };
  return (
    <Tab.Navigator screenOptions={({ route }) => ({ headerTitleAlign: 'center', tabBarActiveTintColor: '#0f766e', tabBarIcon: ({ color, size }) => <Ionicons name={icones[route.name]} size={size} color={color} /> })}>
      <Tab.Screen name="Página Inicial" component={Menu} />
      <Tab.Screen name="Agendamentos" component={Compromissos} />
      <Tab.Screen name="Contato" component={Contato} />
    </Tab.Navigator>
  );
}

export default function App() {




  useEffect( () => {
   
    criarTabelaUsuarios()
  }, [])

  return (
    <SafeAreaProvider><AgendamentosProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Criar conta' }} />
            <Stack.Screen name="Menu" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Confirmacao" component={Confirmacao} options={{ title: 'Confirmar consulta' }} />
      </Stack.Navigator>
    </NavigationContainer>
     </AuthProvider>
    <StatusBar style="dark" /></AgendamentosProvider></SafeAreaProvider>
  );
}
