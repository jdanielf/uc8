function eventoServico(item, anterior, pet) {
  const acao = item.status === 'Concluído' ? 'Serviço concluído' : anterior ? 'Serviço atualizado' : 'Novo serviço';
  return { titulo: acao, texto: `${pet.nome}: ${item.titulo} — ${item.status}. ${item.detalhes}`, petId: pet.id, email: pet.email, servicoId: item.id };
}
function dataLembrete(iso, agora = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return null;
  const [ano, mes, dia] = iso.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia, 9);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia && data > agora ? data : null;
}
module.exports = { eventoServico, dataLembrete };
