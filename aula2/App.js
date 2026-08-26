import { StatusBar } from 'expo-status-bar';
// import {Card} from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import  Login from './src/components/Form.js';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Desenvolvimento Mobile!</Text>

      
      <Login></Login>
      

      

      <StatusBar style="auto" />

     <Image 
     
     source= {{uri: 'https://share.google/ow5GyxiwfC8p5ie5I'}}

     />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
