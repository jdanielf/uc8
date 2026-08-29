import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import Login from './src/screens/Form.js';
import Cadastro from './src/screens/Cadastro.js';
import Casa from './src/screens/Casa.js';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Teste from './src/screens/Teste.js';
import { DateTimePickerAndroid} from '@react-native-community/datetimepicker';



export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Desenvolviment o Mobile!</Text> */}
      {/* <Login /> */}
      {/* <Cadastro /> */}
      {/* <Casa /> */}
      <Teste />
      {/* <Image
        source={{ uri: 'https://picsum.photos/200/200' }}
        style={styles.image}
      /> */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
