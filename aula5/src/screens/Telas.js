import { useState } from 'react';
import { Image, Linking, Platform, Pressable, Text, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { RecursosConta } from './Recursos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import usePets from '../context/PetContext';
import { Botao, Campo, Pagina, Titulo, Card, Vazio, Caixa, Linha, cores, s } from '../components/UI';
import { formatarData, petsDoCliente, servicosDoDia } from '../utils/domain.cjs';


function Erro({ texto }) { return texto ? <Text accessibilityRole="alert" style={{ color: '#A53737', marginVertical: 10 }}>{texto}</Text> : null; }
function Foto({ uri, grande }) {
  const [falhou, setFalhou] = useState(false);
  return falhou ? <Text style={s.muted}>Não foi possível carregar esta foto.</Text> : <Image source={{ uri }} onError={() => setFalhou(true)} style={{ width: '100%', height: grande ? 360 : 200, borderRadius: 14 }} resizeMode="contain" />;
}
export function Login() {
  const { entrar } = usePets();
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState(''); const [erro, setErro] = useState('');
  return <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}><Pagina>
    <View style={{ alignItems: 'center', paddingVertical: 30 }}><Ionicons name="paw" size={60} color={cores.verde} /><Text style={[s.titulo, { marginTop: 14 }]}>PetCare</Text><Text style={s.muted}>Perto do seu pet, em cada cuidado.</Text></View>
    <Card><Titulo subtitulo="Use o e-mail e a senha cadastrados pela clínica.">Bem-vindo</Titulo>
      <Campo label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      <Campo label="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="current-password" />
      <Erro texto={erro} /><Botao titulo="Entrar" onPress={() => { if (!entrar(email, senha)) setErro('Confira seu e-mail e sua senha. Se precisar, fale com a clínica.'); }} />
      <Text style={s.muted}>O cadastro é realizado pela clínica. Para solicitar ou recuperar o acesso, entre em contato com a equipe.</Text>
    </Card>
    <Card><Text style={s.heading}>Acessos para avaliação</Text><Text style={s.muted}>Cliente: cliente@petcare.com · pet123{ '\n' }Clínica: clinica@petcare.com · clinica123</Text><Text style={s.muted}>Demonstração local. O envio de e-mail e o acompanhamento entre aparelhos ainda não estão conectados.</Text></Card>
  </Pagina></SafeAreaView>;
}
export function Pets({ navigation }) {
  const { dados, usuario } = usePets();
  const [busca, setBusca] = useState('');
  const clinica = usuario.papel === 'clinica';
  const pets = clinica ? dados.pets : petsDoCliente(dados.pets, usuario.email);
  const normalizar = valor => (valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const termo = normalizar(busca);
  const encontrados = pets.filter(pet => {
    const tutor = dados.clientes.find(cliente => cliente.email === pet.email);
    return normalizar(pet.nome).includes(termo) || (clinica && normalizar(tutor?.nome).includes(termo));
  });
  return <Pagina><Titulo subtitulo="Selecione um pet para ver sua ficha e acompanhar o atendimento.">Olá, {usuario.nome}!</Titulo>
    <Card><Text style={s.heading}>Buscar pets</Text><Campo label={clinica ? 'Nome do tutor ou do pet' : 'Nome do pet'} placeholder={clinica ? 'Digite o nome do tutor ou do pet' : 'Digite o nome do pet'} value={busca} onChangeText={setBusca} autoCorrect={false} />{busca ? <Botao secundario titulo="Limpar busca" onPress={() => setBusca('')} /> : null}</Card>
    {pets.length === 0 && <Vazio texto="A clínica ainda não cadastrou um pet para este e-mail." />}
    {pets.length > 0 && encontrados.length === 0 && <Vazio texto={clinica ? 'Nenhum pet encontrado para esse nome de tutor ou pet.' : 'Nenhum pet encontrado para esse nome.'} />}
    {encontrados.map(pet => <Pressable accessibilityRole="button" accessibilityLabel={`Acompanhar ${pet.nome}`} key={pet.id} onPress={() => navigation.navigate('Pet', { petId: pet.id })}><Card><View style={s.row}><View style={{ flex: 1 }}><Ionicons name="paw" size={30} color={cores.verde} /><Text style={[s.heading, { marginTop: 8 }]}>{pet.nome}</Text><Text style={s.muted}>{pet.especie} · {pet.raca}</Text><Text style={s.muted}>Tutor: {dados.clientes.find(cliente => cliente.email === pet.email)?.nome || pet.email}</Text><Text style={s.muted}>Ver dados e serviços do dia</Text></View><Ionicons name="chevron-forward" size={24} color={cores.verde} /></View></Card></Pressable>)}
  </Pagina>;
}
export function PetDetalhes({ route }) {
  const { dados, usuario } = usePets();
  const pet = dados.pets.find(p => p.id === route.params.petId && (usuario.papel === 'clinica' || p.email === usuario.email));
  const [ano, setAno] = useState(null); const [mes, setMes] = useState(null); const [data, setData] = useState(null);
  const [servico, setServico] = useState(null);
  const [foto, setFoto] = useState(null); const [nota, setNota] = useState(null); const [erroNota, setErroNota] = useState('');
  if (!pet) return <Pagina><Vazio texto="Pet não encontrado para esta conta." /></Pagina>;
  const servicos = servicosDoDia(dados.servicos, pet.id, data);
  const fotos = dados.fotos.filter(item => item.petId === pet.id && item.data === data);
  const notas = dados.notas.filter(item => item.petId === pet.id && item.data === data);
  const datas = [...new Set([...dados.servicos, ...dados.fotos, ...dados.notas].filter(v => v.petId === pet.id).map(v => v.data))].sort().reverse();
  const anos = [...new Set(datas.map(d => d.slice(0, 4)))];
  const meses = [...new Set(datas.filter(d => d.startsWith(`${ano}-`)).map(d => d.slice(5, 7)))];
  const dias = datas.filter(d => d.startsWith(`${ano}-${mes}-`));
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const cardPeriodo = (chave, titulo, onPress) => <Pressable key={chave} accessibilityRole="button" accessibilityLabel={titulo} onPress={onPress}><Card><View style={s.row}><Ionicons name="calendar-outline" size={26} color={cores.verde} /><Text style={[s.heading, { flex: 1 }]}>{titulo}</Text><Ionicons name="chevron-forward" size={22} color={cores.verde} /></View></Card></Pressable>;
  async function abrirNota() {
    try {
      const uri = nota.url || nota.uri;
      if (Platform.OS === 'web') { const link = document.createElement('a'); link.href = uri; link.download = nota.nome || 'nota'; document.body.appendChild(link); link.click(); link.remove(); }
      else if (uri.startsWith('http')) await Linking.openURL(uri);
      else if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: nota.mime, dialogTitle: 'Nota fiscal' });
      else throw new Error('Compartilhamento indisponível');
    }
    catch { setErroNota('Não foi possível abrir o arquivo da nota fiscal.'); }
  }
  return <Pagina><Titulo subtitulo="Cada cuidado, acompanhado por você.">{pet.nome}</Titulo>
    <Card><Text style={s.heading}>Dados do pet</Text><Linha label="Nome" valor={pet.nome} /><Linha label="Data de cadastro" valor={formatarData(pet.dataCadastro)} /><Linha label="Raça" valor={pet.raca} /><View style={s.row}><Linha label="Idade" valor={pet.idade} /><Linha label="Peso" valor={pet.peso} /></View><Linha label="Espécie" valor={pet.especie} /><Linha label="Observações" valor={pet.observacoes} /></Card>
    <Titulo subtitulo="Selecione o ano, o mês e o dia do atendimento.">Histórico de serviços</Titulo>
    {!datas.length && <Vazio texto="Este pet ainda não possui serviços registrados." />}
    {ano && <Botao secundario titulo="Voltar aos anos" onPress={() => { setAno(null); setMes(null); setData(null); setServico(null); }} />}
    {mes && <Botao secundario titulo={`Voltar aos meses de ${ano}`} onPress={() => { setMes(null); setData(null); setServico(null); }} />}
    {data && <Botao secundario titulo="Voltar aos dias" onPress={() => { setData(null); setServico(null); }} />}
    {!ano && anos.map(valor => cardPeriodo(valor, valor, () => { setAno(valor); setMes(null); setData(null); }))}
    {ano && !mes && <><Text style={[s.heading, { marginBottom: 16 }]}>{ano}</Text>{meses.map(valor => cardPeriodo(valor, nomesMeses[Number(valor) - 1], () => { setMes(valor); setData(null); }))}</>}
    {ano && mes && !data && <><Text style={[s.heading, { marginBottom: 16 }]}>{nomesMeses[Number(mes) - 1]} de {ano}</Text>{dias.map(valor => cardPeriodo(valor, formatarData(valor), () => setData(valor)))}</>}
    {data && <Text style={[s.heading, { marginBottom: 16 }]}>Serviços de {formatarData(data)}</Text>}
    {servicos.map(item => <Pressable key={item.id} accessibilityRole="button" onPress={() => setServico(item)}><Card><View style={s.row}><Text style={s.label}>{item.hora} · {item.tipo}</Text><Text style={{ color: item.status === 'Em andamento' ? '#A16C10' : cores.verde, fontWeight: '700' }}>{item.status}</Text></View><Text style={s.heading}>{item.titulo}</Text><Text style={s.muted}>{item.detalhes}</Text><Text style={{ color: cores.verde, fontWeight: '700', marginTop: 6 }}>Ver detalhes →</Text></Card></Pressable>)}
    {data && <>
      <Titulo>Fotos</Titulo>
      {!fotos.length && <Vazio icon="images-outline" texto="Nenhuma foto registrada para este dia." />}
      {fotos.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel="Ampliar foto" onPress={() => setFoto(item)}><Card><Foto uri={item.url || item.uri} /><Text style={s.heading}>{item.legenda}</Text><Text style={s.muted}>{item.hora} · Toque para ampliar</Text></Card></Pressable>)}
      <Titulo>Nota fiscal</Titulo>
      {!notas.length && <Vazio icon="document-text-outline" texto="Nenhuma nota fiscal disponível para este dia." />}
      {notas.map(item => <Pressable key={item.id} accessibilityRole="button" onPress={() => { setNota(item); setErroNota(''); }}><Card><View style={s.row}><Ionicons name="document-text-outline" size={26} color={cores.verde} /><Text style={[s.heading, { flex: 1 }]}>Nota {item.numero}</Text><Ionicons name="chevron-forward" size={22} color={cores.verde} /></View><Text style={s.muted}>{item.descricao}</Text></Card></Pressable>)}
    </>}
    <Caixa titulo="Foto do atendimento" visible={!!foto} onClose={() => setFoto(null)}>{foto && <><Foto key={foto.id} uri={foto.url || foto.uri} grande /><Linha label="Descrição" valor={foto.legenda} /><Linha label="Registro" valor={`${formatarData(foto.data)} às ${foto.hora}`} /></>}</Caixa>
    <Caixa titulo="Nota fiscal" visible={!!nota} onClose={() => setNota(null)}>{nota && <><Linha label="Número" valor={nota.numero} /><Linha label="Data" valor={formatarData(nota.data)} /><Linha label="Descrição" valor={nota.descricao} />{nota.mime?.startsWith('image/') && <Foto uri={nota.url || nota.uri} grande />}<Erro texto={erroNota} /><Botao titulo="Abrir documento da nota" onPress={abrirNota} /></>}</Caixa>
    <Caixa titulo={servico?.titulo || 'Detalhes'} visible={!!servico} onClose={() => setServico(null)}>{servico && <><Linha label="Data e horário" valor={`${formatarData(servico.data)} às ${servico.hora}`} /><Linha label="Situação" valor={servico.status} /><Linha label="O que foi realizado" valor={servico.detalhes} /><Linha label="Profissional" valor={servico.profissional} />{servico.tipo === 'Vacina' && <><Linha label="Nome da vacina" valor={servico.vacina} /><Linha label="Fabricante" valor={servico.fabricante} /><Linha label="Lote" valor={servico.lote} /><Linha label="Próxima vacina" valor={formatarData(servico.proxima)} /></>}</>}</Caixa>
  </Pagina>;
}
export function Conta() {
  const { usuario, sair } = usePets();
  return <Pagina><Titulo>Minha conta</Titulo><Card><Linha label="Nome" valor={usuario.nome} /><Linha label="E-mail" valor={usuario.email} /><Linha label="Perfil" valor={usuario.papel === 'clinica' ? 'Equipe da clínica' : 'Tutor'} /></Card><RecursosConta /><Card><Text style={s.heading}>Precisa de ajuda?</Text><Text style={s.muted}>Solicite à clínica a correção dos dados, informações sobre os procedimentos ou uma nova senha.</Text></Card><Botao titulo="Sair da conta" onPress={sair} /></Pagina>;
}
