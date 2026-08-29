import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Casa() {
  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Olá, aluno!</Text>
          <Text style={styles.subtitulo}>Veja as novidades da turma</Text>
        </View>

        <View style={styles.perfil}>
          <Text style={styles.perfilTexto}>UC</Text>
        </View>
      </View>

      <ScrollView
        style={styles.conteudo}
        contentContainerStyle={styles.conteudoInterno}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.novaPublicacao}>
          <Text style={styles.tituloPublicacao}>Criar publicação</Text>
          <TextInput
            style={styles.input}
            placeholder="No que você está pensando?"
            multiline
          />

          <TouchableOpacity
            style={styles.botaoPublicar}
            onPress={() => Alert.alert('Publicação', 'Sua publicação foi enviada!')}
          >
            <Text style={styles.botaoPublicarTexto}>Publicar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tituloFeed}>Publicações recentes</Text>

        <View style={styles.card}>
          <View style={styles.autorLinha}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>M</Text>
            </View>
            <View>
              <Text style={styles.autor}>Maria</Text>
              <Text style={styles.horario}>Hoje, 09:30</Text>
            </View>
          </View>

          <Text style={styles.mensagem}>
            Alguém já terminou a atividade de Desenvolvimento Mobile?
          </Text>

          <TouchableOpacity onPress={() => Alert.alert('Curtida', 'Você curtiu esta publicação!')}>
            <Text style={styles.curtir}>♡ Curtir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.autorLinha}>
            <View style={[styles.avatar, styles.avatarProfessor]}>
              <Text style={styles.avatarTexto}>J</Text>
            </View>
            <View>
              <Text style={styles.autor}>Professor João</Text>
              <Text style={styles.horario}>Ontem, 18:15</Text>
            </View>
          </View>

          <Text style={styles.mensagem}>
            A entrega do exercício será realizada na próxima aula.
          </Text>

          <TouchableOpacity onPress={() => Alert.alert('Curtida', 'Você curtiu esta publicação!')}>
            <Text style={styles.curtir}>♡ Curtir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.menu}>
        <Text style={styles.menuAtivo}>⌂ Início</Text>
        <Text style={styles.menuItem}>＋ Publicar</Text>
        <Text style={styles.menuItem}>◯ Perfil</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#eef4ff',
  },
  cabecalho: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saudacao: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#dbeafe',
    marginTop: 3,
  },
  perfil: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perfilTexto: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  conteudo: {
    flex: 1,
  },
  conteudoInterno: {
    padding: 16,
  },
  novaPublicacao: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 22,
  },
  tituloPublicacao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  input: {
    minHeight: 75,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
  },
  botaoPublicar: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoPublicarTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tituloFeed: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  autorLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarProfessor: {
    backgroundColor: '#16a34a',
  },
  avatarTexto: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  autor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  horario: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  mensagem: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
    marginVertical: 14,
  },
  curtir: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuAtivo: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  menuItem: {
    color: '#6b7280',
  },
});
