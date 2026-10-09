const { test } = require('node:test');
const assert = require('node:assert/strict');
test('API de CEP valida entrada e trata sucesso, CEP ausente e falha de rede', async () => {
  const { consultarCep } = await import('../src/services/cep.js');
  const original = global.fetch;
  try {
    await assert.rejects(consultarCep('123'), /8 dígitos/);
    global.fetch = async url => {
      assert.equal(url, 'https://viacep.com.br/ws/01001000/json/');
      return { ok: true, json: async () => ({ logradouro: 'Praça da Sé', localidade: 'São Paulo', uf: 'SP', bairro: 'Sé' }) };
    };
    assert.equal((await consultarCep('01001-000')).cidade, 'São Paulo');
    global.fetch = async () => ({ ok: true, json: async () => ({ erro: true }) });
    await assert.rejects(consultarCep('99999999'), /não encontrado/);
    global.fetch = async () => { throw new TypeError('Network error'); };
    await assert.rejects(consultarCep('01001000'), /manualmente/);
  } finally { global.fetch = original; }
});
