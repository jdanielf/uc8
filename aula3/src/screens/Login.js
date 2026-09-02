import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function entrar() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha para continuar.');
      return;
    }

    navigation.replace('Menu');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Minha Agenda</Text>
        <Text style={styles.subtitulo}>Entre para organizar seus compromissos.</Text>
        <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

        <Pressable style={styles.botaoPrincipal} onPress={entrar}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>Ainda não tem conta? Cadastre-se</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#eff6ff', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 4 },
  titulo: { color: '#1e3a8a', fontSize: 30, fontWeight: 'bold', textAlign: 'center' },
  subtitulo: { color: '#64748b', marginTop: 8, marginBottom: 26, textAlign: 'center' },
  input: { backgroundColor: '#f8fafc', borderColor: '#93c5fd', borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 12 },
  botaoPrincipal: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 8, marginTop: 4, padding: 13 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#2563eb', fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
});
