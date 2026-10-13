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
function formatarHorario(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? digitos.slice(0, 2) + ':' + digitos.slice(2) : digitos;
}
function conclusaoValida(dataEntrada, horaEntrada, dataSaida, horaSaida) {
  return !!dataSaida && /^([01]\d|2[0-3]):[0-5]\d$/.test(horaSaida) && (dataSaida > dataEntrada || (dataSaida === dataEntrada && horaSaida >= horaEntrada));
}
function formatarEntradaData(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return digitos.slice(0, 2) + '/' + digitos.slice(2);
  return digitos.slice(0, 2) + '/' + digitos.slice(2, 4) + '/' + digitos.slice(4);
}
module.exports = { formatarEntradaData, formatarHorario, conclusaoValida, dataISO, formatarData, hoje, petsDoCliente, servicosDoDia };
