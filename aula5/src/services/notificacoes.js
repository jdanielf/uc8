import { Platform, Vibration } from 'react-native';
import { dataLembrete } from '../utils/avisos.cjs';
let modulo;
async function api() {
  if (Platform.OS === 'web') throw new Error('Notificações do sistema disponíveis no aplicativo mobile. Os avisos continuam salvos aqui.');
  if (!modulo) {
    modulo = await import('./notificacoesLocais');
    modulo.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
  }
  if (Platform.OS === 'android') await modulo.setNotificationChannelAsync('petcare', { name: 'Atendimentos e vacinas', importance: modulo.AndroidImportance.HIGH, enableVibrate: true, vibrationPattern: [0, 250, 150, 250], sound: 'default' });
  return modulo;
}
export async function permitirNotificacoes() {
  const n = await api();
  let permissao = await n.getPermissionsAsync();
  if (!permissao.granted) permissao = await n.requestPermissionsAsync();
  if (!permissao.granted) throw new Error('Notificações não autorizadas. Você pode liberar nas configurações do celular.');
}
export async function notificar(aviso) {
  const n = await api();
  if (!(await n.getPermissionsAsync()).granted) throw new Error('Notificações desativadas no sistema. Libere nas configurações do celular; os avisos permanecem na aba Avisos.');
  await n.scheduleNotificationAsync({ content: { title: aviso.titulo, body: aviso.texto, sound: 'default', data: { petId: aviso.petId } }, trigger: Platform.OS === 'android' ? { channelId: 'petcare' } : null });
  Vibration.vibrate(250);
}
export async function sincronizarLembretes(servicos, pets, email, ativo) {
  if (Platform.OS === 'web') return;
  const n = await api();
  const agendados = await n.getAllScheduledNotificationsAsync();
  for (const aviso of agendados) if (aviso.content.data?.petcareLembrete) await n.cancelScheduledNotificationAsync(aviso.identifier);
  if (!ativo || !(await n.getPermissionsAsync()).granted) return;
  const meusPets = pets.filter(p => p.email === email);
  for (const s of servicos) {
    const pet = meusPets.find(p => p.id === s.petId);
    const date = dataLembrete(s.proxima);
    if (!pet || s.tipo !== 'Vacina' || !date) continue;
    await n.scheduleNotificationAsync({ identifier: `vacina-${s.id}`, content: { title: 'Lembrete de vacina', body: `${pet.nome}: próxima aplicação de ${s.vacina || s.titulo} hoje.`, sound: 'default', data: { petcareLembrete: true, petId: pet.id } }, trigger: { type: n.SchedulableTriggerInputTypes.DATE, date, channelId: 'petcare' } });
  }
}
