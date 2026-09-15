import { abrirBd, criarTabelaUsuarios } from "../database/databse";

export async function inicializarBanco() {
    try {
        await criarTabelaUsuarios();
        await inserirUsuario("João", "joao@example.com", "123456");
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
    }
}

export async function inserirUsuario(nome, email,senha) {     
    const db = await abrirBd()
    const result = await db.runAsync(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha]
    );
        if(result.lastInsertRowId){ 
            console.log("Usuario inserido com sucesso")
        }else{
            console.log("Erro ao inserir usuario")
        }


}
