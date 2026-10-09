# PetCare — apresentação

## Problema e solução
Tutores precisam acompanhar o andamento de banhos, tosas, consultas e vacinas. A clínica precisa centralizar os registros. O PetCare relaciona tutor, pet, atendimento, fotos, notas e avisos em um fluxo único.

Esta entrega é um protótipo local: clínica e tutor testam contas diferentes no mesmo aparelho. Não existe comunicação entre aparelhos, backend, envio de e-mail ou push remoto. A API pública integrada é a consulta de CEP do ViaCEP.

## Arquitetura
- `App.js`: navegação Stack (login/início/detalhes) e Tabs (pets/clínica/avisos/conta).
- `src/screens/Telas.js`: login, busca de pets, histórico por ano/mês/dia, conta.
- `src/screens/Clinica.js`: cadastros, atendimentos, andamento e anexos.
- `src/screens/Recursos.js`: avisos, permissões, localização, mapa e dispositivo.
- `src/context/PetContext.js`: sessão, autorização local, fila de gravação e eventos após persistência.
- `src/data/banco.js`: abertura do SQLite e importação única do AsyncStorage.
- `src/data/sqliteStore.cjs`: tabelas clientes, pets, serviços, fotos, notas, avisos e preferências. Campos de cada registro em JSON; transação atômica entre tabelas.
- `src/services`: notificações locais, lembretes e API ViaCEP.
- `src/utils`: regras de datas, filtros e mensagens de eventos.

Fotos e documentos são arquivos privados do app no celular; o banco guarda a referência. Não há sincronização. Os logins são fictícios e as senhas locais são demonstrativas.

## Fluxo para apresentar
1. Entrar como tutor (`cliente@petcare.com` / `pet123`), buscar Luna e consultar o histórico.
2. Na aba Avisos, autorizar notificações e testar som/vibração.
3. Sair e entrar como clínica (`clinica@petcare.com` / `clinica123`).
4. Cadastrar um tutor/pet, consultar CEP (ex.: `01001000`), revisar o endereço e salvar.
5. Selecionar Luna e a data de hoje. Registrar Banho como Agendado.
6. Editar para Em andamento, atualizar os detalhes, anexar foto e nota e concluir o serviço.
7. Registrar uma vacina com próxima aplicação futura.
8. Sair e voltar como tutor no MESMO aparelho. Conferir os avisos de inclusão, alteração e conclusão, e abrir o pet por um aviso.
9. Com notificações autorizadas, o sistema apresenta os avisos pendentes com vibração e agenda próximas vacinas às 9h locais. A aba mantém o histórico mesmo sem permissão.
10. Na Conta, conferir informações do dispositivo e abrir a rota até a clínica usando GPS. Demonstrar a alternativa sem GPS.
11. Fechar/reabrir para conferir a persistência; entrar com outro tutor e confirmar isolamento de pets/avisos.

## Recursos e permissões
Notificações locais e geolocalização são autorizadas quando o usuário solicita a função. A recusa não bloqueia cadastros, histórico ou consulta do endereço no mapa. A consulta de CEP depende de internet, tem limite de espera e permite preenchimento manual. Localização tem limite de espera e alternativa sem GPS.

Ao sair da conta, os lembretes locais são cancelados; ao entrar novamente com notificações ativas, são recriados para os pets da conta. Não enviamos notificações do tutor enquanto a conta clínica está aberta; os avisos ficam pendentes e são apresentados quando o tutor acessa. O sistema operacional controla som e vibração (modo silencioso e permissões podem suprimi-los).

## Testes e entrega
Testes automatizados cobrem calendário, isolamento por tutor, ordenação de histórico, mensagens de inclusão/alteração/conclusão, datas de lembretes, falhas da API e persistência/rollback real do SQLite.

O empacotamento é uma verificação de código, não substitui testar GPS, galeria, PDF, permissões, som e vibração em celular físico. Use o roteiro acima; esses testes interativos ainda precisam ser realizados. O instalador APK NÃO foi gerado, por solicitação do responsável pelo projeto.

## Referências técnicas
- https://docs.expo.dev/versions/v57.0.0/sdk/location/
- https://docs.expo.dev/versions/latest/sdk/notifications/
- https://docs.expo.dev/versions/latest/sdk/sqlite/
- https://viacep.com.br/
