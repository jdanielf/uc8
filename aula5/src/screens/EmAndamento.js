import { Text } from 'react-native';
import usePets from '../context/PetContext';
import { formatarData } from '../utils/domain.cjs';
import { Botao, Card, Linha, Pagina, Titulo, Vazio, s } from '../components/UI';
export default function EmAndamento({ navigation }) {
  const { dados, usuario } = usePets();
  const pets = dados.pets.filter(p => usuario.papel === 'clinica' || p.email === usuario.email);
  const abertos = dados.servicos.filter(s => s.status !== 'Concluído' && pets.some(p => p.id === s.petId)).sort((a,b) => b.data.localeCompare(a.data) || a.hora.localeCompare(b.hora));
  return <Pagina><Titulo subtitulo="Atendimentos que ainda não foram concluídos.">Em andamento</Titulo>
    {!abertos.length && <Vazio texto="Nenhum serviço em aberto." />}
    {abertos.map(servico => {
      const pet = pets.find(p => p.id === servico.petId);
      const tutor = dados.clientes.find(c => c.email === pet.email);
      return <Card key={servico.id}><Text style={s.heading}>{pet.nome} — {servico.titulo}</Text><Linha label="Tutor" valor={tutor?.nome || pet.email} /><Linha label="Data" valor={formatarData(servico.data)} /><Linha label="Horário da entrada" valor={servico.hora} /><Linha label="Situação" valor="Em andamento" />
        {usuario.papel === 'clinica' ? <Botao titulo="Abrir serviço / concluir" onPress={() => navigation.navigate('NovoServico', { petId: pet.id, servicoId: servico.id, origem: 'EmAndamento' })} /> : <Botao secundario titulo="Ver ficha do pet" onPress={() => navigation.push('Pet', { petId: pet.id, dataServico: servico.data })} />}
      </Card>;
    })}
  </Pagina>;
}
