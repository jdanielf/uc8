import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCarrinho } from '../context/CarrinhoContext';
import Quantidade from '../components/Quantidade';
import { formatarMoeda } from '../utils/formatarMoeda';
import { estilos as s } from '../styles/estilos';

export default function Carrinho({ navigation }) {
  const { itens, removerItem, aumentarQuantidade, diminuirQuantidade, calcularTotal } = useCarrinho();
  return (
    <SafeAreaView style={s.tela} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={s.conteudo}>
        <Text style={s.titulo}>Seu carrinho</Text>
        {!itens.length && <Text style={s.subtitulo}>Seu carrinho está vazio. Escolha algo no cardápio!</Text>}
        {itens.map((item) => (
          <View key={item.id} style={s.card}>
            <Text style={s.nome}>{item.nome}</Text>
            <Text style={s.subtitulo}>Valor unitário: {formatarMoeda(item.preco)}</Text>
            <Text style={s.subtitulo}>Quantidade: {item.quantidade}</Text>
            <View style={s.linha}>
              <Quantidade nome={item.nome} quantidade={item.quantidade} aumentar={() => aumentarQuantidade(item.id)} diminuir={() => diminuirQuantidade(item.id)} />
              <Pressable accessibilityRole="button" accessibilityLabel={`Remover ${item.nome}`} style={s.secundario} onPress={() => removerItem(item.id)}><Text style={s.link}>Remover</Text></Pressable>
            </View>
            <Text style={s.preco}>Subtotal: {formatarMoeda(item.preco * item.quantidade)}</Text>
          </View>
        ))}
        <Text style={s.preco}>Total geral: {formatarMoeda(calcularTotal())}</Text>
        <Pressable accessibilityRole="button" style={s.secundario} onPress={() => navigation.navigate('Cardápio')}><Text style={s.link}>Continuar comprando</Text></Pressable>
        <Pressable accessibilityRole="button" disabled={!itens.length} style={[s.botao, !itens.length && s.desabilitado]} onPress={() => navigation.navigate('Confirmacao')}><Text style={s.textoBotao}>Finalizar pedido</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
