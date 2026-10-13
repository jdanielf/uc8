import { useState } from 'react';
import { Text } from 'react-native';
import usePets from '../context/PetContext';
import { consultarCep } from '../services/cep';
import { Botao, Campo, Card, Caixa, Escolhas, Pagina, Titulo, Vazio, s } from '../components/UI';
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const novoCadastro = () => ({ nome: '', email: '', senha: '', pet: '', especie: 'Cachorro', outraEspecie: '', raca: '', idade: '', peso: '', observacoes: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '' });
export default function Clinica() {
  const { dados, usuario, cadastrar, redefinirSenha, erro: erroDados } = usePets();
  const [modal, setModal] = useState(null); const [cadastro, setCadastro] = useState(novoCadastro());
  const [mensagem, setMensagem] = useState(''); const [ocupado, setOcupado] = useState(false); const [acesso, setAcesso] = useState(null);
  const [buscaTutor, setBuscaTutor] = useState(''); const [emailTutor, setEmailTutor] = useState(''); const [novaSenha, setNovaSenha] = useState(''); const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  if (usuario.papel !== 'clinica') return <Pagina><Vazio texto="Área exclusiva da clínica." /></Pagina>;
  const campoCadastro = (key, valor) => setCadastro(f => ({ ...f, [key]: valor }));
  function abrir(tipo) { setMensagem(''); setModal(tipo); }
  async function salvarSenha() {
    if (ocupado) return;
    if (!emailTutor) return setMensagem('Selecione o tutor.');
    if (novaSenha !== confirmacaoSenha) return setMensagem('As senhas não coincidem.');
    setOcupado(true); setMensagem('');
    try {
      await redefinirSenha(emailTutor, novaSenha);
      setNovaSenha(''); setConfirmacaoSenha(''); setAcesso(null); setModal(null);
      setMensagem('Senha redefinida neste aparelho. Informe a nova senha ao tutor; nenhum e-mail foi enviado.');
    } catch (e) { setMensagem(e.message || 'Não foi possível redefinir a senha.'); }
    finally { setOcupado(false); }
  }
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
  async function salvarCadastro() {
    if (ocupado) return;
    if (erroDados) return setMensagem(erroDados);
    const email = cadastro.email.trim().toLowerCase(); const existente = dados.clientes.find(c => c.email === email);
    if (!cadastro.nome.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !cadastro.pet.trim() || !cadastro.raca.trim() || !cadastro.idade.trim()) return setMensagem('Preencha tutor, e-mail válido, nome do pet, raça e idade.');
    if (email === 'clinica@petcare.com') return setMensagem('Use o e-mail do cliente, diferente do acesso da clínica.');
    if (!existente && cadastro.senha.length < 6) return setMensagem('Defina uma senha de demonstração com pelo menos 6 caracteres.');
    if (cadastro.especie === 'Outro' && !cadastro.outraEspecie.trim()) return setMensagem('Informe a espécie do pet ao selecionar Outro.');
    const cliente = existente || { nome: cadastro.nome.trim(), email, senha: cadastro.senha, endereco: { cep: cadastro.cep, rua: cadastro.rua, numero: cadastro.numero, bairro: cadastro.bairro, cidade: cadastro.cidade, uf: cadastro.uf } };
    const novoPet = { id: id(), nome: cadastro.pet.trim(), especie: cadastro.especie === 'Outro' ? cadastro.outraEspecie.trim() : cadastro.especie, raca: cadastro.raca.trim(), idade: cadastro.idade.trim(), peso: cadastro.peso.trim(), observacoes: cadastro.observacoes.trim(), email };
    setOcupado(true);
    try { await cadastrar(cliente, novoPet); setModal(null);
    setAcesso({ email, senha: existente ? null : cliente.senha }); setMensagem(existente ? 'Pet vinculado ao cliente existente. A senha atual foi mantida.' : 'Cadastro criado neste aparelho. Nenhum e-mail foi enviado nesta demonstração.'); } catch (e) { setMensagem(e.message || 'Não foi possível cadastrar.'); } finally { setOcupado(false); }
  }
  return <Pagina><Titulo subtitulo="Registre os cuidados e atualize o acompanhamento dos tutores.">Área da clínica</Titulo><Botao titulo="Cadastrar cliente e pet" onPress={() => { setCadastro(novoCadastro()); abrir('cadastro'); }} /><Botao secundario titulo="Redefinir senha do tutor" onPress={() => { setBuscaTutor(''); setEmailTutor(''); setNovaSenha(''); setConfirmacaoSenha(''); abrir('senha'); }} />{acesso && <Card><Text style={s.heading}>Acesso do cadastro demonstrativo</Text><Text style={s.body}>E-mail: {acesso.email}</Text>{acesso.senha && <Text style={s.body}>Senha: {acesso.senha}</Text>}<Text style={s.muted}>Use esses dados para testar o login neste aparelho.</Text><Botao titulo="Ocultar dados de acesso" secundario onPress={() => setAcesso(null)} /></Card>}{mensagem ? <Text accessibilityRole="alert" style={[s.body, { marginVertical: 12 }]}>{mensagem}</Text> : null}<Caixa titulo={{ senha: 'Redefinir senha do tutor', cadastro: 'Cadastrar cliente e pet' }[modal] || ''} visible={!!modal} onClose={() => { if (!ocupado) setModal(null); }}>
    {modal === 'senha' && <>
      <Text style={s.muted}>Confirme a identidade do tutor antes de redefinir. A nova senha vale somente neste aparelho; nenhum e-mail será enviado.</Text>
      <Campo label="Buscar tutor por nome ou e-mail" value={buscaTutor} onChangeText={setBuscaTutor} editable={!ocupado} autoCapitalize="none" />
      {dados.clientes.filter(c => (c.nome + ' ' + c.email).toLowerCase().includes(buscaTutor.trim().toLowerCase())).map(c => <Botao key={c.email} disabled={ocupado} secundario={emailTutor !== c.email} titulo={(emailTutor === c.email ? 'Selecionado: ' : '') + c.nome + ' - ' + c.email} onPress={() => { setEmailTutor(c.email); setNovaSenha(''); setConfirmacaoSenha(''); setMensagem(''); }} />)}
      {!dados.clientes.some(c => (c.nome + ' ' + c.email).toLowerCase().includes(buscaTutor.trim().toLowerCase())) && <Vazio texto="Nenhum tutor encontrado." />}
      {!!emailTutor && <Text style={s.body}>Tutor selecionado: {emailTutor}</Text>}
      <Campo label="Nova senha (mínimo de 6 caracteres)" secureTextEntry value={novaSenha} onChangeText={setNovaSenha} editable={!ocupado} />
      <Campo label="Confirmar nova senha" secureTextEntry value={confirmacaoSenha} onChangeText={setConfirmacaoSenha} editable={!ocupado} />
      <Botao disabled={ocupado || !emailTutor || !!erroDados} titulo={ocupado ? 'Salvando...' : 'Salvar nova senha'} onPress={salvarSenha} />
    </>}
    {modal === 'cadastro' && <><Campo label="Nome do tutor" value={cadastro.nome} onChangeText={v => campoCadastro('nome', v)} /><Campo label="E-mail cadastrado na clínica" autoCapitalize="none" keyboardType="email-address" value={cadastro.email} onChangeText={v => campoCadastro('email', v)} /><Campo label="Senha demonstrativa (novo cliente)" secureTextEntry value={cadastro.senha} onChangeText={v => campoCadastro('senha', v)} /><Text style={[s.muted, { marginBottom: 16 }]}>Se o e-mail já estiver cadastrado, o pet será vinculado à conta desse tutor e a senha atual será mantida.</Text><Text style={[s.heading, { marginVertical: 12 }]}>Dados do pet</Text><Campo label="Nome do pet" value={cadastro.pet} onChangeText={v => campoCadastro('pet', v)} /><Escolhas valores={['Cachorro', 'Gato', 'Outro']} value={cadastro.especie} onChange={v => campoCadastro('especie', v)} />{cadastro.especie === 'Outro' && <Card style={{ backgroundColor: '#EAF5EF' }}><Text style={s.heading}>Qual é a espécie do pet?</Text><Campo label="Espécie do pet" placeholder="Ex.: coelho, pássaro, hamster" value={cadastro.outraEspecie} onChangeText={v => campoCadastro('outraEspecie', v)} /><Text style={s.muted}>Informe qual animal será cadastrado.</Text></Card>}<Campo label="Raça" value={cadastro.raca} onChangeText={v => campoCadastro('raca', v)} /><Campo label="Idade (ex.: 3 anos)" value={cadastro.idade} onChangeText={v => campoCadastro('idade', v)} /><Campo label="Peso (opcional)" value={cadastro.peso} onChangeText={v => campoCadastro('peso', v)} /><Campo label="Observações (opcional)" multiline value={cadastro.observacoes} onChangeText={v => campoCadastro('observacoes', v)} /><Text style={s.heading}>Endereço do tutor (opcional)</Text><Campo label="CEP" keyboardType="number-pad" value={cadastro.cep} onChangeText={v => campoCadastro('cep', v)} /><Botao disabled={ocupado} secundario titulo={ocupado ? 'Aguarde...' : 'Consultar CEP'} onPress={buscarCep} />{['rua', 'numero', 'bairro', 'cidade', 'uf'].map(k => <Campo key={k} label={{ rua: 'Rua', numero: 'Número', bairro: 'Bairro', cidade: 'Cidade', uf: 'UF' }[k]} value={cadastro[k]} onChangeText={v => campoCadastro(k, v)} />)}<Text style={s.muted}>Sem internet, preencha manualmente. O endereço é salvo com o novo tutor.</Text><Botao disabled={ocupado} titulo={ocupado ? "Salvando..." : "Salvar cadastro demonstrativo"} onPress={salvarCadastro} /></>}
    {mensagem ? <Text accessibilityRole="alert" style={s.body}>{mensagem}</Text> : null}
  </Caixa></Pagina>;
}
