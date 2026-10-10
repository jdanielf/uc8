import { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import usePets from '../context/PetContext';
import { consultarCep } from '../services/cep';
import { hoje, dataISO, formatarData, servicosDoDia } from '../utils/domain.cjs';
import { Botao, Campo, Card, Caixa, Escolhas, Pagina, Titulo, Vazio, s } from '../components/UI';
const tipos = ['Vacina', 'Banho', 'Tosa', 'Consulta', 'Avaliação', 'Outros'];
const status = ['Agendado', 'Em andamento', 'Concluído'];
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const novoServico = () => ({ tipo: 'Banho', titulo: '', hora: '10:00', status: 'Agendado', detalhes: '', profissional: '', vacina: '', lote: '', fabricante: '', proxima: '' });
const novoCadastro = () => ({ nome: '', email: '', senha: '', pet: '', especie: 'Cachorro', raca: '', idade: '', peso: '', observacoes: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '' });
async function guardarArquivo(asset) {
  if (Platform.OS === 'web') {
    const blob = asset.file || await (await fetch(asset.uri)).blob();
    return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
  }
  const pasta = `${FileSystem.documentDirectory}petcare/`;
  await FileSystem.makeDirectoryAsync(pasta, { intermediates: true });
  const extensao = (asset.fileName || asset.name || asset.uri).split('.').pop().split('?')[0];
  const destino = `${pasta}${id()}.${/^[a-z0-9]{1,5}$/i.test(extensao) ? extensao : 'bin'}`;
  await FileSystem.copyAsync({ from: asset.uri, to: destino }); return destino;
}
export default function Clinica() {
  const { dados, usuario, alterar, cadastrar, erro: erroDados } = usePets();
  const [petId, setPetId] = useState(dados.pets[0]?.id || ''); const [data, setData] = useState(formatarData(hoje()));
  const [modal, setModal] = useState(null); const [form, setForm] = useState(novoServico()); const [cadastro, setCadastro] = useState(novoCadastro());
  const [legenda, setLegenda] = useState(''); const [horaFoto, setHoraFoto] = useState('10:00');
  const [nota, setNota] = useState({ numero: '', valor: '', descricao: '' }); const [mensagem, setMensagem] = useState(''); const [ocupado, setOcupado] = useState(false); const [acesso, setAcesso] = useState(null);
  if (usuario.papel !== 'clinica') return <Pagina><Vazio texto="Área exclusiva da clínica." /></Pagina>;
  const pet = dados.pets.find(p => p.id === petId); const dia = dataISO(data); const lista = dia ? servicosDoDia(dados.servicos, petId, dia) : [];
  const campo = (key, valor) => setForm(f => ({ ...f, [key]: valor })); const campoCadastro = (key, valor) => setCadastro(f => ({ ...f, [key]: valor }));
  function validarDia() { if (erroDados) { setMensagem(erroDados); return false; } if (!pet || !dia) { setMensagem('Selecione um pet e informe uma data válida (DD/MM/AAAA).'); return false; } return true; }
  function abrir(tipo) { setMensagem(''); if (tipo !== 'cadastro' && !validarDia()) return; setModal(tipo); }
  async function buscarCep() {
    if (ocupado) return;
    const cepConsultado = cadastro.cep;
    setOcupado(true); setMensagem('');
    try {
      const endereco = await consultarCep(cepConsultado);
      setCadastro(atual => atual.cep === cepConsultado ? { ...atual, ...endereco } : atual);
      setMensagem('Endereço consultado. Confira e informe o número.');
    } catch (e) { setMensagem(e.message); } finally { setOcupado(false); }
  }
  async function salvarServico() {
    if (ocupado || !validarDia()) return;
    if (!form.titulo.trim() || !form.profissional.trim() || !form.detalhes.trim() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.hora)) return setMensagem('Preencha título, profissional, detalhes e horário válido (HH:MM).');
    if (form.tipo === 'Vacina' && !form.vacina.trim()) return setMensagem('Informe o nome da vacina.');
    const proxima = form.proxima.trim() ? dataISO(form.proxima) : null;
    if (form.tipo === 'Vacina' && form.proxima.trim() && (!proxima || proxima <= dia)) return setMensagem('A próxima vacina deve ter uma data válida posterior ao atendimento.');
    setOcupado(true);
    try { await alterar('servicos', { ...form, id: form.id || id(), petId, data: dia, proxima: form.tipo === 'Vacina' ? proxima : null }); setModal(null); setMensagem('Serviço salvo. Aviso registrado para o tutor.'); } catch (e) { setMensagem(e.message || 'Não foi possível salvar.'); } finally { setOcupado(false); }
  }
  async function salvarCadastro() {
    if (ocupado) return;
    if (erroDados) return setMensagem(erroDados);
    const email = cadastro.email.trim().toLowerCase(); const existente = dados.clientes.find(c => c.email === email);
    if (!cadastro.nome.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !cadastro.pet.trim() || !cadastro.raca.trim() || !cadastro.idade.trim()) return setMensagem('Preencha tutor, e-mail válido, nome do pet, raça e idade.');
    if (email === 'clinica@petcare.com') return setMensagem('Use o e-mail do cliente, diferente do acesso da clínica.');
    if (!existente && cadastro.senha.length < 6) return setMensagem('Defina uma senha de demonstração com pelo menos 6 caracteres.');
    const cliente = existente || { nome: cadastro.nome.trim(), email, senha: cadastro.senha, endereco: { cep: cadastro.cep, rua: cadastro.rua, numero: cadastro.numero, bairro: cadastro.bairro, cidade: cadastro.cidade, uf: cadastro.uf } };
    const novoPet = { id: id(), nome: cadastro.pet.trim(), especie: cadastro.especie, raca: cadastro.raca.trim(), idade: cadastro.idade.trim(), peso: cadastro.peso.trim(), observacoes: cadastro.observacoes.trim(), email };
    setOcupado(true);
    try { await cadastrar(cliente, novoPet); setPetId(novoPet.id); setModal(null);
    setAcesso({ email, senha: existente ? null : cliente.senha }); setMensagem(existente ? 'Pet vinculado ao cliente existente. A senha atual foi mantida.' : 'Cadastro criado neste aparelho. Nenhum e-mail foi enviado nesta demonstração.'); } catch (e) { setMensagem(e.message || 'Não foi possível cadastrar.'); } finally { setOcupado(false); }
  }
  async function anexarFoto() {
    if (ocupado || !validarDia()) return;
    if (!legenda.trim() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaFoto)) return setMensagem('Informe uma legenda e um horário válido para a foto.');
    setOcupado(true);
    try { const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: .7 }); if (!resultado.canceled) { const uri = await guardarArquivo(resultado.assets[0]); await alterar('fotos', { id: id(), petId, data: dia, hora: horaFoto, legenda: legenda.trim(), uri }); setModal(null); setMensagem('Foto adicionada ao acompanhamento do pet.'); } } catch { setMensagem('Não foi possível anexar a foto. Tente novamente.'); } finally { setOcupado(false); }
  }
  async function anexarNota() {
    if (ocupado || !validarDia()) return;
    const valor = Number(nota.valor.trim().replace(',', '.'));
    if (!nota.numero.trim() || !nota.descricao.trim() || !nota.valor.trim() || !Number.isFinite(valor) || valor < 0) return setMensagem('Informe número, descrição e um valor válido (ex.: 150,00).');
    setOcupado(true);
    try { const resultado = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true }); if (!resultado.canceled) { const asset = resultado.assets[0]; if (asset.size > 10 * 1024 * 1024) { setMensagem('Selecione uma nota com até 10 MB.'); return; } const uri = await guardarArquivo(asset); await alterar('notas', { id: id(), petId, data: dia, ...nota, valor, nome: asset.name, mime: asset.mimeType || 'application/pdf', uri }); setModal(null); setMensagem('Nota fiscal anexada ao dia selecionado.'); } } catch { setMensagem('Não foi possível anexar a nota fiscal. Tente novamente.'); } finally { setOcupado(false); }
  }
  return <Pagina><Titulo subtitulo="Registre os cuidados e atualize o acompanhamento dos tutores.">Área da clínica</Titulo><Botao titulo="Cadastrar cliente e pet" onPress={() => { setCadastro(novoCadastro()); abrir('cadastro'); }} />{acesso && <Card><Text style={s.heading}>Acesso do cadastro demonstrativo</Text><Text style={s.body}>E-mail: {acesso.email}</Text>{acesso.senha && <Text style={s.body}>Senha: {acesso.senha}</Text>}<Text style={s.muted}>Use esses dados para testar o login neste aparelho.</Text><Botao titulo="Ocultar dados de acesso" secundario onPress={() => setAcesso(null)} /></Card>}{mensagem ? <Text accessibilityRole="alert" style={[s.body, { marginVertical: 12 }]}>{mensagem}</Text> : null}<Caixa titulo={{ servico: 'Registrar serviço', cadastro: 'Cadastrar cliente e pet', foto: 'Foto da evolução', nota: 'Anexar nota fiscal' }[modal] || ''} visible={!!modal} onClose={() => { if (!ocupado) setModal(null); }}>
    {modal === 'servico' && <><Text style={s.label}>TIPO DE SERVIÇO</Text><Escolhas valores={tipos} value={form.tipo} onChange={v => campo('tipo', v)} /><Campo label="Título do serviço" value={form.titulo} onChangeText={v => campo('titulo', v)} /><Campo label="Horário (HH:MM)" value={form.hora} onChangeText={v => campo('hora', v)} /><Text style={s.label}>ANDAMENTO</Text><Escolhas valores={status} value={form.status} onChange={v => campo('status', v)} /><Campo label="Profissional responsável" value={form.profissional} onChangeText={v => campo('profissional', v)} /><Campo label="O que foi feito / detalhes adicionais" multiline value={form.detalhes} onChangeText={v => campo('detalhes', v)} />{form.tipo === 'Vacina' && <><Campo label="Nome da vacina" value={form.vacina} onChangeText={v => campo('vacina', v)} /><Campo label="Fabricante" value={form.fabricante} onChangeText={v => campo('fabricante', v)} /><Campo label="Lote" value={form.lote} onChangeText={v => campo('lote', v)} /><Campo label="Próxima vacina (DD/MM/AAAA, opcional)" value={form.proxima} onChangeText={v => campo('proxima', v)} /></>}<Botao disabled={ocupado} titulo={ocupado ? "Salvando..." : "Salvar serviço"} onPress={salvarServico} /><Text style={[s.heading, { marginVertical: 20 }]}>Serviços registrados</Text>{lista.map(item => <Card key={item.id}><Text style={s.heading}>{item.titulo}</Text><Text style={s.muted}>{item.hora} • {item.status}</Text><Botao titulo="Editar detalhes e andamento" secundario onPress={() => { setForm({ ...item, proxima: item.proxima ? formatarData(item.proxima) : '' }); abrir('servico'); }} /></Card>)}{!lista.length && <Vazio texto="Nenhum serviço para o pet e a data selecionados." />}</>}
    {modal === 'cadastro' && <><Campo label="Nome do tutor" value={cadastro.nome} onChangeText={v => campoCadastro('nome', v)} /><Campo label="E-mail cadastrado na clínica" autoCapitalize="none" keyboardType="email-address" value={cadastro.email} onChangeText={v => campoCadastro('email', v)} /><Campo label="Senha demonstrativa (novo cliente)" secureTextEntry value={cadastro.senha} onChangeText={v => campoCadastro('senha', v)} /><Text style={[s.muted, { marginBottom: 16 }]}>Se o e-mail já existe, o pet será vinculado ao cliente e a senha atual será mantida.</Text><Text style={s.heading}>Endereço do tutor (opcional)</Text><Campo label="CEP" keyboardType="number-pad" value={cadastro.cep} onChangeText={v => campoCadastro('cep', v)} /><Botao disabled={ocupado} secundario titulo={ocupado ? 'Aguarde...' : 'Consultar CEP'} onPress={buscarCep} />{['rua', 'numero', 'bairro', 'cidade', 'uf'].map(k => <Campo key={k} label={{ rua: 'Rua', numero: 'Número', bairro: 'Bairro', cidade: 'Cidade', uf: 'UF' }[k]} value={cadastro[k]} onChangeText={v => campoCadastro(k, v)} />)}<Text style={s.muted}>Sem internet, preencha manualmente. O endereço é salvo com o novo tutor.</Text><Campo label="Nome do pet" value={cadastro.pet} onChangeText={v => campoCadastro('pet', v)} /><Escolhas valores={['Cachorro', 'Gato', 'Outro']} value={cadastro.especie} onChange={v => campoCadastro('especie', v)} /><Campo label="Raça" value={cadastro.raca} onChangeText={v => campoCadastro('raca', v)} /><Campo label="Idade (ex.: 3 anos)" value={cadastro.idade} onChangeText={v => campoCadastro('idade', v)} /><Campo label="Peso (opcional)" value={cadastro.peso} onChangeText={v => campoCadastro('peso', v)} /><Campo label="Observações (opcional)" multiline value={cadastro.observacoes} onChangeText={v => campoCadastro('observacoes', v)} /><Botao disabled={ocupado} titulo={ocupado ? "Salvando..." : "Salvar cadastro demonstrativo"} onPress={salvarCadastro} /></>}
    {modal === 'foto' && <><Campo label="Legenda / procedimento em evolução" multiline value={legenda} onChangeText={setLegenda} /><Campo label="Horário (HH:MM)" value={horaFoto} onChangeText={setHoraFoto} /><Botao titulo={ocupado ? 'Salvando...' : 'Selecionar foto e salvar'} disabled={ocupado} onPress={anexarFoto} /></>}
    {modal === 'nota' && <><Campo label="Número da nota fiscal" value={nota.numero} onChangeText={v => setNota(n => ({ ...n, numero: v }))} /><Campo label="Valor total em reais (ex.: 150,00)" keyboardType="decimal-pad" value={nota.valor} onChangeText={v => setNota(n => ({ ...n, valor: v }))} /><Campo label="Serviços realizados" multiline value={nota.descricao} onChangeText={v => setNota(n => ({ ...n, descricao: v }))} /><Text style={s.muted}>Anexe a nota emitida pela clínica, em PDF ou imagem (até 10 MB).</Text><Botao titulo={ocupado ? 'Salvando...' : 'Selecionar nota e salvar'} disabled={ocupado} onPress={anexarNota} /></>}{mensagem ? <Text accessibilityRole="alert" style={s.body}>{mensagem}</Text> : null}
  </Caixa></Pagina>;
}
