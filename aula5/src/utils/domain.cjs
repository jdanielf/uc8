function dataISO(valor) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor.trim());
  if (!match) return null;
  const [, dia, mes, ano] = match;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return data.getFullYear() === Number(ano) && data.getMonth() === Number(mes) - 1 && data.getDate() === Number(dia) ? `${ano}-${mes}-${dia}` : null;
}
function formatarData(iso) { return iso ? iso.split('-').reverse().join('/') : 'Não informado'; }
function hoje() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function petsDoCliente(pets, email) { return pets.filter(p => p.email === email.trim().toLowerCase()); }
function servicosDoDia(servicos, petId, data) { return servicos.filter(s => s.petId === petId && s.data === data).sort((a,b) => a.hora.localeCompare(b.hora)); }
module.exports = { dataISO, formatarData, hoje, petsDoCliente, servicosDoDia };
