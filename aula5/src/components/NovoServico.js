import { Text } from 'react-native';
import usePets from '../context/PetContext';
import { Botao, Card, s } from './UI';
export default function NovoServico({ pet, navigation }) {
  const { usuario, erro } = usePets();
  if (usuario?.papel !== 'clinica') return null;
  return <Card><Text style={s.heading}>Novo serviço</Text><Text style={s.muted}>Registre outro atendimento para {pet.nome}.</Text><Botao titulo="Novo serviço" disabled={!!erro} onPress={() => navigation.navigate('NovoServico', { petId: pet.id })} />{!!erro && <Text accessibilityRole="alert" style={s.body}>{erro}</Text>}</Card>;
}
