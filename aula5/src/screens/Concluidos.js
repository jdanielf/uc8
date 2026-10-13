import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import usePets from '../context/PetContext';
import { formatarData } from '../utils/domain.cjs';
import { Botao, Card, Pagina, Titulo, Vazio, s } from '../components/UI';
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
export default function Concluidos({ navigation }) {
  const { dados, usuario } = usePets();
  const [ano, setAno] = useState(null); const [mes, setMes] = useState(null); const [dia, setDia] = useState(null);
  const pets = dados.pets.filter(p => usuario.papel === 'clinica' || p.email === usuario.email);
  const servicos = dados.servicos.filter(s => s.status === 'Concluído' && pets.some(p => p.id === s.petId));
  const datas = [...new Set(servicos.map(s => s.data))].sort().reverse();
  const anos = [...new Set(datas.map(d => d.slice(0, 4)))];
  const mesesAno = [...new Set(datas.filter(d => d.startsWith(ano + '-')).map(d => d.slice(5, 7)))];
  const dias = datas.filter(d => d.startsWith(ano + '-' + mes + '-'));
  const petsDoDia = pets.filter(p => servicos.some(s => s.data === dia && s.petId === p.id));
  const opcao = (valor, titulo, acao) => <Pressable key={valor} accessibilityRole="button" onPress={acao}><Card><Text style={s.heading}>{titulo}</Text><Text style={s.muted}>Toque para abrir</Text></Card></Pressable>;
  return <Pagina><Titulo subtitulo="Selecione o ano, o mês e o dia para consultar os atendimentos finalizados.">Concluídos</Titulo>
    {!servicos.length && <Vazio texto="Nenhum serviço concluído no histórico." />}
    {ano && <Botao secundario titulo="Voltar aos anos" onPress={() => { setAno(null); setMes(null); setDia(null); }} />}
    {mes && <Botao secundario titulo={'Voltar aos meses de ' + ano} onPress={() => { setMes(null); setDia(null); }} />}
    {dia && <Botao secundario titulo="Voltar aos dias" onPress={() => setDia(null)} />}
    {!ano && anos.map(a => opcao(a, a, () => setAno(a)))}
    {ano && !mes && <><Text style={[s.heading, { marginBottom: 16 }]}>{ano}</Text>{mesesAno.map(m => opcao(m, meses[Number(m) - 1], () => setMes(m)))}</>}
    {mes && !dia && <><Text style={[s.heading, { marginBottom: 16 }]}>{meses[Number(mes) - 1]} de {ano}</Text>{dias.map(d => opcao(d, formatarData(d), () => setDia(d)))}</>}
    {dia && <><Titulo>Atendimentos de {formatarData(dia)}</Titulo>{petsDoDia.map(pet => {
      const tutor = dados.clientes.find(c => c.email === pet.email);
      return <Pressable key={pet.id} accessibilityRole="button" accessibilityLabel={'Abrir ficha de ' + pet.nome + ', tutor ' + (tutor?.nome || pet.email)} onPress={() => navigation.push('Pet', { petId: pet.id, dataServico: dia })}><Card><Text style={s.heading}>Tutor: {tutor?.nome || pet.email}</Text><Text style={s.heading}>Pet: {pet.nome}</Text></Card></Pressable>;
    })}</>}
  </Pagina>;
}
