import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Menu({ navigation }) {
  function abrirNovoCompromisso() {
    navigation.navigate('Compromissos', { exibirFormulario: true });
  }

  function abrirCompromissosCadastrados() {
    navigation.navigate('Compromissos', { exibirFormulario: false });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Minha Agenda</Text>
        <Text style={styles.subtitulo}>O que você deseja fazer?</Text>
      </View>

      <View style={styles.opcoes}>
        <Pressable style={styles.card} onPress={abrirNovoCompromisso}>
          <View style={[styles.icone, styles.iconeNovo]}>
            <Ionicons name="add-circle" size={32} color="#ffffff" />
          </View>
          <View style={styles.textosCard}>
            <Text style={styles.tituloCard}>Novo compromisso</Text>
            <Text style={styles.descricaoCard}>Cadastre um novo item na agenda.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#64748b" />
        </Pressable>

        <Pressable style={styles.card} onPress={abrirCompromissosCadastrados}>
          <View style={[styles.icone, styles.iconeLista]}>
            <Ionicons name="list" size={32} color="#ffffff" />
          </View>
          <View style={styles.textosCard}>
            <Text style={styles.tituloCard}>Compromissos cadastrados</Text>
            <Text style={styles.descricaoCard}>Veja, edite ou conclua seus itens.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#64748b" />
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => Alert.alert('Configurações', 'Esta tela será criada na próxima etapa.')}
        >
          <View style={[styles.icone, styles.iconeConfig]}>
            <Ionicons name="settings" size={32} color="#ffffff" />
          </View>
          <View style={styles.textosCard}>
            <Text style={styles.tituloCard}>Configurações</Text>
            <Text style={styles.descricaoCard}>Personalize as opções da agenda.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#64748b" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff6ff', padding: 20 },
  cabecalho: { marginTop: 30, marginBottom: 30 },
  titulo: { color: '#1e3a8a', fontSize: 30, fontWeight: 'bold' },
  subtitulo: { color: '#64748b', fontSize: 16, marginTop: 6 },
  opcoes: { gap: 14 },
  card: { alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, elevation: 3, flexDirection: 'row', padding: 16 },
  icone: { alignItems: 'center', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  iconeNovo: { backgroundColor: '#2563eb' },
  iconeLista: { backgroundColor: '#16a34a' },
  iconeConfig: { backgroundColor: '#f59e0b' },
  textosCard: { flex: 1, marginHorizontal: 14 },
  tituloCard: { color: '#1e293b', fontSize: 17, fontWeight: 'bold' },
  descricaoCard: { color: '#64748b', fontSize: 13, marginTop: 4 },
});
