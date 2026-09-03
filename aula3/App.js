import { StatusBar } from 'expo-status-bar';
import Compromissos from './src/screens/Compromissos';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Menu from './src/screens/Menu';
import Configuracoes from './src/screens/Configuracoes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// import { createDrawerNavigator } from '@react-navigation/drawer';




// Comentado: @react-navigation/bottom-tabs ainda não foi instalado.
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// const TabNavigator = (route) => {
//   return(
//     <Tab.Navigator>
//       <Tab.Screen name="" component={Compromissos} />
//     </Tab.Navigator>

//   )
// };

/*
  A navegação abaixo foi mantida como comentário porque impedia o app de iniciar:
  - SafeAreaProvider não foi importado nem instalado;
  - @react-navigation/native-stack não está nas dependências;
  - appNavigation com letra minúscula é interpretado como elemento nativo.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#2563eb',
        tabBarIcon: ({ color, size }) => {
          const icones = {
            'Início': 'home',
            Compromissos: 'list',
            'Configurações': 'settings',
          };

          return <Ionicons name={icones[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={Menu} />
      <Tab.Screen name="Compromissos" component={Compromissos} />
      <Tab.Screen name="Configurações" component={Configuracoes} />
    </Tab.Navigator>
  );
}

const AppNavigation = () => (
  <Stack.Navigator initialRouteName="Compromissos">
    <Stack.Screen name="Compromissos" component={Compromissos} />
  </Stack.Navigator>
);
*/

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();


//  const DrawerNavigator = ({route}) => {
//   return(
//     <Drawer.Navigator>
//       <Drawer.Screen name="Menu" component={Menu} />
//       <Drawer.Screen name="Compromissos" component={Compromissos} />
//       <Drawer.Screen name="Configurações" component={Configuracoes} />
//     </Drawer.Navigator>
//   )
//  };

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#2563eb',
        tabBarIcon: ({ color, size }) => {
          const icones = {
            'Início': 'home',
            Compromissos: 'list',
            'Configurações': 'settings',
          };

          return <Ionicons name={icones[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={Menu} />
      <Tab.Screen name="Compromissos" component={Compromissos} />
      <Tab.Screen name="Configurações" component={Configuracoes} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Criar conta' }} />
          <Stack.Screen name="Menu" component={TabNavigator} options={{ headerShown: false }} />
          {/* A tela Compromissos agora fica dentro do TabNavigator. */}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />

      {/*
        Quando as dependências da navegação forem configuradas, substitua
        <Compromissos /> por <NavigationContainer><AppNavigation /></NavigationContainer>.
      */}
    </SafeAreaProvider>
  );
}
