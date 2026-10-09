const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { esquema, salvar, carregar } = require('../src/data/sqliteStore.cjs');
function adaptar(sql) {
  return {
    runAsync: async (consulta, ...args) => sql.prepare(consulta).run(...args),
    getAllAsync: async consulta => sql.prepare(consulta).all(),
    withTransactionAsync: async fn => {
      sql.exec('BEGIN');
      try { await fn(); sql.exec('COMMIT'); }
      catch (erro) { sql.exec('ROLLBACK'); throw erro; }
    }
  };
}
const dados = { clientes: [{ email: 'tutor@teste.com', nome: 'Tutor', senha: 'demo123' }], pets: [{ id: 'p1', nome: 'Luna' }], servicos: [{ id: 's1', petId: 'p1', tipo: 'Vacina' }], fotos: [{ id: 'f1', uri: 'file:///foto.jpg' }], notas: [] };
test('SQLite preserva cadastros e histórico após reabrir e reverte gravação incompleta', async () => {
  dados.avisos = [{ id: 'a1', email: 'tutor@teste.com', titulo: 'Serviço concluído', lido: false }];
  dados.preferencias = [{ id: 'tutor@teste.com', notificacoes: true }];
  const pasta = mkdtempSync(join(tmpdir(), 'petcare-'));
  const arquivo = join(pasta, 'teste.db');
  let sql;
  try {
    sql = new DatabaseSync(arquivo); sql.exec(esquema);
    await salvar(adaptar(sql), dados);
    sql.close(); sql = new DatabaseSync(arquivo);
    const db = adaptar(sql);
    assert.deepEqual(await carregar(db), dados);
    sql.exec("CREATE TRIGGER falha BEFORE INSERT ON servicos BEGIN SELECT RAISE(ABORT, 'falha simulada'); END;");
    await assert.rejects(salvar(db, { ...dados, pets: [{ id: 'p2' }] }), /falha simulada/);
    assert.deepEqual(await carregar(db), dados);
    await assert.rejects(salvar(db, { ...dados, pets: [{ id: 'p1' }, { id: 'p1' }] }), /duplicado/);
  } finally { if (sql) sql.close(); rmSync(pasta, { recursive: true, force: true }); }
});
