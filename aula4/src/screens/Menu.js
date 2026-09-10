import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { produtos } from '../data/produtos';
import { useCarrinho } from '../context/CarrinhoContext';
import Quantidade from '../components/Quantidade';
import { formatarMoeda } from '../utils/formatarMoeda';
import { estilos as s } from '../styles/estilos';

export default function Menu({ navigation }) {
  const { adicionarItem } = useCarrinho();
  const [quantidades, setQuantidades] = useState({});
  const [mensagem, setMensagem] = useState('');
  const { width } = useWindowDimensions();

  function alterarQuantidade(id, variacao) {
    setQuantidades((atuais) => ({ ...atuais, [id]: Math.max(1, (atuais[id] || 1) + variacao) }));
  }

  function adicionar(produto) {
    const quantidade = quantidades[produto.id] || 1;
    adicionarItem(produto, quantidade);
    setQuantidades((atuais) => ({ ...atuais, [produto.id]: 1 }));
    setMensagem(`${quantidade} × ${produto.nome} adicionado ao carrinho.`);
  }

  return (
    <SafeAreaView style={s.tela} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={s.conteudo}>
        <Text style={s.titulo}>Sabor da Casa</Text>
        <Text style={s.subtitulo}>Comida boa, do seu jeito. Escolha a quantidade e adicione ao carrinho.</Text>
        {!!mensagem && <Text accessibilityLiveRegion="polite" style={s.aviso}>{mensagem}</Text>}
        <Pressable accessibilityRole="button" style={s.secundario} onPress={() => navigation.navigate('Carrinho')}><Text style={s.link}>Ver carrinho</Text></Pressable>
        {['Comidas', 'Bebidas'].map((categoria) => (
          <View key={categoria} style={styles.secao}>
            <Text style={s.titulo}>{categoria}</Text>
            <View style={styles.grade}>
              {produtos.filter((produto) => produto.categoria === categoria).map((produto) => (
                <View key={produto.id} style={[s.card, width >= 720 ? styles.duasColunas : styles.umaColuna]}>
                  <Ionicons name={produto.icone} size={36} color="#b44221" />
                  <Text style={s.nome}>{produto.nome}</Text>
                  <Text style={s.subtitulo}>{produto.descricao}</Text>
                  <Text style={s.subtitulo}>{produto.categoria}</Text>
                  <Text style={s.preco}>{formatarMoeda(produto.preco)}</Text>
                  <Quantidade nome={produto.nome} quantidade={quantidades[produto.id] || 1} aumentar={() => alterarQuantidade(produto.id, 1)} diminuir={() => alterarQuantidade(produto.id, -1)} />
                  <Pressable accessibilityRole="button" accessibilityLabel={`Adicionar ${produto.nome} ao carrinho`} style={s.botao} onPress={() => adicionar(produto)}><Text style={s.textoBotao}>Adicionar ao carrinho</Text></Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  secao: { gap: 16 }, grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  duasColunas: { width: '48%', flexGrow: 1 }, umaColuna: { width: '100%' },
});
