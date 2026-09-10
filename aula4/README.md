# Sabor da Casa — Aula 4

Aplicativo de restaurante adaptado no projeto Expo existente, seguindo a estrutura da aula3. A aula3 não foi alterada.

## Executar

```sh
cd aula4
npm install
npm start
```

Use o QR code com Expo Go compatível com SDK 57. Web: `npm run web`. Emulador Android: `npm run android`. Simulador iOS: `npm run ios` (requer macOS).

O aplicativo abre diretamente no cardápio, sem autenticação. O carrinho fica em memória durante a sessão.

## Funcionalidades

- Acesso direto ao cardápio; Stack com as abas e a confirmação do pedido.
- Abas Cardápio, Carrinho e Configurações, com Ionicons e contador de unidades.
- Nove produtos com descrição, categoria, ícone e valores em reais.
- Quantidades com + e −; adicionar o mesmo produto acumula unidades.
- Carrinho com valor unitário, subtotal, total, remoção e continuação da compra.
- Quantidade mínima 1; use Remover para retirar a última unidade.
- Resumo completo, retorno ao carrinho e confirmação com número fictício.
- Confirmação exibe alerta, limpa o carrinho e retorna ao cardápio.

- Componentes React Native, StyleSheet, áreas seguras, rolagem e duas colunas em telas largas.
- Alert nativo no celular e diálogo do navegador na Web.

## Arquivos

Criados: App.js, index.js, src/screens/{Menu,Carrinho,Confirmacao,Configuracoes}.js, src/context/CarrinhoContext.js, src/data/produtos.js, src/components/Quantidade.js, src/styles/estilos.js, src/utils/{formatarMoeda,mostrarAlerta}.js e scripts/verificar-carrinho.cjs.

Alterados: package.json, package-lock.json, app.json, tsconfig.json, .gitignore e README.md.

Removidos os arquivos demonstrativos de src/app, os componentes antigos do template, hooks, tema e CSS. Expo Router foi removido devido ao conflito com React Navigation direto no SDK 57. A entrada passou a index.js e a saída Web a single. Versões Expo/React Native, ícones e splash foram preservados.

Compromissos.js e AgendamentosContext.js não existiam na aula4 e não foram copiados. Permanecem na aula3 como referência. scripts/reset-project.js e imagens demonstrativas restantes podem ser removidos, pois não são usados pelo restaurante. Não execute o reset do template sobre o aplicativo adaptado.

## Dependências

Expo 57, React, React Native, React Native Web, expo-status-bar, react-native-safe-area-context e react-native-screens. Adicionadas as bibliotecas necessárias já usadas na aula3: @react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs, @expo/vector-icons. Outros pacotes originais foram mantidos.

## Validação

```sh
npm test
npx tsc --noEmit
npx expo install --check
npx expo export --platform all --output-dir dist-validacao
```

O teste executa as funções reais do Context com estado simulado: catálogo, adição repetida, incremento, decremento, mínimo, remoção, total em centavos, limpeza e moeda. Não substitui testes interativos no dispositivo.

Roteiro manual: abrir o aplicativo no cardápio, adicionar 2 X-Burguer e 1 Coca-Cola (R$ 42,00), conferir contador 3, alterar quantidades, remover produto, continuar comprando, finalizar, voltar ao carrinho, finalizar novamente e confirmar. Conferir alerta, retorno ao cardápio e carrinho vazio. Repetir no celular e navegador, incluindo janela estreita. Testar também o carrinho vazio e o retorno ao cardápio após a confirmação.

Referência consultada conforme AGENTS.md: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

