const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatarEntradaData } = require('../src/utils/domain.cjs');
test('datas recebem barras ao digitar e permitem apagar e colar', () => {
  for (const [entrada, esperado] of [['', ''], ['12', '12'], ['121', '12/1'], ['1210', '12/10'], ['12102', '12/10/2'], ['12102026', '12/10/2026'], ['12/10/2026', '12/10/2026'], ['12/10/', '12/10'], ['1210202699', '12/10/2026']]) assert.equal(formatarEntradaData(entrada), esperado);
});
