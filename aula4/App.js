import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Menu from './src/screens/Menu';
import Carrinho from './src/screens/Carrinho';
import Confirmacao from './src/screens/Confirmacao';
import Configuracoes from './src/screens/Configuracoes';
import { CarrinhoProvider, useCarrinho } from './src/context/CarrinhoContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const icones = { 'Cardápio': 'restaurant-outline', Carrinho: 'cart-outline', 'Configurações': 'settings-outline' };

function Abas() {
  const { itens } = useCarrinho();
  const quantidade = itens.reduce((total, item) => total + item.quantidade, 0);
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerTitleAlign: 'center', tabBarActiveTintColor: '#b44221',
      tabBarIcon: ({ color, size }) => <Ionicons name={icones[route.name]} color={color} size={size} />,
    })}>
      <Tab.Screen name="Cardápio" component={Menu} />
      <Tab.Screen name="Carrinho" component={Carrinho} options={{ tabBarBadge: quantidade || undefined }} />
      <Tab.Screen name="Configurações" component={Configuracoes} />
    </Tab.Navigator>
  );
}

function Navegacao() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={Abas} options={{ headerShown: false }} />
        <Stack.Screen name="Confirmacao" component={Confirmacao} options={{ title: 'Confirmar pedido' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CarrinhoProvider><Navegacao /></CarrinhoProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
