const { test } = require('node:test');
const assert = require('node:assert/strict');
const { eventoServico, dataLembrete } = require('../src/utils/avisos.cjs');
test('cada inclusão, alteração e conclusão identifica o tutor correto', () => {
  const pet = { id: 'p1', nome: 'Luna', email: 'tutor@teste.com' };
  const servico = { id: 's1', titulo: 'Banho', status: 'Agendado', detalhes: 'Banho especial' };
  assert.equal(eventoServico(servico, null, pet).titulo, 'Novo serviço');
  assert.equal(eventoServico({ ...servico, status: 'Em andamento' }, servico, pet).titulo, 'Serviço atualizado');
  const concluido = eventoServico({ ...servico, status: 'Concluído' }, servico, pet);
  assert.equal(concluido.titulo, 'Serviço concluído');
  assert.equal(concluido.email, pet.email);
  assert.match(concluido.texto, /Luna.*Banho.*Concluído/);
});
test('lembretes usam 9h local e rejeitam datas inválidas ou passadas', () => {
  const agora = new Date(2026, 9, 9, 10);
  assert.equal(dataLembrete('2026-10-08', agora), null);
  assert.equal(dataLembrete('2026-02-30', agora), null);
  assert.equal(dataLembrete(null, agora), null);
  const data = dataLembrete('2026-10-10', agora);
  assert.equal(data.getDate(), 10);
  assert.equal(data.getHours(), 9);
});
