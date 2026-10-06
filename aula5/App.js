import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import usePets, { PetProvider } from './src/context/PetContext';
import { Login, Pets, PetDetalhes, Clinica, Conta } from './src/screens/Telas';
import { cores } from './src/components/UI';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function Abas() {
  const { usuario } = usePets();
  const icones = { Pets: 'paw-outline', Clínica: 'medkit-outline', Conta: 'person-outline' };
  return <Tab.Navigator screenOptions={({ route }) => ({ headerTitleAlign: 'center', tabBarActiveTintColor: cores.verde, tabBarIcon: ({ color, size }) => <Ionicons name={icones[route.name]} color={color} size={size} /> })}>
    <Tab.Screen name="Pets" component={Pets} options={{ title: 'Meus pets' }} />
    {usuario.papel === 'clinica' && <Tab.Screen name="Clínica" component={Clinica} options={{ title: 'Cadastro' }} />}
    <Tab.Screen name="Conta" component={Conta} />
  </Tab.Navigator>;
}
function Navegacao() {
  const { usuario, carregando, erro } = usePets();
  if (carregando) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={cores.verde} /><Text>Carregando os pets…</Text></View>;
  return <><StatusBar style="dark" />{erro ? <Text accessibilityRole="alert" style={{ padding: 15, backgroundColor: '#FFF1D6' }}>{erro}</Text> : null}<NavigationContainer><Stack.Navigator screenOptions={{ headerTintColor: cores.verde, headerTitleAlign: 'center' }}>
    {usuario ? <><Stack.Screen name="Inicio" component={Abas} options={{ headerShown: false }} /><Stack.Screen name="Pet" component={PetDetalhes} options={{ title: 'Acompanhamento' }} /></> : <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />}
  </Stack.Navigator></NavigationContainer></>;
}
export default function App() { return <SafeAreaProvider><PetProvider><Navegacao /></PetProvider></SafeAreaProvider>; }
