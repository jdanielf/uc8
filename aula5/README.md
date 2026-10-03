# PetCare — Aula 5

App Expo baseado na estrutura da aula3: React Navigation com Stack e abas, Context, login e armazenamento local. A aula3 foi preservada.

## Executar

```powershell
cd aula5
npm install
npm start
```

Com o emulador aberto: `npm run android`. Para compilar o projeto nativo: `npm run android:build` (requer SDK Android e Java configurados). Navegador: `npm run web`.

## Acessos demonstrativos

- Tutor: `cliente@petcare.com` / `pet123`.
- Clínica: `clinica@petcare.com` / `clinica123`.

O tutor vê somente seus pets. Clique no nome para consultar nome, raça, idade, peso e observações. Escolha qualquer data em DD/MM/AAAA, use Hoje ou os atalhos de dias com registros. Serviços têm horário, situação e detalhes em uma caixa; vacinas incluem nome, fabricante, lote e próxima aplicação. Fotos e notas são filtradas pelo pet e pelo dia selecionado.

A clínica pode cadastrar tutor e pet, registrar e editar serviços, atualizar sua situação, selecionar fotos da galeria e anexar notas fiscais em PDF ou imagem (até 10 MB). Fotos podem ser ampliadas; imagens de notas são exibidas na caixa e PDFs podem ser compartilhados com um leitor no celular ou baixados no navegador. Os arquivos são copiados para o armazenamento do aplicativo no celular; no navegador são armazenados como dados locais.

## Limites da demonstração

Dados salvos com AsyncStorage no próprio aparelho/navegador. Alterações não são compartilhadas entre aparelhos. Para avaliar: entre como clínica, publique um registro, saia e entre como tutor no mesmo aparelho. Senhas e contas são fictícias, armazenadas localmente exclusivamente para demonstração. NÃO usar dados pessoais reais.

Não existe envio de e-mail, recuperação de senha nem autenticação de produção. O envio de acesso pela clínica exigirá servidor, serviço de e-mail, senhas protegidas, permissões por tutor e armazenamento privado de fotos e documentos. O cadastro local informa explicitamente que nenhum e-mail foi enviado. O app disponibiliza uma nota existente; não emite documento fiscal.

## Conferência

`npm test` valida datas, isolamento dos pets e filtro/ordenação de serviços. `npx expo export --platform all` verifica o empacotamento.

Validação realizada: três testes passaram; `npx expo install --check` confirmou dependências compatíveis; exportação Android, iOS e Web concluída. Não foi realizada execução interativa em emulador ou celular. Os filtros testados pertencem ao protótipo local; a autorização de produção deverá ser aplicada no servidor.

Roteiro: tentar login incorreto; entrar como tutor; abrir Luna; verificar vacina e próxima data; abrir banho; selecionar dia sem registros; entrar como clínica; atualizar situação e descrição; selecionar uma foto e anexar um PDF ou imagem de nota; cadastrar outro tutor/pet; sair e acessar como esse tutor; conferir que os pets da outra conta não aparecem; reiniciar e conferir persistência. As notas fiscais são anexadas, não emitidas pelo aplicativo.
