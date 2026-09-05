import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAgendamentos } from '../context/AgendamentosContext';

export default function Confirmacao({ navigation, route }) {
  const { adicionarAgendamento } = useAgendamentos();
  const agendamento = route.params?.agendamento;

  if (!agendamento) {
    return <SafeAreaView style={styles.container}><Text style={styles.erro}>Nenhum agendamento foi informado.</Text></SafeAreaView>;
  }

  function confirmar() {
    adicionarAgendamento(agendamento);
    Alert.alert('Consulta agendada', 'Seu agendamento foi confirmado com sucesso.', [
      { text: 'Ver agendamentos', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="calendar" size={46} color="#0f766e" />
        <Text style={styles.titulo}>Confirme sua consulta</Text>
        <Text style={styles.subtitulo}>Revise os dados antes de confirmar.</Text>
        <View style={styles.dados}>
          <Text style={styles.rotulo}>Especialidade</Text><Text style={styles.valor}>{agendamento.especialidade}</Text>
          <Text style={styles.rotulo}>Médico(a)</Text><Text style={styles.valor}>{agendamento.medico}</Text>
          <Text style={styles.rotulo}>Data e hora</Text><Text style={styles.valor}>{agendamento.data} às {agendamento.hora}</Text>
        </View>
        <Pressable style={styles.botaoConfirmar} onPress={confirmar}><Text style={styles.textoBotao}>Confirmar agendamento</Text></Pressable>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.voltar}>Voltar aos agendamentos</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa', justifyContent: 'center', padding: 20 }, card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, elevation: 3, padding: 24 }, titulo: { color: '#134e4a', fontSize: 25, fontWeight: 'bold', marginTop: 12 }, subtitulo: { color: '#64748b', marginTop: 8, textAlign: 'center' }, dados: { alignSelf: 'stretch', backgroundColor: '#f0fdfa', borderRadius: 10, marginTop: 24, padding: 16 }, rotulo: { color: '#475569', fontSize: 13, marginTop: 8 }, valor: { color: '#134e4a', fontSize: 17, fontWeight: 'bold', marginTop: 2 }, botaoConfirmar: { alignSelf: 'stretch', alignItems: 'center', backgroundColor: '#0f766e', borderRadius: 8, marginTop: 24, padding: 13 }, textoBotao: { color: '#fff', fontWeight: 'bold' }, voltar: { color: '#0f766e', fontWeight: 'bold', marginTop: 18 }, erro: { color: '#b91c1c', textAlign: 'center' },
});
