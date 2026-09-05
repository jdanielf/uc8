import { createContext, useContext, useState } from 'react';

const AgendamentosContext = createContext(null);

export function AgendamentosProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);

  function adicionarAgendamento(dados) {
    setAgendamentos((itens) => [
      { id: `${Date.now()}-${Math.random()}`, ...dados },
      ...itens,
    ]);
  }

  function removerAgendamento(id) {
    setAgendamentos((itens) => itens.filter((item) => item.id !== id));
  }

  return (
    <AgendamentosContext.Provider value={{ agendamentos, adicionarAgendamento, removerAgendamento }}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  const contexto = useContext(AgendamentosContext);

  if (!contexto) {
    throw new Error('useAgendamentos deve ser usado dentro de AgendamentosProvider.');
  }

  return contexto;
}
