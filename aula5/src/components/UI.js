import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
export const cores = { verde: '#176B57', fundo: '#F3F6F4', texto: '#203B33', cinza: '#677A73' };
export function Botao({ titulo, onPress, secundario, disabled }) { return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[s.botao, secundario && s.secundario, disabled && { opacity: .45 }]}><Text style={{ color: secundario ? cores.verde : '#fff', fontWeight: '700' }}>{titulo}</Text></Pressable>; }
export function Campo({ label, ...props }) { return <View style={{ marginBottom: 14 }}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#82928C" style={[s.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }]} {...props} /></View>; }
export function Pagina({ children }) { return <ScrollView style={{ flex: 1, backgroundColor: cores.fundo }} contentContainerStyle={s.pagina} keyboardShouldPersistTaps="handled">{children}</ScrollView>; }
export function Titulo({ children, subtitulo }) { return <View style={{ marginBottom: 20 }}><Text style={s.titulo}>{children}</Text>{subtitulo && <Text style={s.muted}>{subtitulo}</Text>}</View>; }
export function Card({ children, style }) { return <View style={[s.card, style]}>{children}</View>; }
export function Vazio({ texto, icon = 'paw-outline' }) { return <Card><Ionicons name={icon} size={30} color={cores.cinza} /><Text style={s.muted}>{texto}</Text></Card>; }
export function Caixa({ titulo, visible, onClose, children }) { return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}><SafeAreaView style={s.overlay}><View style={s.modal}><View style={s.row}><Text style={s.heading}>{titulo}</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} hitSlop={12}><Ionicons name="close" size={26} color={cores.texto} /></Pressable></View><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}>{children}</ScrollView></View></SafeAreaView></Modal>; }
export function Linha({ label, valor }) { return <View style={{ marginBottom: 14 }}><Text style={s.label}>{label}</Text><Text style={s.body}>{valor || 'Não informado'}</Text></View>; }
export function Escolhas({ valores, value, onChange }) { return <View style={s.wrap}>{valores.map(v => <Pressable accessibilityRole="button" accessibilityState={{ selected: value === v }} key={v} onPress={() => onChange(v)} style={[s.chip, value === v && { backgroundColor: cores.verde }]}><Text style={{ color: value === v ? '#fff' : cores.verde, fontWeight: '600' }}>{v}</Text></Pressable>)}</View>; }
export const s = StyleSheet.create({
  pagina: { padding: 22, paddingBottom: 40, width: '100%', maxWidth: 820, alignSelf: 'center' },
  titulo: { fontSize: 29, fontWeight: '800', color: cores.texto, marginBottom: 6 },
  heading: { fontSize: 20, fontWeight: '700', color: cores.texto, flexShrink: 1 },
  muted: { fontSize: 14, color: cores.cinza, lineHeight: 22, marginTop: 6 },
  body: { fontSize: 16, color: cores.texto, lineHeight: 24 },
  label: { fontSize: 13, fontWeight: '600', color: cores.cinza, marginBottom: 7 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 14, borderWidth: 1, borderColor: '#E2EBE6', gap: 7 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  input: { backgroundColor: '#FAFCFB', borderWidth: 1, borderColor: '#CEDBD4', borderRadius: 12, padding: 14, fontSize: 16, color: cores.texto },
  botao: { backgroundColor: cores.verde, padding: 15, borderRadius: 12, alignItems: 'center', marginVertical: 5 },
  secundario: { backgroundColor: '#EAF5EF', borderWidth: 1, borderColor: '#D2E8DA' },
  chip: { backgroundColor: '#EAF5EF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  overlay: { flex: 1, backgroundColor: '#142E25AA', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { backgroundColor: '#fff', padding: 22, borderRadius: 22, width: '100%', maxWidth: 560, maxHeight: '90%' }
});
