import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#fff8f2' },
  conteudo: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: 20, gap: 16, flexGrow: 1 },
  formulario: { width: '100%', maxWidth: 460, alignSelf: 'center', gap: 16, padding: 24, flexGrow: 1, justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#552a1c' },
  subtitulo: { fontSize: 16, color: '#66564e', lineHeight: 24 },
  card: { padding: 18, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#eadbd0', gap: 12 },
  nome: { fontSize: 19, fontWeight: 'bold', color: '#552a1c' },
  preco: { fontSize: 18, fontWeight: 'bold', color: '#a63b1c' },
  linha: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  botao: { minHeight: 48, backgroundColor: '#b44221', borderRadius: 10, padding: 14, justifyContent: 'center', alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  secundario: { minHeight: 48, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#b44221', justifyContent: 'center', alignItems: 'center' },
  link: { color: '#a63b1c', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  input: { minHeight: 48, padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#b7a59a', borderRadius: 10, color: '#38291f', fontSize: 16 },
  desabilitado: { opacity: 0.45 },
  aviso: { color: '#24633a', fontSize: 16 },
});
