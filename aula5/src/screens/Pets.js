import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import usePets from '../context/PetContext';
import { petsDoCliente } from '../utils/domain.cjs';
import { Card, Pagina, Titulo, Vazio, s, cores } from '../components/UI';
export default function Pets({ navigation }) {
  const { dados, usuario } = usePets();
  const pets = usuario.papel === 'clinica' ? dados.pets : petsDoCliente(dados.pets, usuario.email);
  return <Pagina><Text style={s.label}>PETCARE • ACOMPANHAMENTO</Text><Titulo subtitulo="Escolha um pet para ver os cuidados e as atualizações da clínica.">Olá, {usuario.nome.split(' ')[0]} 👋</Titulo><Text style={[s.heading, { marginBottom: 16 }]}>Seus pets</Text>{pets.map(p => <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Ver ficha de ${p.nome}`} onPress={() => navigation.navigate('Pet', { petId: p.id })}><Card><View style={s.row}><View style={{ backgroundColor: '#EAF5EF', padding: 18, borderRadius: 18 }}><Ionicons name="paw" size={30} color={cores.verde} /></View><View style={{ flex: 1 }}><Text style={s.heading}>{p.nome}</Text><Text style={s.muted}>{p.raca} • {p.idade}</Text></View><Ionicons name="chevron-forward" size={22} color={cores.verde} /></View><Text style={s.muted}>Ver ficha, serviços, fotos e nota fiscal</Text></Card></Pressable>)}{!pets.length && <Vazio texto="Nenhum pet vinculado ao seu cadastro. Entre em contato com a clínica." />}<Card style={{ backgroundColor: '#EAF5EF' }}><Text style={s.heading}>Cada cuidado, mais perto</Text><Text style={s.muted}>Acompanhe as etapas do atendimento e consulte o histórico por data. As atualizações são registradas pela equipe da clínica.</Text></Card></Pagina>;
}
