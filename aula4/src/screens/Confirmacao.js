import { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCarrinho } from '../context/CarrinhoContext';
import { formatarMoeda } from '../utils/formatarMoeda';
import { mostrarAlerta } from '../utils/mostrarAlerta';
import { estilos as s } from '../styles/estilos';

export default function Confirmacao({ navigation }) {
  const { itens, calcularTotal, limparCarrinho } = useCarrinho();
  const confirmado = useRef(false);

  function confirmarPedido() {
    if (!itens.length || confirmado.current) return;
    confirmado.current = true;
    const numero = `${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    mostrarAlerta('Pedido realizado com sucesso!', `Número do pedido: ${numero}`);
    limparCarrinho();
    navigation.popTo('Menu', { screen: 'Cardápio' });
  }

  return (
    <SafeAreaView style={s.tela} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={s.conteudo}>
        <Text style={s.titulo}>RESUMO DO PEDIDO</Text>
        {!itens.length && <Text style={s.subtitulo}>Não há produtos para confirmar.</Text>}
        {itens.map((item) => (
          <View key={item.id} style={s.card}>
            <Text style={s.nome}>Produto: {item.nome}</Text>
            <Text style={s.subtitulo}>Quantidade: {item.quantidade}</Text>
            <Text style={s.subtitulo}>Valor unitário: {formatarMoeda(item.preco)}</Text>
            <Text style={s.preco}>Subtotal: {formatarMoeda(item.preco * item.quantidade)}</Text>
          </View>
        ))}
        <Text style={s.preco}>TOTAL DO PEDIDO: {formatarMoeda(calcularTotal())}</Text>
        <Pressable accessibilityRole="button" style={s.secundario} onPress={() => navigation.popTo('Menu', { screen: 'Carrinho' })}><Text style={s.link}>Voltar ao carrinho</Text></Pressable>
        <Pressable accessibilityRole="button" disabled={!itens.length} style={[s.botao, !itens.length && s.desabilitado]} onPress={confirmarPedido}><Text style={s.textoBotao}>Confirmar pedido</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
