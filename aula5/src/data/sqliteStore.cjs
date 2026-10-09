const colecoes = ['clientes', 'pets', 'servicos', 'fotos', 'notas', 'avisos', 'preferencias'];
const esquema = `
  CREATE TABLE IF NOT EXISTS metadados (chave TEXT PRIMARY KEY, valor TEXT NOT NULL);
  ${colecoes.map(nome => `CREATE TABLE IF NOT EXISTS ${nome} (id TEXT PRIMARY KEY, dados TEXT NOT NULL);`).join('\n')}
`;

function validar(dados) {
  if (!dados || !colecoes.every(nome => Array.isArray(dados[nome]))) throw new Error('Dados locais inválidos');
  for (const nome of colecoes) {
    const ids = new Set();
    for (const item of dados[nome]) {
      const id = nome === 'clientes' ? item.email : item.id;
      if (typeof id !== 'string' || !id || ids.has(id)) throw new Error('Identificador inválido ou duplicado');
      ids.add(id);
    }
  }
}

// A transação mantém as cinco coleções consistentes em caso de falha.
async function salvar(db, dados) {
  dados = { avisos: [], preferencias: [], ...dados };
  validar(dados);
  await db.withTransactionAsync(async () => {
    for (const nome of colecoes) {
      await db.runAsync(`DELETE FROM ${nome}`);
      for (const item of dados[nome]) {
        await db.runAsync(`INSERT INTO ${nome} (id, dados) VALUES (?, ?)`, nome === 'clientes' ? item.email : item.id, JSON.stringify(item));
      }
    }
    await db.runAsync("INSERT OR REPLACE INTO metadados (chave, valor) VALUES ('inicializado', '1')");
  });
}

async function carregar(db) {
  const dados = {};
  for (const nome of colecoes) {
    dados[nome] = (await db.getAllAsync(`SELECT dados FROM ${nome} ORDER BY rowid`)).map(linha => JSON.parse(linha.dados));
  }
  validar(dados);
  return dados;
}
module.exports = { esquema, salvar, carregar };
