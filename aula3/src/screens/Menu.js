import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Menu({ navigation }) {
  function sair() {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.replace('Login') },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}><Ionicons name="medkit" size={46} color="#0f766e" /><Text style={styles.titulo}>Clínica Vida</Text><Text style={styles.subtitulo}>Cuidar da sua saúde é a nossa prioridade.</Text></View>
      <View style={styles.info}><Text style={styles.infoTitulo}>Atendimento humanizado</Text><Text style={styles.infoTexto}>Conte com uma equipe preparada e escolha o melhor horário para a sua consulta.</Text><Text style={styles.horario}>Segunda a sexta, das 8h às 18h</Text></View>
      <View style={styles.opcoes}>
        <Pressable style={styles.card} onPress={() => navigation.navigate('Agendamentos', { mostrarFormulario: true })}><Ionicons name="calendar" size={28} color="#0f766e" /><Text style={styles.textoCard}>Agendar consulta</Text><Ionicons name="chevron-forward" size={22} color="#64748b" /></Pressable>
        <Pressable style={styles.card} onPress={() => navigation.navigate('Contato')}><Ionicons name="call" size={28} color="#0f766e" /><Text style={styles.textoCard}>Fale conosco</Text><Ionicons name="chevron-forward" size={22} color="#64748b" /></Pressable>
      </View>
      <Pressable style={styles.sair} onPress={sair}><Ionicons name="log-out-outline" size={20} color="#b91c1c" /><Text style={styles.textoSair}>Sair da conta</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa', padding: 20 }, cabecalho: { alignItems: 'center', marginTop: 28 }, titulo: { color: '#134e4a', fontSize: 30, fontWeight: 'bold', marginTop: 8 }, subtitulo: { color: '#64748b', marginTop: 6, textAlign: 'center' }, info: { backgroundColor: '#fff', borderRadius: 14, elevation: 2, marginTop: 30, padding: 18 }, infoTitulo: { color: '#134e4a', fontSize: 18, fontWeight: 'bold' }, infoTexto: { color: '#475569', lineHeight: 21, marginTop: 8 }, horario: { color: '#0f766e', fontWeight: 'bold', marginTop: 13 }, opcoes: { gap: 12, marginTop: 24 }, card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, elevation: 2, flexDirection: 'row', padding: 16 }, textoCard: { color: '#134e4a', flex: 1, fontSize: 16, fontWeight: 'bold', marginLeft: 14 }, sair: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 30, padding: 12 }, textoSair: { color: '#b91c1c', fontWeight: 'bold', marginLeft: 8 },
});
