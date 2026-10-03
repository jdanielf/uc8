const { test } = require('node:test');
const assert = require('node:assert/strict');
const { dataISO, formatarData, petsDoCliente, servicosDoDia } = require('../src/utils/domain.cjs');
test('datas respeitam calendário, inclusive anos bissextos', () => {
  assert.equal(dataISO('29/02/2024'), '2024-02-29');
  for (const data of ['29/02/2026', '31/04/2026', '00/10/2026', '02/13/2026', '2026-10-02']) assert.equal(dataISO(data), null);
  assert.equal(formatarData(dataISO('02/10/2026')), '02/10/2026');
});
test('cliente só recebe pets vinculados ao próprio e-mail', () => {
  const pets = [{ id: 'a', email: 'a@example.com' }, { id: 'b', email: 'b@example.com' }];
  assert.deepEqual(petsDoCliente(pets, ' A@EXAMPLE.COM '), [pets[0]]);
  assert.deepEqual(petsDoCliente(pets, 'c@example.com'), []);
});
test('histórico combina pet e data e ordena por horário', () => {
  const registros = [{ petId: 'a', data: '2026-10-02', hora: '11:00' }, { petId: 'b', data: '2026-10-02', hora: '09:00' }, { petId: 'a', data: '2026-10-01', hora: '09:00' }, { petId: 'a', data: '2026-10-02', hora: '10:00' }];
  assert.deepEqual(servicosDoDia(registros, 'a', '2026-10-02'), [registros[3], registros[0]]);
  assert.deepEqual(servicosDoDia(registros, 'a', '2026-10-03'), []);
});
