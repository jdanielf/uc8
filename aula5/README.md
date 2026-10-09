# PetCare — Aula 5

App Expo baseado na estrutura da aula3: React Navigation com Stack e abas, Context, login e armazenamento local. A aula3 foi preservada.

## Executar

```powershell
cd aula5
npm.cmd install
npx.cmd expo start --tunnel --clear
```

Com o emulador aberto: `npm run android`. Para compilar o projeto nativo: `npm run android:build` (requer SDK Android e Java configurados). Navegador: `npm run web`.

## Acessos demonstrativos

- Tutor: `cliente@petcare.com` / `pet123`.
- Clínica: `clinica@petcare.com` / `clinica123`.

O tutor vê somente seus pets, com busca por nome. A clínica também busca pelo nome do tutor. Clique no pet para consultar seus dados e selecionar ano, mês e dia do histórico. Dias com fotos ou notas também aparecem, mesmo sem serviços. Vacinas incluem nome, fabricante, lote e próxima aplicação.

A clínica pode cadastrar tutor e pet, registrar e editar serviços, atualizar sua situação, selecionar fotos da galeria e anexar notas fiscais em PDF ou imagem (até 10 MB). Fotos podem ser ampliadas; imagens de notas são exibidas na caixa e PDFs podem ser compartilhados com um leitor no celular ou baixados no navegador. Os arquivos são copiados para o armazenamento do aplicativo no celular; no navegador são armazenados como dados locais.

## Limites da demonstração

Dados salvos no SQLite (`petcare.db`) no próprio aparelho/navegador, em tabelas de clientes, pets, serviços (incluindo vacinas), fotos, notas, avisos e preferências. Cada registro mantém seus campos em JSON; os arquivos de fotos e notas continuam no armazenamento de arquivos, com a referência no banco. Alterações não são compartilhadas entre aparelhos. Senhas e contas são fictícias, armazenadas localmente exclusivamente para demonstração. NÃO usar dados pessoais reais.

Na primeira abertura, os dados anteriores do AsyncStorage são importados em uma transação. Se a importação falhar, o app bloqueia alterações e preserva os dados antigos. AsyncStorage permanece apenas como dependência de migração; os novos registros são gravados somente no SQLite. Não apague os dados do Expo Go antes de migrar.

Após atualizar dependências, reinicie o Metro com `npx.cmd expo start --tunnel --clear`. No navegador, SQLite exige WebAssembly e isolamento de origem; `metro.config.js` configura esses requisitos no servidor de desenvolvimento. Uma hospedagem web também precisa dos cabeçalhos COOP/COEP.

Não existe envio de e-mail, recuperação de senha nem autenticação de produção. O envio de acesso pela clínica exigirá servidor, serviço de e-mail, senhas protegidas, permissões por tutor e armazenamento privado de fotos e documentos. O cadastro local informa explicitamente que nenhum e-mail foi enviado. O app disponibiliza uma nota existente; não emite documento fiscal.

## Conferência

`npm.cmd test` executa os testes (Node 22.13+ para `node:sqlite`). Se o ambiente bloquear criação de processos com EPERM, use `node --test --test-isolation=none tests/*.test.cjs` em Node 24. Testes cobrem calendário, isolamento por tutor, histórico, eventos de serviços, lembretes, respostas/falhas da API e persistência/rollback do SQLite.

Validação desta atualização: sete testes passaram; exportação Android sem bytecode Hermes e Web concluída. Não foi realizada execução interativa em emulador ou celular. Os filtros testados pertencem ao protótipo local; a autorização de produção deverá ser aplicada no servidor. Nenhum APK foi gerado.

Roteiro: tentar login incorreto; entrar como tutor; abrir Luna; verificar vacina e próxima data; abrir banho; selecionar dia sem registros; entrar como clínica; atualizar situação e descrição; selecionar uma foto e anexar um PDF ou imagem de nota; cadastrar outro tutor/pet; sair e acessar como esse tutor; conferir que os pets da outra conta não aparecem; reiniciar e conferir persistência. As notas fiscais são anexadas, não emitidas pelo aplicativo.

## Recursos novos

- Clínica: consulta ViaCEP no cadastro, com preenchimento manual caso não haja conexão.
- Tutor: aba Avisos com histórico de inclusões, alterações e conclusão dos serviços, leitura e acesso ao pet.
- Notificações: ativação explícita pelo tutor, teste com vibração e apresentação dos avisos pendentes ao acessar sua conta no mesmo aparelho. Sem push remoto.
- Vacinas: lembrete local às 9h da próxima aplicação; reagendado ao entrar/atualizar e cancelado ao sair/desativar.
- Vibração: confirmação somente após a gravação SQLite ser concluída, e ao apresentar aviso local, sujeita às configurações do sistema.
- Conta: informações do dispositivo e rota para Rua Marluce de Oliveira Viana, 141, São Gonçalo do Amarante - RN. GPS solicitado somente ao traçar rota; alternativa para abrir o endereço sem GPS.

Arquitetura, roteiro completo, limites e apresentação: [APRESENTACAO.md](APRESENTACAO.md).
