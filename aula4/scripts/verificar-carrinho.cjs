const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const babel = require('@babel/core');

// Executa as funções reais do Context com um estado em memória, sem emulador.
let estado;
const react = {
  createContext: () => ({ Provider: 'Provider' }),
  useState: (inicial) => {
    if (estado === undefined) estado = inicial;
    return [estado, (novo) => { estado = typeof novo === 'function' ? novo(estado) : novo; }];
  },
};

function carregar(arquivo) {
  const codigo = babel.transformSync(fs.readFileSync(path.join(__dirname, '..', arquivo), 'utf8'), {
    babelrc: false, configFile: false,
    plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }], '@babel/plugin-transform-modules-commonjs'],
  }).code;
  const modulo = { exports: {} };
  vm.runInNewContext(codigo, {
    exports: modulo.exports, module: modulo,
    require: (nome) => {
      if (nome === 'react') return react;
      if (nome === 'react/jsx-runtime') return { jsx: (_, props) => props };
      throw new Error(`Import inesperado: ${nome}`);
    },
  });
  return modulo.exports;
}

const { CarrinhoProvider } = carregar('src/context/CarrinhoContext.js');
const { produtos } = carregar('src/data/produtos.js');
const { formatarMoeda } = carregar('src/utils/formatarMoeda.js');
const carrinho = () => CarrinhoProvider({ children: null }).value;
assert.equal(produtos.length, 9);
assert.equal(new Set(produtos.map((p) => p.id)).size, 9);
assert.equal(carrinho().calcularTotal(), 0);
carrinho().adicionarItem(produtos[0], 2);
carrinho().adicionarItem(produtos[0], 3);
assert.equal(carrinho().itens.length, 1);
assert.equal(carrinho().itens[0].quantidade, 5);
assert.equal(carrinho().calcularTotal(), 90);
carrinho().adicionarItem(produtos[5], 2);
assert.equal(carrinho().calcularTotal(), 102);
carrinho().aumentarQuantidade(6);
assert.equal(carrinho().calcularTotal(), 108);
carrinho().diminuirQuantidade(6);
assert.equal(carrinho().calcularTotal(), 102);
carrinho().diminuirQuantidade(6);
carrinho().diminuirQuantidade(6);
assert.equal(carrinho().itens.find((i) => i.id === 6).quantidade, 1);
carrinho().removerItem(1);
assert.equal(carrinho().itens.length, 1);
assert.equal(carrinho().calcularTotal(), 6);
for (const quantidade of [0, -1, 1.5, NaN]) carrinho().adicionarItem(produtos[0], quantidade);
assert.equal(carrinho().itens.length, 1);
carrinho().limparCarrinho();
assert.equal(carrinho().itens.length, 0);
assert.equal(carrinho().calcularTotal(), 0);
carrinho().adicionarItem({ id: 10, preco: 0.1 }, 3);
assert.equal(carrinho().calcularTotal(), 0.3);
carrinho().limparCarrinho();
assert.equal(formatarMoeda(1234.5).replace(/\s/g, ' '), 'R$ 1.234,50');
console.log('OK: catálogo, adição sem duplicatas, quantidades, remoção, totais, limpeza e moeda.');
