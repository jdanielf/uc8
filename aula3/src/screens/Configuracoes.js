import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Configuracoes() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="settings" size={48} color="#2563eb" />
        <Text style={styles.titulo}>Configurações</Text>
        <Text style={styles.texto}>Esta é a área reservada para personalizar sua agenda.</Text>
        <Pressable
          style={styles.botao}
          onPress={() => Alert.alert('Em breve', 'Novas configurações serão adicionadas aqui.')}
        >
          <Text style={styles.textoBotao}>Ver opções</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff6ff', justifyContent: 'center', padding: 20 },
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, elevation: 3, padding: 28 },
  titulo: { color: '#1e3a8a', fontSize: 25, fontWeight: 'bold', marginTop: 12 },
  texto: { color: '#64748b', marginTop: 10, textAlign: 'center' },
  botao: { backgroundColor: '#2563eb', borderRadius: 8, marginTop: 24, paddingHorizontal: 20, paddingVertical: 12 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
});
