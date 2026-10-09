import { useState } from 'react';
import { Linking, Platform, Text } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import usePets from '../context/PetContext';
import { notificar } from '../services/notificacoes';
import { Botao, Card, Linha, Pagina, Titulo, Vazio, s } from '../components/UI';

// Endereço informado pelo responsável pelo projeto, sem coordenadas presumidas.
const enderecoClinica = 'Rua Marluce de Oliveira Viana, 141, São Gonçalo do Amarante - RN, Brasil';
export function Avisos({ navigation }) {
  const { dados, usuario, marcarLido, configurarNotificacoes, notificacoesAtivas, avisoSistema } = usePets();
  const [erro, setErro] = useState(''); const [ocupado, setOcupado] = useState(false);
  const avisos = (dados.avisos || []).filter(a => a.email === usuario.email).slice().reverse();
  async function configurar() {
    setOcupado(true); setErro('');
    try { await configurarNotificacoes(!notificacoesAtivas); } catch (e) { setErro(e.message); } finally { setOcupado(false); }
  }
  return <Pagina><Titulo subtitulo="Inclusões, alterações e conclusão dos atendimentos dos seus pets.">Avisos</Titulo>
    <Card><Text style={s.muted}>Os avisos ficam salvos para o tutor neste aparelho. Ative as notificações para recebê-los com vibração ao acessar como tutor e agendar lembretes de vacina às 9h. O modo silencioso e as configurações do celular podem impedir a vibração.</Text><Botao disabled={ocupado} titulo={notificacoesAtivas ? 'Desativar notificações e lembretes' : 'Ativar notificações com vibração'} onPress={configurar} /><Text style={s.muted}>Não há envio para outro celular nesta versão local.</Text></Card>
    {notificacoesAtivas && <Botao secundario titulo="Testar notificação com vibração" onPress={async () => { try { await notificar({ titulo: 'PetCare', texto: 'Notificações de atendimento ativadas neste aparelho.' }); } catch (e) { setErro(e.message); } }} />}
    {!!(erro || avisoSistema) && <Text accessibilityRole="alert" style={s.body}>{erro || avisoSistema}</Text>}
    {!avisos.length && <Vazio texto="Nenhuma atualização para sua conta." />}
    {avisos.map(aviso => <Card key={aviso.id}><Text style={s.heading}>{aviso.lido ? '' : '● '}{aviso.titulo}</Text><Text style={s.body}>{aviso.texto}</Text><Text style={s.muted}>{new Date(aviso.criadoEm).toLocaleString('pt-BR')}</Text><Botao secundario titulo="Ver pet" onPress={async () => { try { await marcarLido(aviso.id); navigation.navigate('Pet', { petId: aviso.petId }); } catch { setErro('Não foi possível marcar o aviso como lido.'); } }} /></Card>)}
  </Pagina>;
}
export function RecursosConta() {
  const [erro, setErro] = useState(''); const [ocupado, setOcupado] = useState(false); const [posicao, setPosicao] = useState(null);
  async function mapa(comLocalizacao) {
    setErro(''); setOcupado(true);
    try {
      let origem = '';
      if (comLocalizacao) {
        const permissao = await Location.requestForegroundPermissionsAsync();
        if (permissao.status !== 'granted') throw new Error('Localização não autorizada. Use “Ver endereço no mapa” para continuar sem GPS.');
        if (!(await Location.hasServicesEnabledAsync())) throw new Error('Ative a localização do celular ou abra o endereço sem GPS.');
        let timeout;
        let local;
        try {
          local = await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Não foi possível obter a localização a tempo. Tente novamente ou abra o endereço sem GPS.')), 15000); })]);
        } finally { clearTimeout(timeout); }
        const { latitude, longitude } = local.coords;
        setPosicao(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        origem = `&origin=${latitude},${longitude}`;
      }
      const destino = encodeURIComponent(enderecoClinica);
      await Linking.openURL(comLocalizacao ? `https://www.google.com/maps/dir/?api=1&destination=${destino}${origem}` : `https://www.google.com/maps/search/?api=1&query=${destino}`);
    } catch (e) { setErro(e.message || 'Não foi possível abrir o mapa.'); } finally { setOcupado(false); }
  }
  return <>
    <Card><Text style={s.heading}>Localização da clínica</Text><Text style={s.body}>{enderecoClinica}</Text><Botao disabled={ocupado} titulo={ocupado ? 'Aguarde...' : 'Como chegar usando minha localização'} onPress={() => mapa(true)} /><Botao disabled={ocupado} secundario titulo="Ver endereço no mapa" onPress={() => mapa(false)} />{posicao && <Linha label="Minha localização" valor={posicao} />}{!!erro && <Text accessibilityRole="alert" style={s.body}>{erro}</Text>}</Card>
    <Card><Text style={s.heading}>Sobre o aplicativo e o dispositivo</Text><Linha label="Versão do PetCare" valor={Constants.expoConfig?.version} /><Linha label="Sistema operacional" valor={Device.osName || Platform.OS} /><Linha label="Versão do sistema" valor={Device.osVersion || String(Platform.Version)} /><Linha label="Marca" valor={Device.brand || Device.manufacturer} /><Linha label="Modelo" valor={Device.modelName} /><Linha label="Tipo" valor={Device.deviceType === Device.DeviceType.TABLET ? 'Tablet' : Device.deviceType === Device.DeviceType.PHONE ? 'Celular' : Platform.OS === 'web' ? 'Navegador' : 'Outro / não identificado'} /><Linha label="Ambiente" valor={Device.isDevice ? 'Dispositivo físico' : 'Emulador ou navegador'} /></Card>
  </>;
}
