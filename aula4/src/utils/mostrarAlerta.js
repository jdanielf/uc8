import { Alert, Platform } from 'react-native';

export function mostrarAlerta(titulo, mensagem) {
  // Alert nativo não apresenta uma caixa de diálogo no Expo Web.
  if (Platform.OS === 'web') globalThis.alert(`${titulo}\n${mensagem}`);
  else Alert.alert(titulo, mensagem);
}
