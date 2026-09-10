import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarItem(produto, quantidade = 1) {
    if (!Number.isSafeInteger(quantidade) || quantidade < 1) return;
    setItens((atuais) => {
      const existente = atuais.find((item) => item.id === produto.id);
      return existente
        ? atuais.map((item) => item.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item)
        : [...atuais, { ...produto, quantidade }];
    });
  }

  function removerItem(id) {
    setItens((atuais) => atuais.filter((item) => item.id !== id));
  }

  function aumentarQuantidade(id) {
    setItens((atuais) => atuais.map((item) => item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item));
  }

  function diminuirQuantidade(id) {
    // A última unidade permanece até o usuário escolher Remover.
    setItens((atuais) => atuais.map((item) => item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade - 1) } : item));
  }

  function limparCarrinho() { setItens([]); }

  function calcularTotal() {
    return itens.reduce((total, item) => total + Math.round(item.preco * 100) * item.quantidade, 0) / 100;
  }

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarItem, removerItem, aumentarQuantidade, diminuirQuantidade, limparCarrinho, calcularTotal }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider.');
  return contexto;
}
