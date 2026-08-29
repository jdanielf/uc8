import React, { useState } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  StyleSheet,  Alert,  KeyboardAvoidingView,  Platform, ScrollView,} 

from 'react-native';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }

    Alert.alert('Sucesso', `Cadastro realizado com sucesso, ${nome}!`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>CADASTRO</Text>
          </View>

          <Text style={styles.titulo}>Crie sua conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
            <Text style={styles.botaoTexto}>Cadastrar</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Já tem conta?</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef4ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    width:180,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#2f6fed',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  botao: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '700',
    marginLeft: 6,
  },
});

