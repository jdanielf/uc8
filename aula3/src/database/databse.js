import * as SQLITE from "expo-sqlite";

export async function abrirBd() {
  const db = await SQLITE.openDatabaseAsync("database.db")
 if (db) {
    console.log("Banco de dados aberto com sucesso")
    return db    
}else{
    console.log("Erro ao abrir o banco de dados")
}   
}


export async function criarTabelaUsuarios() {
  try {
    const db = await abrirBd();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT not NULL,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        senha TEXT NOT NULL
      )
    `);
    console.log("Tabela de usuários criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar a tabela de usuários:", error);
  }
}
    
    
    
  
