import { View, TextInput, Button, Text, StyleSheet} from 'react-native'

export default function Formulario() {
  return (
    <View style={styles.container }>
          
    <Text style={styles.texto}>Nome:</Text>
    <TextInput
    style={styles.input}
     placeholder='Digite seu nome'
     placeholderTextColor='gray'
    keyboardType='default'
    />

    <Text style={styles.texto}>Senha:</Text>
    <TextInput
    style={styles.input}
     placeholder='Digite sua senha'
     placeholderTextColor='gray'
     secureTextEntry={true}
    />

    <Button 
    title='Enviar'
    onPress={() =>alert('Enviado com sucesso!')}
    />
     </View>
  )
}


const styles = StyleSheet.create({
  texto: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  input:{
    borderWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  Button:{
    backgroundColor: 'blue',
    color: 'white', 
}
});