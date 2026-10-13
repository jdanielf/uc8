import { Fragment, useState } from 'react';
import AnexosPet from '../components/AnexosPet';
import { Pressable, Text, View } from 'react-native';
import usePets from '../context/PetContext';
import { hoje, dataISO, formatarData, formatarHorario, conclusaoValida } from '../utils/domain.cjs';
import { Botao, Campo, Card, Pagina, Titulo, Vazio, Escolhas, s } from '../components/UI';
const tipos = ['Banho', 'Tosa', 'Vacina', 'Consulta', 'Avaliação', 'Outros'];
const vazio = () => ({ tipo: '', titulo: '', data: formatarData(hoje()), hora: '10:00', horaSaida: '', dataConclusao: '', status: 'Em andamento', profissional: '', detalhes: '', idade: '', peso: '', vacina: '', fabricante: '', lote: '', proxima: '' });
export default function NovoServico({ route, navigation }) {
  const { dados, usuario, alterar, erro: erroDados } = usePets();

  const existente = dados.servicos.find(s => s.id === route.params?.servicoId && s.petId === route.params.petId);
  const [form, setForm] = useState(() => existente ? { ...vazio(), ...existente, data: formatarData(existente.data), dataConclusao: existente.dataConclusao ? formatarData(existente.dataConclusao) : '', proxima: existente.proxima ? formatarData(existente.proxima) : '' } : vazio());
  const [erro, setErro] = useState('');

  const [ocupado, setOcupado] = useState(false);
  const campo = (chave, valor) => setForm(atual => ({ ...atual, [chave]: valor }));
  const pet = dados.pets.find(p => p.id === route.params.petId);
  if (usuario?.papel !== 'clinica' || !pet || (route.params?.servicoId && !existente)) return <Pagina><Vazio texto="Serviço indisponível para este acesso." /></Pagina>;
  async function salvar() {
    if (ocupado) return;
    const data = dataISO(form.data);
    const dataConclusao = dataISO(form.dataConclusao);
    const proxima = form.proxima.trim() ? dataISO(form.proxima) : null;
    if (!tipos.includes(form.tipo) || !form.profissional.trim() || !form.detalhes.trim()) return setErro('Selecione o serviço e preencha profissional e detalhes.');
    if (!data || !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.hora)) return setErro('Informe data e horário da entrada válidos.');
    if (form.status === 'Concluído' && !conclusaoValida(data, form.hora, dataConclusao, form.horaSaida)) return setErro('Informe data e hora da conclusão válidas, iguais ou posteriores à entrada.');
    if (form.tipo === 'Vacina' && !form.vacina.trim()) return setErro('Informe o nome da vacina.');
    if (form.tipo === 'Vacina' && form.proxima.trim() && (!proxima || proxima <= data)) return setErro('A próxima aplicação deve ser uma data válida posterior ao atendimento.');
    setOcupado(true); setErro('');
    try {
      await alterar('servicos', { ...form, id: existente?.id || Date.now() + '-' + Math.random().toString(36).slice(2), petId: pet.id, data, dataConclusao: form.status === 'Concluído' ? dataConclusao : null, horaSaida: form.status === 'Concluído' ? form.horaSaida : '', titulo: existente?.titulo || form.tipo, profissional: form.profissional.trim(), detalhes: form.detalhes.trim(), idade: form.tipo === 'Outros' ? form.idade.trim() : '', peso: form.tipo === 'Outros' ? form.peso.trim() : '', proxima: form.tipo === 'Vacina' ? proxima : null });
      if (route.params?.origem === 'EmAndamento') navigation.goBack();
      else navigation.popTo('Pet', { petId: pet.id, dataServico: data });
    } catch (e) { setErro(e.message || 'Não foi possível salvar. Tente novamente.'); }
    finally { setOcupado(false); }
  }
  return <Pagina>
    <Titulo subtitulo="Selecione um serviço para registrar o atendimento.">{existente ? 'Atendimento de ' : 'Novo serviço para '}{pet.nome}</Titulo>
    {!!erroDados && <Text accessibilityRole="alert" style={s.body}>{erroDados}</Text>}
    {!form.tipo && tipos.map(tipo => <Fragment key={tipo}>{tipo === 'Outros' && <AnexosPet pet={pet} />}<Pressable accessibilityRole="button" accessibilityLabel={'Selecionar ' + tipo} onPress={() => { setErro(''); setForm(atual => ({ ...atual, tipo, titulo: tipo })); }}><Card><View style={[s.row, { minHeight: 44 }]}><Text style={[s.heading, { flex: 1 }]}>{tipo}</Text><Text style={s.body}>›</Text></View></Card></Pressable></Fragment>)}
    {!!form.tipo && !existente && <><Botao secundario disabled={ocupado} titulo="Voltar à lista de serviços" onPress={() => { setForm(vazio()); setErro(''); }} /><Text style={[s.heading, { marginVertical: 16 }]}>{form.tipo}</Text></>}
      {!!form.tipo && <>
        <Campo label="Data do atendimento (DD/MM/AAAA)" value={form.data} onChangeText={v => campo('data', v)} keyboardType="numbers-and-punctuation" editable={!ocupado} />
        <Campo label="Horário da entrada (HH:MM)" value={form.hora} onChangeText={v => campo('hora', formatarHorario(v))} keyboardType="number-pad" maxLength={5} editable={!ocupado} />
        <Campo label="Data da conclusão (DD/MM/AAAA)" value={form.dataConclusao} onChangeText={v => campo('dataConclusao', v)} placeholder="Ex.: 13/10/2026" keyboardType="numbers-and-punctuation" editable={!ocupado} />
        <Campo label="Hora da conclusão / saída (HH:MM)" value={form.horaSaida} onChangeText={v => campo('horaSaida', formatarHorario(v))} keyboardType="number-pad" maxLength={5} placeholder="Ex.: 11:00" editable={!ocupado} />
        <Text style={s.muted}>O serviço permanece em andamento até informar a data e a hora da conclusão, selecionar Concluído e salvar.</Text><Text style={s.label}>SITUAÇÃO</Text><Escolhas valores={['Em andamento', 'Concluído']} value={form.status} onChange={v => { if (!ocupado) campo('status', v); }} />
        <Campo label="Profissional responsável" value={form.profissional} onChangeText={v => campo('profissional', v)} editable={!ocupado} />
        <Campo label="Detalhes do atendimento" multiline value={form.detalhes} onChangeText={v => campo('detalhes', v)} editable={!ocupado} />
        {form.tipo === 'Outros' && <>
          <Campo label="Idade" placeholder="Ex.: 3 anos" value={form.idade} onChangeText={v => campo('idade', v)} editable={!ocupado} />
          <Campo label="Peso (kg)" placeholder="Ex.: 12,5 kg" value={form.peso} onChangeText={v => campo('peso', v)} editable={!ocupado} />
        </>}
        {form.tipo === 'Vacina' && <>
          <Campo label="Nome da vacina" value={form.vacina} onChangeText={v => campo('vacina', v)} editable={!ocupado} />
          <Campo label="Fabricante" value={form.fabricante} onChangeText={v => campo('fabricante', v)} editable={!ocupado} />
          <Campo label="Lote" value={form.lote} onChangeText={v => campo('lote', v)} editable={!ocupado} />
          <Campo label="Próxima aplicação (DD/MM/AAAA, opcional)" value={form.proxima} onChangeText={v => campo('proxima', v)} editable={!ocupado} />
        </>}
        <Botao titulo={ocupado ? 'Salvando...' : form.status === 'Concluído' ? 'Concluir serviço' : 'Salvar em andamento'} disabled={ocupado || !!erroDados} onPress={salvar} />
      </>}
      {!!erro && <Text accessibilityRole="alert" style={s.body}>{erro}</Text>}
  </Pagina>;
}
