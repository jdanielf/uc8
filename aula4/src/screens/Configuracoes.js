import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { estilos as s } from '../styles/estilos';

export default function Configuracoes() {
  return (
    <SafeAreaView style={s.tela} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={s.conteudo}>
        <Text style={s.titulo}>Configurações</Text>
        <View style={s.card}>
          <Text style={s.nome}>Sabor da Casa</Text>
          <Text style={s.subtitulo}>Aplicativo acadêmico de restaurante. Produtos e pedidos fictícios.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
