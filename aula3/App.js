import { StatusBar } from 'expo-status-bar';
import Compromissos from './src/screens/Compromissos';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';

const Stack = createNativeStackNavigator();

const appNavigation = () => {
  return (
    
      <Stack.Navigator initialRouteName="Compromissos">
        <Stack.Screen name="Compromissos" component={Compromissos} />
      </Stack.Navigator>
    
  );
};

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Compromissos />
      <StatusBar style="auto" />
    
    <NavigationContainer>
      <appNavigation />
      </NavigationContainer>
    

</SafeAreaProvider >


  );
}
