import { hoje } from '../utils/domain.cjs';
const data = hoje();
export const inicial = {
  clientes: [{ nome: 'Mariana', email: 'cliente@petcare.com', senha: 'pet123' }],
  pets: [
    { id: 'luna', dataCadastro: data, nome: 'Luna', especie: 'Cachorro', raca: 'Golden Retriever', idade: '3 anos', peso: '26 kg', email: 'cliente@petcare.com', observacoes: 'Carinhosa e tranquila. Atenção à sensibilidade na pele.' },
    { id: 'milo', dataCadastro: data, nome: 'Milo', especie: 'Gato', raca: 'Sem raça definida', idade: '1 ano', peso: '4 kg', email: 'cliente@petcare.com', observacoes: 'Prefere um ambiente calmo.' }
  ],
  servicos: [
    { id: 's1', petId: 'luna', data, hora: '09:00', tipo: 'Avaliação', titulo: 'Avaliação de entrada', status: 'Concluído', detalhes: 'Luna foi recebida e avaliada pela equipe. Peso e condições gerais registrados.', profissional: 'Equipe PetCare' },
    { id: 's2', petId: 'luna', data, hora: '09:30', tipo: 'Vacina', titulo: 'Vacinação V10', status: 'Concluído', detalhes: 'Registro fictício para demonstrar a ficha de vacinação.', profissional: 'Veterinário demonstrativo', vacina: 'V10 — exemplo', lote: 'DEMO-2026', fabricante: 'Fabricante demonstrativo', proxima: '2027-10-02' },
    { id: 's3', petId: 'luna', data, hora: '10:00', tipo: 'Banho', titulo: 'Banho e cuidados', status: 'Em andamento', detalhes: 'Banho com shampoo para pele sensível, higienização das patas e secagem cuidadosa. Corte de unhas ainda pendente.', profissional: 'Equipe de banho e tosa' },
    { id: 's4', petId: 'luna', data, hora: '11:00', tipo: 'Tosa', titulo: 'Tosa higiênica', status: 'Agendado', detalhes: 'Acabamento nas patas e tosa higiênica conforme combinado com a tutora.', profissional: 'Equipe de banho e tosa' },
    { id: 's5', petId: 'milo', data, hora: '14:00', tipo: 'Consulta', titulo: 'Consulta de rotina', status: 'Agendado', detalhes: 'Avaliação geral e conferência da carteira de vacinação.', profissional: 'Equipe veterinária' }
  ], fotos: [], notas: []
};
