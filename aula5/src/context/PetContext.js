import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { inicial } from '../data/inicial';
import { hoje } from '../utils/domain.cjs';
const Context = createContext();
const chave = '@aula5/petcare/v1';
export function PetProvider({ children }) {
  const [dados, setDados] = useState(inicial);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const fila = useRef(Promise.resolve());
  useEffect(() => { AsyncStorage.getItem(chave).then(valor => { if (valor) { const salvo = JSON.parse(valor); if (!['clientes','pets','servicos','fotos','notas'].every(k => Array.isArray(salvo[k]))) throw new Error('Formato inválido'); setDados(salvo); } }).catch(() => setErro('Não foi possível carregar os dados salvos. Reinicie o aplicativo antes de alterar registros.')).finally(() => setCarregando(false)); }, []);
  useEffect(() => { if (!carregando && !erro) { fila.current = fila.current.then(() => AsyncStorage.setItem(chave, JSON.stringify(dados))).catch(() => setErro('Não foi possível salvar. As alterações desta sessão podem ser perdidas.')); } }, [dados, carregando, erro]);
  function entrar(email, senha) {
    const normalizado = email.trim().toLowerCase();
    if (normalizado === 'clinica@petcare.com' && senha === 'clinica123') { setUsuario({ nome: 'Equipe PetCare', email: normalizado, papel: 'clinica' }); return true; }
    const cliente = dados.clientes.find(c => c.email === normalizado && c.senha === senha);
    if (!cliente) return false;
    setUsuario({ nome: cliente.nome, email: cliente.email, papel: 'cliente' }); return true;
  }
  function alterar(colecao, item) {
    if (usuario?.papel !== 'clinica' || erro) return;
    setDados(atual => ({ ...atual, [colecao]: atual[colecao].some(v => v.id === item.id) ? atual[colecao].map(v => v.id === item.id ? item : v) : [...atual[colecao], item] }));
  }
  function cadastrar(cliente, pet) {
    if (usuario?.papel !== 'clinica' || erro) return;
    setDados(atual => ({ ...atual, clientes: atual.clientes.some(c => c.email === cliente.email) ? atual.clientes : [...atual.clientes, cliente], pets: [...atual.pets, { ...pet, dataCadastro: hoje() }] }));
  }
  return <Context.Provider value={{ dados, usuario, carregando, erro, entrar, sair: () => setUsuario(null), alterar, cadastrar }}>{children}</Context.Provider>;
}
export default function usePets() { return useContext(Context); }
