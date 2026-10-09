import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { carregarDados, salvarDados } from '../data/banco';
import { inicial } from '../data/inicial';
import { hoje } from '../utils/domain.cjs';
import { Vibration } from 'react-native';
import { eventoServico } from '../utils/avisos.cjs';
import { permitirNotificacoes, notificar, sincronizarLembretes } from '../services/notificacoes';
const Context = createContext();
export function PetProvider({ children }) {
  const [dados, setDados] = useState(inicial);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const fila = useRef(Promise.resolve());
  const atualRef = useRef(dados);
  const [avisoSistema, setAvisoSistema] = useState('');
  useEffect(() => { carregarDados().then(valor => { atualRef.current = valor; setDados(valor); }).catch(() => setErro('Não foi possível carregar o banco SQLite. Reinicie o aplicativo antes de alterar registros.')).finally(() => setCarregando(false)); }, []);
  function gravar(transformar) {
    const tarefa = fila.current.then(async () => {
      if (erro || carregando) throw new Error('Banco indisponível. Reinicie antes de alterar registros.');
      const novo = transformar(atualRef.current);
      await salvarDados(novo);
      atualRef.current = novo; setDados(novo);
      return novo;
    });
    fila.current = tarefa.catch(() => {});
    return tarefa;
  }
  const ativo = dados.preferencias?.find(p => p.id === usuario?.email)?.notificacoes || false;
  useEffect(() => {
    if (!usuario || carregando) return;
    let cancelado = false;
    const tarefa = fila.current.then(async () => {
      await sincronizarLembretes(atualRef.current.servicos, atualRef.current.pets, usuario.email, ativo);
      if (cancelado || !ativo || usuario.papel !== 'cliente') return;
      const pendentes = atualRef.current.avisos.filter(a => a.email === usuario.email && !a.entregue);
      for (const aviso of pendentes) {
        if (cancelado) return;
        await notificar(aviso);
        const novo = { ...atualRef.current, avisos: atualRef.current.avisos.map(a => a.id === aviso.id ? { ...a, entregue: true } : a) };
        await salvarDados(novo); atualRef.current = novo; setDados(novo);
      }
    });
    fila.current = tarefa.catch(e => { if (!cancelado) setAvisoSistema(e.message || 'Não foi possível apresentar notificações. Consulte a aba Avisos.'); });
    return () => { cancelado = true; };
  }, [usuario, ativo, dados.servicos, carregando]);
  function entrar(email, senha) {
    const normalizado = email.trim().toLowerCase();
    if (normalizado === 'clinica@petcare.com' && senha === 'clinica123') { setUsuario({ nome: 'Equipe PetCare', email: normalizado, papel: 'clinica' }); return true; }
    const cliente = dados.clientes.find(c => c.email === normalizado && c.senha === senha);
    if (!cliente) return false;
    setUsuario({ nome: cliente.nome, email: cliente.email, papel: 'cliente' }); return true;
  }
  async function alterar(colecao, item) {
    if (usuario?.papel !== 'clinica' || !['servicos', 'fotos', 'notas'].includes(colecao)) throw new Error('Alteração não autorizada.');
    await gravar(atual => {
      const anterior = atual[colecao].find(v => v.id === item.id);
      const novo = { ...atual, [colecao]: anterior ? atual[colecao].map(v => v.id === item.id ? item : v) : [...atual[colecao], item] };
      if (colecao === 'servicos') {
        const pet = atual.pets.find(p => p.id === item.petId);
        if (!pet) throw new Error('Pet não encontrado.');
        const evento = eventoServico(item, anterior, pet);
        novo.avisos = [...(atual.avisos || []), { ...evento, id: `${Date.now()}-${Math.random()}`, criadoEm: new Date().toISOString(), lido: false, entregue: false }];
      }
      return novo;
    });
    Vibration.vibrate(150);
  }
  async function cadastrar(cliente, pet) {
    if (usuario?.papel !== 'clinica') throw new Error('Cadastro não autorizado.');
    await gravar(atual => ({ ...atual, clientes: atual.clientes.some(c => c.email === cliente.email) ? atual.clientes : [...atual.clientes, cliente], pets: [...atual.pets, { ...pet, dataCadastro: hoje() }] }));
    Vibration.vibrate(150);
  }
  async function configurarNotificacoes(valor) {
    if (valor) await permitirNotificacoes();
    await gravar(atual => ({ ...atual, preferencias: [...(atual.preferencias || []).filter(p => p.id !== usuario.email), { id: usuario.email, notificacoes: valor }] }));
    setAvisoSistema('');
  }
  async function marcarLido(id) { await gravar(atual => ({ ...atual, avisos: atual.avisos.map(a => a.id === id && a.email === usuario.email ? { ...a, lido: true } : a) })); }
  async function sair() {
    await sincronizarLembretes([], [], '', false).catch(() => {});
    setUsuario(null);
  }
  return <Context.Provider value={{ dados, usuario, carregando, erro, entrar, sair, alterar, cadastrar, configurarNotificacoes, notificacoesAtivas: ativo, marcarLido, avisoSistema }}>{children}</Context.Provider>;
}
export default function usePets() { return useContext(Context); }
