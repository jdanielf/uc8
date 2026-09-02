import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }

    Alert.alert('Cadastro realizado', 'Agora você pode entrar na sua agenda.', [
      { text: 'Ir para Login', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Criar conta</Text>
        <Text style={styles.subtitulo}>Cadastre-se para usar sua agenda.</Text>
        <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

        <Pressable style={styles.botaoPrincipal} onPress={cadastrar}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#eff6ff', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 4 },
  titulo: { color: '#1e3a8a', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subtitulo: { color: '#64748b', marginTop: 8, marginBottom: 26, textAlign: 'center' },
  input: { backgroundColor: '#f8fafc', borderColor: '#93c5fd', borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 12 },
  botaoPrincipal: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 8, marginTop: 4, padding: 13 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
});
