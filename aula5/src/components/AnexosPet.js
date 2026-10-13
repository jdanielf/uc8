import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import usePets from '../context/PetContext';
import { hoje, dataISO, formatarData } from '../utils/domain.cjs';
import { Botao, Campo, Card, Caixa, s } from './UI';
const id = () => Date.now() + '-' + Math.random().toString(36).slice(2, 9);
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

export default function AnexosPet({ pet }) {
  const { usuario, alterar, erro: erroDados } = usePets();
  const petId = pet.id;
  const [data, setData] = useState(formatarData(hoje()));
  const [modal, setModal] = useState(null);
  const [legenda, setLegenda] = useState('');
  const [horaFoto, setHoraFoto] = useState('10:00');
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const dia = dataISO(data);
  if (usuario?.papel !== 'clinica') return null;
  function validarDia() {
    if (erroDados) { setMensagem(erroDados); return false; }
    if (!dia) { setMensagem('Informe uma data válida (DD/MM/AAAA).'); return false; }
    return true;
  }
  function abrir(tipo) {
    setMensagem(''); setData(formatarData(hoje()));
    setLegenda(''); setHoraFoto('10:00');
    setModal(tipo);
  }
  async function anexarFoto(origem) {
    if (ocupado || !validarDia()) return;
    if (!legenda.trim() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaFoto)) return setMensagem('Informe uma legenda e um horário válido para a foto.');
    setOcupado(true); setMensagem('');
    try {
      if (origem === 'camera' && Platform.OS !== 'web') {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
          setMensagem(permissao.canAskAgain
            ? 'Permita o acesso à câmera para tirar a foto ou carregue uma imagem da galeria.'
            : 'Libere o acesso à câmera nas configurações do aparelho ou carregue uma imagem da galeria.');
          return;
        }
      }
      const opcoes = { mediaTypes: ['images'], quality: .7 };
      const resultado = origem === 'camera'
        ? await ImagePicker.launchCameraAsync(opcoes)
        : await ImagePicker.launchImageLibraryAsync(opcoes);
      if (resultado.canceled) return;
      const uri = await guardarArquivo(resultado.assets[0]);
      await alterar('fotos', { id: id(), petId, data: dia, hora: horaFoto, legenda: legenda.trim(), uri });
      setModal(null); setMensagem('Foto adicionada ao acompanhamento do pet.');
    } catch {
      setMensagem(origem === 'camera' ? 'Não foi possível capturar ou salvar a foto. Tente novamente ou carregue da galeria.' : 'Não foi possível anexar a foto. Tente novamente.');
    } finally { setOcupado(false); }
  }
  async function anexarNota(origem) {
    if (ocupado || !validarDia()) return;
    setOcupado(true); setMensagem('');
    try {
      if (origem === 'camera' && Platform.OS !== 'web') {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
          setMensagem('Permita o acesso à câmera nas configurações do aparelho ou use Carregar nota fiscal.');
          return;
        }
      }
      const resultado = origem === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 })
        : await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true });
      if (resultado.canceled) return;
      const asset = resultado.assets[0];
      const tamanho = asset.size ?? asset.fileSize ?? asset.file?.size;
      if (tamanho > 10 * 1024 * 1024) {
        setMensagem('Selecione uma nota com até 10 MB.'); return;
      }
      const uri = await guardarArquivo(asset);
      await alterar('notas', {
        id: id(), petId, data: dia, uri,
        nome: asset.name || asset.fileName || `nota-fiscal-${dia}.jpg`,
        mime: asset.mimeType || (origem === 'camera' ? 'image/jpeg' : 'application/pdf'),
      });
      setModal(null); setMensagem('Nota fiscal anexada ao histórico do pet.');
    } catch {
      setMensagem('Não foi possível anexar a nota fiscal. Tente novamente ou carregue o arquivo.');
    } finally { setOcupado(false); }
  }

  return <>
    {[['foto', 'Fotos'], ['nota', 'Nota fiscal']].map(([tipo, titulo]) => <Pressable key={tipo} accessibilityRole="button" accessibilityLabel={'Adicionar ' + titulo + ' para ' + pet.nome} disabled={ocupado || !!erroDados} onPress={() => abrir(tipo)}><Card><View style={[s.row, { minHeight: 44 }]}><Text style={[s.heading, { flex: 1 }]}>{titulo}</Text><Text style={s.body}>›</Text></View></Card></Pressable>)}
    {!!mensagem && !modal && <Text accessibilityRole="alert" style={s.body}>{mensagem}</Text>}
    <Caixa titulo={modal === 'foto' ? 'Fotos do pet' : 'Nota fiscal do pet'} visible={!!modal} onClose={() => { if (!ocupado) { setModal(null); setMensagem(''); } }}>
      <Text style={s.heading}>{pet.nome}</Text>
      <Campo label="Data do atendimento (DD/MM/AAAA)" value={data} onChangeText={setData} editable={!ocupado} />
    {modal === 'foto' && <>
      <Campo label="Legenda / procedimento em evolução" multiline value={legenda} onChangeText={setLegenda} editable={!ocupado} />
      <Campo label="Horário (HH:MM)" value={horaFoto} onChangeText={setHoraFoto} editable={!ocupado} />
      <Text style={s.muted}>Preencha os dados acima. A foto será salva no histórico do pet após capturar ou selecionar a imagem.</Text>
      <Botao titulo="Abrir câmera" disabled={ocupado || !!erroDados} onPress={() => anexarFoto('camera')} />
      <Botao secundario titulo="Carregar da galeria" disabled={ocupado || !!erroDados} onPress={() => anexarFoto('galeria')} />
      {ocupado && <Text style={s.muted}>Aguarde...</Text>}
    </>}
    {modal === 'nota' && <>
      <Text style={s.muted}>Carregue a nota fiscal já emitida em PDF ou imagem, ou fotografe a nota impressa (até 10 MB). O documento será salvo no histórico de {pet.nome} na data selecionada.</Text>
      <Botao titulo="Carregar nota fiscal" disabled={ocupado || !!erroDados} onPress={() => anexarNota('arquivo')} />
      <Botao secundario titulo="Fotografar nota" disabled={ocupado || !!erroDados} onPress={() => anexarNota('camera')} />
      {ocupado && <Text style={s.muted}>Aguarde...</Text>}
    </>}
      {!!mensagem && <Text accessibilityRole="alert" style={s.body}>{mensagem}</Text>}
    </Caixa>
  </>;
}
