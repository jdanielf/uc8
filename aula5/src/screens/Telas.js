import { useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import usePets from '../context/PetContext';
import { Botao, Campo, Pagina, Titulo, Card, Vazio, Caixa, Linha, Escolhas, cores, s } from '../components/UI';
import { dataISO, formatarData, hoje, petsDoCliente, servicosDoDia } from '../utils/domain.cjs';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const urlValida = valor => /^https:\/\/[^\s]+$/i.test(valor.trim());
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
    <Card><Titulo subtitulo="Use o e-mail cadastrado na clínica e a senha recebida por e-mail.">Bem-vindo</Titulo>
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
  const pets = usuario.papel === 'clinica' ? dados.pets : petsDoCliente(dados.pets, usuario.email);
  return <Pagina><Titulo subtitulo="Selecione um pet para ver sua ficha e acompanhar o atendimento.">Olá, {usuario.nome}!</Titulo>
    {pets.length === 0 && <Vazio texto="A clínica ainda não cadastrou um pet para este e-mail." />}
    {pets.map(pet => <Pressable accessibilityRole="button" accessibilityLabel={`Acompanhar ${pet.nome}`} key={pet.id} onPress={() => navigation.navigate('Pet', { petId: pet.id })}><Card><View style={s.row}><View style={{ flex: 1 }}><Ionicons name="paw" size={30} color={cores.verde} /><Text style={[s.heading, { marginTop: 8 }]}>{pet.nome}</Text><Text style={s.muted}>{pet.especie} · {pet.raca}</Text><Text style={s.muted}>Ver dados e serviços do dia</Text></View><Ionicons name="chevron-forward" size={24} color={cores.verde} /></View></Card></Pressable>)}
  </Pagina>;
}
export function PetDetalhes({ route }) {
  const { dados, usuario } = usePets();
  const pet = dados.pets.find(p => p.id === route.params.petId && (usuario.papel === 'clinica' || p.email === usuario.email));
  const [data, setData] = useState(hoje()); const [digitada, setDigitada] = useState(formatarData(hoje()));
  const [erro, setErro] = useState(''); const [servico, setServico] = useState(null); const [foto, setFoto] = useState(null); const [nota, setNota] = useState(null);
  if (!pet) return <Pagina><Vazio texto="Pet não encontrado para esta conta." /></Pagina>;
  const servicos = servicosDoDia(dados.servicos, pet.id, data);
  const fotos = dados.fotos.filter(f => f.petId === pet.id && f.data === data);
  const notas = dados.notas.filter(n => n.petId === pet.id && n.data === data);
  const datas = [...new Set([...dados.servicos, ...dados.fotos, ...dados.notas].filter(v => v.petId === pet.id).map(v => v.data))].sort().reverse();
  async function abrirNota() { try { await Linking.openURL(nota.url); } catch { setErro('Não foi possível abrir o arquivo da nota. Confira o link com a clínica.'); setNota(null); } }
  return <Pagina><Titulo subtitulo="Cada cuidado, acompanhado por você.">{pet.nome}</Titulo>
    <Card><Text style={s.heading}>Dados do pet</Text><Linha label="Nome" valor={pet.nome} /><Linha label="Raça" valor={pet.raca} /><View style={s.row}><Linha label="Idade" valor={pet.idade} /><Linha label="Peso" valor={pet.peso} /></View><Linha label="Espécie" valor={pet.especie} /><Linha label="Observações" valor={pet.observacoes} /></Card>
    <Titulo subtitulo="Escolha o dia que deseja visualizar.">Serviços do dia</Titulo>
    <Card><Campo label="Data (DD/MM/AAAA)" value={digitada} onChangeText={setDigitada} placeholder="02/10/2026" maxLength={10} /><Botao titulo="Visualizar dia" onPress={() => { const valor = dataISO(digitada); if (!valor) { setErro('Informe uma data válida no formato DD/MM/AAAA.'); return; } setErro(''); setData(valor); }} /><Botao secundario titulo="Hoje" onPress={() => { setData(hoje()); setDigitada(formatarData(hoje())); setErro(''); }} /><Erro texto={erro} />
      <Text style={s.label}>Dias com registros</Text><View style={s.wrap}>{datas.map(d => <Botao key={d} secundario titulo={formatarData(d)} onPress={() => { setData(d); setDigitada(formatarData(d)); setErro(''); }} />)}</View>
    </Card><Text style={[s.heading, { marginBottom: 16 }]}>{formatarData(data)}</Text>
    {!servicos.length && <Vazio icon="calendar-outline" texto="Nenhum serviço registrado para este dia." />}
    {servicos.map(item => <Pressable key={item.id} accessibilityRole="button" onPress={() => setServico(item)}><Card><View style={s.row}><Text style={s.label}>{item.hora} · {item.tipo}</Text><Text style={{ color: item.status === 'Em andamento' ? '#A16C10' : cores.verde, fontWeight: '700' }}>{item.status}</Text></View><Text style={s.heading}>{item.titulo}</Text><Text style={s.muted}>{item.detalhes}</Text><Text style={{ color: cores.verde, fontWeight: '700', marginTop: 6 }}>Ver detalhes →</Text></Card></Pressable>)}
    <Titulo subtitulo="Fotos publicadas pela clínica durante os cuidados deste dia.">Fotos</Titulo>
    {!fotos.length && <Vazio icon="images-outline" texto="A clínica ainda não publicou fotos para este dia." />}
    {fotos.map(item => <Pressable key={item.id} accessibilityRole="button" onPress={() => setFoto(item)}><Card><Foto uri={item.url} /><Text style={s.heading}>{item.legenda}</Text><Text style={s.muted}>{item.hora} · Toque para ampliar</Text></Card></Pressable>)}
    <Titulo subtitulo="Documentos dos serviços realizados, disponibilizados pela clínica.">Nota fiscal</Titulo>
    {!notas.length && <Vazio icon="document-text-outline" texto="Nenhuma nota fiscal disponível para este dia." />}
    {notas.map(item => <Botao key={item.id} secundario titulo={`Nota ${item.numero} · Ver documento`} onPress={() => setNota(item)} />)}
    <Caixa titulo={servico?.titulo || 'Detalhes'} visible={!!servico} onClose={() => setServico(null)}>{servico && <><Linha label="Data e horário" valor={`${formatarData(servico.data)} às ${servico.hora}`} /><Linha label="Situação" valor={servico.status} /><Linha label="O que foi realizado" valor={servico.detalhes} /><Linha label="Profissional" valor={servico.profissional} />{servico.tipo === 'Vacina' && <><Linha label="Nome da vacina" valor={servico.vacina} /><Linha label="Fabricante" valor={servico.fabricante} /><Linha label="Lote" valor={servico.lote} /><Linha label="Próxima vacina" valor={formatarData(servico.proxima)} /></>}</>}</Caixa>
    <Caixa titulo="Evolução do procedimento" visible={!!foto} onClose={() => setFoto(null)}>{foto && <><Foto key={foto.id} uri={foto.url} grande /><Linha label="Descrição" valor={foto.legenda} /><Linha label="Registro" valor={`${formatarData(foto.data)} às ${foto.hora}`} /></>}</Caixa>
    <Caixa titulo="Nota fiscal" visible={!!nota} onClose={() => setNota(null)}>{nota && <><Linha label="Número" valor={nota.numero} /><Linha label="Data" valor={formatarData(nota.data)} /><Linha label="Descrição" valor={nota.descricao} /><Botao titulo="Abrir documento da nota" onPress={abrirNota} /></>}</Caixa>
  </Pagina>;
}
export function Conta() {
  const { usuario, sair } = usePets();
  return <Pagina><Titulo>Minha conta</Titulo><Card><Linha label="Nome" valor={usuario.nome} /><Linha label="E-mail" valor={usuario.email} /><Linha label="Perfil" valor={usuario.papel === 'clinica' ? 'Equipe da clínica' : 'Tutor'} /></Card><Card><Text style={s.heading}>Precisa de ajuda?</Text><Text style={s.muted}>Solicite à clínica a correção dos dados, informações sobre os procedimentos ou uma nova senha.</Text></Card><Botao titulo="Sair da conta" onPress={sair} /></Pagina>;
}
const novo = () => ({ data: formatarData(hoje()), hora: '09:00', tipo: 'Banho', status: 'Agendado' });
export function Clinica() {
  const { dados, usuario, cadastrar, alterar, erro: erroStorage } = usePets();
  const [aba, setAba] = useState('Serviços'); const [petId, setPetId] = useState(dados.pets[0]?.id || '');
  const [form, setForm] = useState(novo()); const [erro, setErro] = useState(''); const [mensagem, setMensagem] = useState('');
  if (usuario.papel !== 'clinica') return <Pagina><Vazio texto="Área exclusiva da clínica." /></Pagina>;
  const campo = (chave, label, props = {}) => <Campo label={label} value={form[chave] || ''} onChangeText={valor => setForm(f => ({ ...f, [chave]: valor }))} {...props} />;
  function mudarAba(valor) { setAba(valor); setForm(novo()); setErro(''); setMensagem(''); }
  function salvar() {
    setErro(''); setMensagem('');
    if (erroStorage) { setErro(erroStorage); return; }
    if (aba === 'Cadastro') {
      const email = (form.email || '').trim().toLowerCase();
      if (!form.tutor?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !form.nome?.trim() || !form.raca?.trim() || !form.idade?.trim()) { setErro('Preencha tutor, e-mail válido, nome do pet, raça e idade.'); return; }
      const existe = dados.clientes.find(c => c.email === email);
      if (!existe && (form.senha || '').length < 6) { setErro('Defina uma senha demonstrativa com pelo menos 6 caracteres.'); return; }
      const pet = { id: id(), nome: form.nome.trim(), raca: form.raca.trim(), idade: form.idade.trim(), peso: form.peso, especie: form.especie || 'Cachorro', observacoes: form.observacoes, email };
      cadastrar({ nome: form.tutor.trim(), email, senha: form.senha }, pet); setPetId(pet.id); setForm(novo());
      setMensagem(existe ? 'Pet cadastrado no acesso existente do tutor.' : 'Tutor e pet cadastrados localmente. A senha NÃO foi enviada por e-mail; use os dados cadastrados para testar neste aparelho.'); return;
    }
    const data = dataISO(form.data || '');
    if (!dados.pets.some(p => p.id === petId) || !data) { setErro('Selecione um pet e informe uma data válida.'); return; }
    const item = { ...form, id: form.id || id(), petId, data };
    if (aba === 'Serviços') {
      if (!form.titulo?.trim() || !form.detalhes?.trim() || !form.profissional?.trim() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.hora || '')) { setErro('Preencha título, descrição, profissional e horário válido (HH:MM).'); return; }
      if (form.tipo === 'Vacina') {
        if (!form.vacina?.trim() || !form.lote?.trim() || !form.fabricante?.trim() || !dataISO(form.proxima || '')) { setErro('Preencha nome, lote, fabricante e a data da próxima vacina.'); return; }
        item.proxima = dataISO(form.proxima);
        if (item.proxima <= data) { setErro('A próxima vacina deve ter uma data posterior ao atendimento.'); return; }
      }
      alterar('servicos', item);
    } else {
      if (!urlValida(form.url || '')) { setErro('Informe um link HTTPS válido do arquivo.'); return; }
      item.url = form.url.trim();
      if (aba === 'Fotos') {
        if (!form.legenda?.trim() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.hora || '')) { setErro('Informe a descrição da foto e um horário válido.'); return; }
        alterar('fotos', item);
      } else {
        if (!form.numero?.trim() || !form.descricao?.trim()) { setErro('Informe número e descrição da nota fiscal.'); return; }
        alterar('notas', item);
      }
    }
    setForm(novo()); setMensagem('Registro salvo nesta sessão. Confira o acompanhamento do pet.');
  }
  const registros = aba === 'Cadastro' ? [] : dados[aba === 'Serviços' ? 'servicos' : aba === 'Fotos' ? 'fotos' : 'notas'].filter(v => v.petId === petId).sort((a, b) => b.data.localeCompare(a.data));
  return <Pagina><Titulo subtitulo="Cadastre tutores e publique os cuidados de cada pet.">Área da clínica</Titulo><Escolhas valores={['Cadastro', 'Serviços', 'Fotos', 'Nota fiscal']} value={aba} onChange={mudarAba} />
    {aba !== 'Cadastro' && <Card><Text style={s.heading}>Selecione o pet</Text><View style={s.wrap}>{dados.pets.map(p => <Botao key={p.id} secundario={petId !== p.id} titulo={`${p.nome} · ${p.email}`} onPress={() => { setPetId(p.id); setForm(novo()); setErro(''); setMensagem(''); }} />)}</View></Card>}
    <Card><Text style={s.heading}>{form.id ? 'Editar registro' : `Novo registro · ${aba}`}</Text>
      {aba === 'Cadastro' ? <>{campo('tutor', 'Nome do tutor')}{campo('email', 'E-mail cadastrado na clínica', { autoCapitalize: 'none', keyboardType: 'email-address' })}{campo('senha', 'Senha para avaliação local', { secureTextEntry: true })}<Text style={s.muted}>Para e-mail já cadastrado, a senha existente será mantida.</Text>{campo('nome', 'Nome do pet')}{campo('especie', 'Espécie', { placeholder: 'Cachorro, gato…' })}{campo('raca', 'Raça')}{campo('idade', 'Idade')}{campo('peso', 'Peso')}{campo('observacoes', 'Observações', { multiline: true })}</> : <>
        {campo('data', 'Data (DD/MM/AAAA)', { maxLength: 10 })}
        {aba === 'Serviços' ? <><Text style={s.label}>Tipo de serviço</Text><Escolhas valores={['Avaliação', 'Vacina', 'Banho', 'Tosa', 'Consulta', 'Outros']} value={form.tipo} onChange={tipo => setForm(f => ({ ...f, tipo }))} />{campo('titulo', 'Nome do procedimento')}{campo('hora', 'Horário (HH:MM)', { maxLength: 5 })}<Escolhas valores={['Agendado', 'Em andamento', 'Concluído']} value={form.status} onChange={status => setForm(f => ({ ...f, status }))} />{campo('detalhes', 'O que foi realizado / evolução', { multiline: true })}{campo('profissional', 'Profissional responsável')}{form.tipo === 'Vacina' && <>{campo('vacina', 'Nome da vacina')}{campo('fabricante', 'Fabricante')}{campo('lote', 'Lote')}{campo('proxima', 'Próxima vacina (DD/MM/AAAA)', { maxLength: 10 })}</>}</> : <>
          {campo('url', aba === 'Fotos' ? 'Link HTTPS da imagem' : 'Link HTTPS da nota fiscal (PDF ou imagem)', { autoCapitalize: 'none', keyboardType: 'url' })}<Text style={s.muted}>Nesta versão, insira o link de um arquivo já hospedado. O envio direto de arquivos será integrado posteriormente.</Text>
          {aba === 'Fotos' ? <>{campo('hora', 'Horário (HH:MM)', { maxLength: 5 })}{campo('legenda', 'Descrição da evolução', { multiline: true })}</> : <>{campo('numero', 'Número da nota fiscal')}{campo('descricao', 'Descrição dos serviços', { multiline: true })}</>}
        </>}
      </>}
      <Erro texto={erro} />{mensagem ? <Text accessibilityRole="alert" style={{ color: cores.verde, marginVertical: 10 }}>{mensagem}</Text> : null}<Botao disabled={!!erroStorage} titulo={form.id ? 'Salvar alterações' : 'Salvar registro'} onPress={salvar} />{form.id && <Botao secundario titulo="Cancelar edição" onPress={() => setForm(novo())} />}
    </Card>
    {registros.map(item => <Card key={item.id}><Text style={s.heading}>{item.titulo || item.legenda || `Nota ${item.numero}`}</Text><Text style={s.muted}>{formatarData(item.data)} {item.status ? `· ${item.status}` : ''}</Text><Botao secundario titulo="Editar registro" onPress={() => { setForm({ ...item, data: formatarData(item.data), proxima: item.proxima ? formatarData(item.proxima) : '' }); setErro(''); setMensagem(''); }} /></Card>)}
  </Pagina>;
}
