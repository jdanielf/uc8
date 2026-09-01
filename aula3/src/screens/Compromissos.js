import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput,  View, Linking} from 'react-native';

const opcoesPrioridade = ['Baixa', 'Média', 'Alta'];

export default function Compromissos() {
  // Estados do formulário e da lista de compromissos.
  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [observacao, setObservacao] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  // Executa sempre que a lista for alterada.
  useEffect(() => {
    console.log(`Quantidade de compromissos: ${lista.length}`);
  }, [lista]);

  function limparFormulario() {
    setNome('');
    setData('');
    setPrioridade('Média');
    setObservacao('');
    setIdEditando(null);
  }

  function salvar() {
    if (!nome.trim() || !data.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e a data do compromisso.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      data: data.trim(),
      prioridade,
      observacao: observacao.trim(),
    };

    if (idEditando) {
      // map mantém os itens que não estão sendo editados e atualiza só o escolhido.
      setLista((listaAtual) =>
        listaAtual.map((item) =>
          item.id === idEditando ? { ...item, ...dados } : item
        )
      );
    } else {
      setLista((listaAtual) => [
        { id: Date.now().toString(), ...dados, concluido: false },
        ...listaAtual,
      ]);
    }

    limparFormulario();
  }

  function editar(item) {
    setNome(item.nome);
    setData(item.data);
    setPrioridade(item.prioridade);
    setObservacao(item.observacao);
    setIdEditando(item.id);
  }

  function alterarConclusao(id) {
    setLista((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      )
    );
  }

  function excluir(id) {
    Alert.alert('Excluir', 'Deseja excluir este compromisso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          setLista((listaAtual) => listaAtual.filter((item) => item.id !== id)),
      },
    ]);
  }

  function abrirGoogle() {
    Linking.openURL('https://www.google.com').catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o Google.');
    });
  }

  function corDaPrioridade(valor) {
    if (valor === 'Alta') return styles.prioridadeAlta;
    if (valor === 'Baixa') return styles.prioridadeBaixa;
    return styles.prioridadeMedia;
  }

  function renderizarItem({ item }) {
    return (
      <View style={[styles.card, item.concluido && styles.cardConcluido]}>
        <View style={styles.linhaTitulo}>
          <Text style={[styles.nomeCard, item.concluido && styles.textoConcluido]}>
            {item.concluido ? '✓ ' : ''}{item.nome}
          </Text>
          <Text style={[styles.prioridadeCard, corDaPrioridade(item.prioridade)]}>
            {item.prioridade}
          </Text>
        </View>
        <Text style={styles.dataCard}>Data: {item.data}</Text>
        {item.observacao ? <Text style={styles.observacaoCard}>{item.observacao}</Text> : null}

        <View style={styles.acoes}>
          <Pressable style={[styles.botaoAcao, styles.botaoConcluir]} onPress={() => alterarConclusao(item.id)}>
            <Text style={styles.textoBotao}>{item.concluido ? 'Reabrir' : 'Concluir'}</Text>
          </Pressable>
          <Pressable style={[styles.botaoAcao, styles.botaoEditar]} onPress={() => editar(item)}>
            <Text style={styles.textoBotao}>Editar</Text>
          </Pressable>
          <Pressable style={[styles.botaoAcao, styles.botaoExcluir]} onPress={() => excluir(item.id)}>
            <Text style={styles.textoBotao}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItem}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>{'\n'}Gerenciador de Compromissos</Text>
            <Pressable style={styles.botaoGoogle} onPress={abrirGoogle}>
              <Text style={styles.textoGoogle}>Abrir Google</Text>
            </Pressable>
            <View style={styles.formulario}>
              <Text style={styles.subtitulo}>{idEditando ? 'Editar compromisso' : 'Novo compromisso'}</Text>
              <TextInput style={styles.input} placeholder="Nome do compromisso" value={nome} onChangeText={setNome} />
              <TextInput style={styles.input} placeholder="Data de vencimento (ex.: 31/08/2026)" value={data} onChangeText={setData} />
              <TextInput style={[styles.input, styles.observacaoInput]} placeholder="Observação (opcional)" value={observacao} onChangeText={setObservacao} multiline />

              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.prioridades}>
                {opcoesPrioridade.map((opcao) => (
                  <Pressable key={opcao} onPress={() => setPrioridade(opcao)} style={[styles.opcao, prioridade === opcao && styles.opcaoAtiva]}>
                    <Text style={[styles.textoOpcao, prioridade === opcao && styles.textoOpcaoAtiva]}>{opcao}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={styles.botaoSalvar} onPress={salvar}>
                <Text style={styles.textoSalvar}>{idEditando ? 'Salvar edição' : 'Adicionar compromisso'}</Text>
              </Pressable>
              {idEditando ? <Pressable onPress={limparFormulario}><Text style={styles.cancelar}>Cancelar edição</Text></Pressable> : null}
            </View>
            <Text style={styles.tituloLista}>Compromissos do dia ({lista.length})</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum compromisso adicionado.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff6ff' },
  lista: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', marginVertical: 12, textAlign: 'center' },
  botaoGoogle: { backgroundColor: '#4285f4', borderRadius: 8, alignItems: 'center', padding: 12, marginBottom: 4 },
  textoGoogle: { color: '#fff', fontWeight: 'bold' },
  formulario: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 19, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#93c5fd', borderRadius: 8, padding: 11, marginBottom: 10, backgroundColor: '#f8fafc' },
  observacaoInput: { minHeight: 60, textAlignVertical: 'top' },
  label: { fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  prioridades: { flexDirection: 'row', gap: 8 },
  opcao: { flex: 1, borderWidth: 1, borderColor: '#93c5fd', borderRadius: 8, padding: 9, alignItems: 'center' },
  opcaoAtiva: { backgroundColor: '#dbeafe', borderColor: '#2563eb' },
  textoOpcao: { color: '#475569' },
  textoOpcaoAtiva: { color: '#1d4ed8', fontWeight: 'bold' },
  botaoSalvar: { backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center', padding: 13, marginTop: 16 },
  textoSalvar: { color: '#fff', fontWeight: 'bold' },
  cancelar: { color: '#dc2626', fontWeight: 'bold', textAlign: 'center', marginTop: 12 },
  tituloLista: { fontSize: 19, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 10 },
  vazio: { textAlign: 'center', color: '#64748b', marginTop: 15 },
  card: { backgroundColor: '#fff', borderLeftWidth: 5, borderLeftColor: '#2563eb', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardConcluido: { borderLeftColor: '#16a34a', opacity: 0.7 },
  linhaTitulo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  nomeCard: { flex: 1, fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
  textoConcluido: { textDecorationLine: 'line-through' },
  prioridadeCard: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  prioridadeAlta: { backgroundColor: '#fee2e2', color: '#dc2626' },
  prioridadeMedia: { backgroundColor: '#fef3c7', color: '#b45309' },
  prioridadeBaixa: { backgroundColor: '#dcfce7', color: '#15803d' },
  dataCard: { marginTop: 8, color: '#475569' },
  observacaoCard: { marginTop: 5, color: '#64748b' },
  acoes: { flexDirection: 'row', gap: 8, marginTop: 13 },
  botaoAcao: { borderRadius: 6, paddingVertical: 8, paddingHorizontal: 10 },
  botaoConcluir: { backgroundColor: '#16a34a' },
  botaoEditar: { backgroundColor: '#f59e0b' },
  botaoExcluir: { backgroundColor: '#dc2626' },
  textoBotao: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
