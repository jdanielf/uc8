import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, StyleSheet,  Text,  TextInput,  View, } from 'react-native';

export default function Teste() {
  const [nome, setNome] = useState('Lopes');

useEffect(() => {
  console.log('Use Effect')
},[])


  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Olá, {nome}!</Text>

      <TextInput
        style={styles.caixa}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
        keyboardType="default"
      />

      <Text> {'\n'}</Text>
      <button>
        title='+'
        onPress={() => setNome(valor+ 1)}
      </button>
      <Button>
        title='-'
        onPress={() => setNome(valor- 1)}
      </Button>
      <Text> {'\n'} Volume: {valor}</Text>
      <Text></Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  texto: {
    fontSize: 22,
    marginBottom: 10,
  },
  caixa: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    width: 250,
  },
});


