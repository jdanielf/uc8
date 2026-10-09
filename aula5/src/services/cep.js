export async function consultarCep(valor) {
  const cep = valor.replace(/\D/g, '');
  if (cep.length !== 8) throw new Error('Informe um CEP com 8 dígitos.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal });
    if (!resposta.ok) throw new Error('Consulta indisponível. Preencha o endereço manualmente.');
    const dados = await resposta.json();
    if (dados.erro) throw new Error('CEP não encontrado. Confira ou preencha manualmente.');
    return { cep, rua: dados.logradouro || '', bairro: dados.bairro || '', cidade: dados.localidade || '', uf: dados.uf || '' };
  } catch (erro) {
    if (erro.name === 'AbortError' || erro instanceof TypeError) throw new Error('Sem resposta da API. Preencha o endereço manualmente ou tente novamente.');
    throw erro;
  } finally { clearTimeout(timeout); }
}
