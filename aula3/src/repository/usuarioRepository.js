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

export async function atualizarUsuario(id, email, nome, senha) {
    const db = await abrirBd();
    try {
        const usuarioExiste =await db.getAsync("SELECT * FROM usuarios WHERE id = ?", id);
    if (usuarioExiste) {
        const result = await db.runAsync(
            "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
            nome, email, senha, id
        );
        console.log("Usuário atualizado com sucesso");
    } else {
        console.log("Usuário não encontrado");
    }
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
    }
}

export async function removerUsuario(id) {
    const db = await abrirBd();
    try {
        const usuarioExiste =await db.getAsync("SELECT * FROM usuarios WHERE id = ?", id);
    if (usuarioExiste) {
        const result = await db.runAsync(
            "DELETE FROM usuarios WHERE id = ?",
            id
        );
        console.log("Usuário removido com sucesso");
    } else {
        console.log("Usuário não encontrado");
    }
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
    }
}
