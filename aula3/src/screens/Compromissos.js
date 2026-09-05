import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAgendamentos } from '../context/AgendamentosContext';

const medicosPorEspecialidade = {
  'Clínico Geral': ['Dra. Ana Martins', 'Dr. Paulo Souza'],
  Cardiologia: ['Dr. Ricardo Lima'],
  Pediatria: ['Dra. Beatriz Costa'],
  Dermatologia: ['Dra. Camila Alves'],
};
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function inicioDoDia(data) { return new Date(data.getFullYear(), data.getMonth(), data.getDate()); }
function chaveData(data) { return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`; }
function textoData(data) { return data.toLocaleDateString('pt-BR'); }

export default function Compromissos({ navigation, route }) {
  const { agendamentos, removerAgendamento } = useAgendamentos();
  const hoje = useMemo(() => inicioDoDia(new Date()), []);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [especialidade, setEspecialidade] = useState('Clínico Geral');
  const [medico, setMedico] = useState('Dra. Ana Martins');
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [hora, setHora] = useState('');
  const [mesExibido, setMesExibido] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));

  useEffect(() => {
    if (route.params?.mostrarFormulario) {
      setMostrarFormulario(true);
      navigation.setParams({ mostrarFormulario: undefined });
    }
  }, [navigation, route.params?.mostrarFormulario]);

  function selecionarEspecialidade(valor) { setEspecialidade(valor); setMedico(medicosPorEspecialidade[valor][0]); }
  function temVaga(data) { const dia = data.getDay(); return data >= hoje && dia >= 1 && dia <= 5; }
  function selecionarData(data) { setDataSelecionada(data); setHora(''); }
  function horariosDisponiveis() {
    if (!dataSelecionada) return [];
    const base = especialidade === 'Pediatria' ? ['08:00', '09:00', '10:00', '14:00', '15:00'] : ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];
    const ocupados = agendamentos.filter((item) => item.medico === medico && item.data === textoData(dataSelecionada)).map((item) => item.hora);
    return base.filter((item) => !ocupados.includes(item));
  }
  function avancar() {
    if (!dataSelecionada || !hora) { Alert.alert('Atenção', 'Selecione um dia com vaga e um horário disponível.'); return; }
    setMostrarFormulario(false);
    navigation.navigate('Confirmacao', { agendamento: { especialidade, medico, data: textoData(dataSelecionada), hora } });
  }
  function confirmarCancelamento(item) {
    Alert.alert(
      'Cancelar agendamento',
      `Tem certeza que quer cancelar o agendamento com ${item.medico}?`,
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim, cancelar', style: 'destructive', onPress: () => removerAgendamento(item.id) },
      ]
    );
  }
  function renderizarItem({ item }) { return <View style={styles.card}><Text style={styles.especialidade}>{item.especialidade}</Text><Text style={styles.medico}>{item.medico}</Text><Text style={styles.data}>Data: {item.data} às {item.hora}</Text><Pressable style={styles.botaoDesmarcar} onPress={() => confirmarCancelamento(item)}><Text style={styles.textoDesmarcar}>Desmarcar agendamento</Text></Pressable></View>; }

  function Calendario() {
    const primeiroDia = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), 1).getDay();
    const quantidadeDias = new Date(mesExibido.getFullYear(), mesExibido.getMonth() + 1, 0).getDate();
    const celulas = Array.from({ length: primeiroDia + quantidadeDias }, (_, indice) => indice < primeiroDia ? null : new Date(mesExibido.getFullYear(), mesExibido.getMonth(), indice - primeiroDia + 1));
    const podeVoltar = mesExibido.getFullYear() > hoje.getFullYear() || mesExibido.getMonth() > hoje.getMonth();
    return <View style={styles.calendario}>
      <View style={styles.mes}><Pressable disabled={!podeVoltar} onPress={() => setMesExibido(new Date(mesExibido.getFullYear(), mesExibido.getMonth() - 1, 1))}><Text style={[styles.seta, !podeVoltar && styles.setaDesativada]}>‹</Text></Pressable><Text style={styles.nomeMes}>{meses[mesExibido.getMonth()]} {mesExibido.getFullYear()}</Text><Pressable onPress={() => setMesExibido(new Date(mesExibido.getFullYear(), mesExibido.getMonth() + 1, 1))}><Text style={styles.seta}>›</Text></Pressable></View>
      <View style={styles.grade}>{diasSemana.map((dia) => <Text key={dia} style={styles.diaSemana}>{dia}</Text>)}{celulas.map((dia, indice) => !dia ? <View key={`vazio-${indice}`} style={styles.celula} /> : <Pressable key={chaveData(dia)} disabled={!temVaga(dia)} onPress={() => selecionarData(dia)} style={[styles.celula, styles.diaCalendario, !temVaga(dia) && styles.diaIndisponivel, dataSelecionada && chaveData(dataSelecionada) === chaveData(dia) && styles.diaSelecionado]}><Text style={[styles.numeroDia, !temVaga(dia) && styles.numeroIndisponivel, dataSelecionada && chaveData(dataSelecionada) === chaveData(dia) && styles.numeroSelecionado]}>{dia.getDate()}</Text></Pressable>)}</View>
      <Text style={styles.legenda}><Text style={styles.ponto}>●</Text> Dias em verde possuem vagas.</Text>
    </View>;
  }

  if (mostrarFormulario) return <SafeAreaView style={styles.container}><FlatList data={[{ id: 'formulario' }]} keyExtractor={(item) => item.id} contentContainerStyle={styles.formularioLista} renderItem={() => <View style={styles.formulario}>
    <Text style={styles.titulo}>Novo agendamento</Text><Text style={styles.label}>Especialidade</Text>
    <View style={styles.opcoes}>{Object.keys(medicosPorEspecialidade).map((opcao) => <Pressable key={opcao} onPress={() => selecionarEspecialidade(opcao)} style={[styles.opcao, especialidade === opcao && styles.opcaoAtiva]}><Text style={[styles.textoOpcao, especialidade === opcao && styles.textoOpcaoAtiva]}>{opcao}</Text></Pressable>)}</View>
    <Text style={styles.label}>Médico(a)</Text>{medicosPorEspecialidade[especialidade].map((opcao) => <Pressable key={opcao} onPress={() => setMedico(opcao)} style={[styles.medicoOpcao, medico === opcao && styles.opcaoAtiva]}><Text style={[styles.textoOpcao, medico === opcao && styles.textoOpcaoAtiva]}>{opcao}</Text></Pressable>)}
    <Text style={styles.label}>Escolha uma data</Text><Calendario />
    {dataSelecionada ? <><Text style={styles.label}>Horários disponíveis em {textoData(dataSelecionada)}</Text><View style={styles.horarios}>{horariosDisponiveis().map((opcao) => <Pressable key={opcao} onPress={() => setHora(opcao)} style={[styles.horario, hora === opcao && styles.horarioAtivo]}><Text style={[styles.textoOpcao, hora === opcao && styles.textoOpcaoAtiva]}>{opcao}</Text></Pressable>)}</View>{horariosDisponiveis().length === 0 ? <Text style={styles.semHorario}>Não há horários restantes para este médico neste dia.</Text> : null}</> : null}
    <Pressable style={styles.botaoPrincipal} onPress={avancar}><Text style={styles.textoBotao}>Avançar para confirmação</Text></Pressable><Pressable onPress={() => setMostrarFormulario(false)}><Text style={styles.cancelar}>Cancelar</Text></Pressable>
  </View>} /></SafeAreaView>;

  return <SafeAreaView style={styles.container}><FlatList data={agendamentos} keyExtractor={(item) => item.id} contentContainerStyle={styles.lista} ListHeaderComponent={<><Text style={styles.titulo}>Meus agendamentos</Text><Pressable style={styles.botaoPrincipal} onPress={() => setMostrarFormulario(true)}><Text style={styles.textoBotao}>Fazer novo agendamento</Text></Pressable></>} ListEmptyComponent={<Text style={styles.vazio}>Você ainda não possui consultas agendadas.</Text>} renderItem={renderizarItem} /></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa' }, lista: { padding: 16, paddingBottom: 32 }, formularioLista: { padding: 16, paddingBottom: 32 }, titulo: { color: '#134e4a', fontSize: 26, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' }, formulario: { backgroundColor: '#fff', borderRadius: 14, elevation: 3, padding: 18 }, label: { color: '#334155', fontWeight: 'bold', marginBottom: 8, marginTop: 14 }, opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, opcao: { borderColor: '#99f6e4', borderRadius: 8, borderWidth: 1, padding: 9 }, medicoOpcao: { borderColor: '#99f6e4', borderRadius: 8, borderWidth: 1, marginBottom: 8, padding: 10 }, opcaoAtiva: { backgroundColor: '#ccfbf1', borderColor: '#0f766e' }, textoOpcao: { color: '#475569' }, textoOpcaoAtiva: { color: '#115e59', fontWeight: 'bold' }, calendario: { borderColor: '#ccfbf1', borderRadius: 10, borderWidth: 1, padding: 10 }, mes: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, nomeMes: { color: '#134e4a', fontWeight: 'bold' }, seta: { color: '#0f766e', fontSize: 28, paddingHorizontal: 10 }, setaDesativada: { color: '#cbd5e1' }, grade: { flexDirection: 'row', flexWrap: 'wrap' }, diaSemana: { color: '#64748b', fontSize: 11, fontWeight: 'bold', textAlign: 'center', width: '14.2857%' }, celula: { alignItems: 'center', height: 34, justifyContent: 'center', width: '14.2857%' }, diaCalendario: { borderRadius: 17 }, diaIndisponivel: { opacity: 0.35 }, diaSelecionado: { backgroundColor: '#0f766e' }, numeroDia: { color: '#15803d', fontWeight: 'bold' }, numeroIndisponivel: { color: '#64748b' }, numeroSelecionado: { color: '#fff' }, legenda: { color: '#64748b', fontSize: 12, marginTop: 8 }, ponto: { color: '#15803d' }, horarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, horario: { borderColor: '#99f6e4', borderRadius: 8, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 }, horarioAtivo: { backgroundColor: '#ccfbf1', borderColor: '#0f766e' }, semHorario: { color: '#b91c1c', marginTop: 5 }, botaoPrincipal: { alignItems: 'center', backgroundColor: '#0f766e', borderRadius: 8, marginBottom: 20, marginTop: 20, padding: 13 }, textoBotao: { color: '#fff', fontWeight: 'bold' }, cancelar: { color: '#b91c1c', fontWeight: 'bold', textAlign: 'center' }, vazio: { color: '#64748b', marginTop: 12, textAlign: 'center' }, card: { backgroundColor: '#fff', borderLeftColor: '#0f766e', borderLeftWidth: 5, borderRadius: 10, marginBottom: 12, padding: 14 }, especialidade: { color: '#134e4a', fontSize: 18, fontWeight: 'bold' }, medico: { color: '#475569', marginTop: 4 }, data: { color: '#0f766e', fontWeight: 'bold', marginTop: 8 }, botaoDesmarcar: { alignItems: 'center', borderColor: '#dc2626', borderRadius: 7, borderWidth: 1, marginTop: 14, padding: 9 }, textoDesmarcar: { color: '#dc2626', fontWeight: 'bold' },
});
