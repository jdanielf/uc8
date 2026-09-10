import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Quantidade({ quantidade, aumentar, diminuir, nome }) {
  return (
    <View style={styles.linha}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Diminuir quantidade de ${nome}`} disabled={quantidade <= 1} onPress={diminuir} style={[styles.botao, quantidade <= 1 && styles.desabilitado]}>
        <Text style={styles.sinal}>−</Text>
      </Pressable>
      <Text accessibilityLabel={`Quantidade de ${nome}: ${quantidade}`} style={styles.numero}>{quantidade}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Aumentar quantidade de ${nome}`} onPress={aumentar} style={styles.botao}>
        <Text style={styles.sinal}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  botao: { minWidth: 44, minHeight: 44, borderRadius: 8, backgroundColor: '#f5e6da', alignItems: 'center', justifyContent: 'center' },
  sinal: { fontSize: 24, color: '#552a1c' },
  numero: { fontSize: 18, color: '#38291f', minWidth: 24, textAlign: 'center' },
  desabilitado: { opacity: 0.4 },
});
