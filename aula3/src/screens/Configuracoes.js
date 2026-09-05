import { Alert, Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const contato = [
  { icone: 'logo-whatsapp', titulo: 'WhatsApp', texto: '(11) 99999-9999', link: 'https://wa.me/5511999999999' },
  { icone: 'mail', titulo: 'E-mail', texto: 'contato@clinicavida.com.br', link: 'mailto:contato@clinicavida.com.br' },
  { icone: 'call', titulo: 'Telefone', texto: '(11) 3333-3333', link: 'tel:+551133333333' },
];

export default function Configuracoes() {
  function abrirLink(link) { Linking.openURL(link).catch(() => Alert.alert('Erro', 'Não foi possível abrir este contato.')); }
  return (
    <SafeAreaView style={styles.container}><View style={styles.conteudo}><Text style={styles.titulo}>Contato</Text><Text style={styles.subtitulo}>Estamos aqui para ajudar você.</Text>
      {contato.map((item) => <Pressable key={item.titulo} style={styles.card} onPress={() => abrirLink(item.link)}><Ionicons name={item.icone} size={28} color="#0f766e" /><View style={styles.textos}><Text style={styles.rotulo}>{item.titulo}</Text><Text style={styles.valor}>{item.texto}</Text></View><Ionicons name="open-outline" size={20} color="#64748b" /></Pressable>)}
    </View></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa' }, conteudo: { padding: 20 }, titulo: { color: '#134e4a', fontSize: 28, fontWeight: 'bold', textAlign: 'center' }, subtitulo: { color: '#64748b', marginBottom: 26, marginTop: 7, textAlign: 'center' }, card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, elevation: 2, flexDirection: 'row', marginBottom: 12, padding: 16 }, textos: { flex: 1, marginLeft: 14 }, rotulo: { color: '#134e4a', fontSize: 16, fontWeight: 'bold' }, valor: { color: '#475569', marginTop: 4 },
});
