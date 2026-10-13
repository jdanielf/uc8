const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatarHorario, conclusaoValida } = require('../src/utils/domain.cjs');
test('horários recebem dois-pontos e limitam a quatro dígitos', () => {
  assert.equal(formatarHorario('1030'), '10:30');
  assert.equal(formatarHorario('10:30'), '10:30');
  assert.equal(formatarHorario('103'), '10:3');
  assert.equal(formatarHorario('10:'), '10');
  assert.equal(formatarHorario(''), '');
  assert.equal(formatarHorario('123456'), '12:34');
});
test('internação pode terminar em outro dia, sem permitir conclusão antes da entrada', () => {
  assert.equal(conclusaoValida('2026-10-12', '22:00', '2026-10-13', '08:00'), true);
  assert.equal(conclusaoValida('2026-10-12', '22:00', '2026-10-12', '08:00'), false);
  assert.equal(conclusaoValida('2026-10-12', '22:00', '2026-10-11', '23:00'), false);
  assert.equal(conclusaoValida('2026-10-12', '22:00', null, '23:00'), false);
  assert.equal(conclusaoValida('2026-10-12', '22:00', '2026-10-13', '25:00'), false);
});
