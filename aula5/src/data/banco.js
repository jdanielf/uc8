import { openDatabaseAsync } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { inicial } from './inicial';
import { esquema, carregar, salvar } from './sqliteStore.cjs';

const chaveAntiga = '@aula5/petcare/v1';
let abertura;
function abrir() {
  if (!abertura) abertura = openDatabaseAsync('petcare.db').then(async db => {
    await db.execAsync(esquema);
    const pronto = await db.getFirstAsync("SELECT valor FROM metadados WHERE chave = 'inicializado'");
    if (!pronto) {
      const antigo = await AsyncStorage.getItem(chaveAntiga);
      await salvar(db, antigo ? JSON.parse(antigo) : inicial);
      // A cópia antiga é mantida como backup. Nunca mais é usada após inicializar.
    }
    return db;
  }).catch(erro => { abertura = undefined; throw erro; });
  return abertura;
}
export async function carregarDados() { return carregar(await abrir()); }
export async function salvarDados(dados) { return salvar(await abrir(), dados); }
