import React from "react";
import { Platform, Pressable, ScrollView, View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";

const tipos = { 0: "Desconhecido", 1: "Celular", 2: "Tablet", 3: "TV", 4: "Computador" };
const memoria = (bytes) => bytes == null ? null : `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
const exibir = (valor) => {
  if (valor == null || valor === "") return "Não disponível";
  if (typeof valor === "boolean") return valor ? "Sim" : "Não";
  if (Array.isArray(valor)) return valor.length ? valor.join(", ") : "Nenhum informado";
  return String(valor);
};

export default function Info({ navigation }) {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const [extras, setExtras] = React.useState({});
  const [carregando, setCarregando] = React.useState(true);

  React.useEffect(() => {
    let ativo = true;
    const consultas = [
      ["tipo", () => Device.getDeviceTypeAsync()],
      ["tempo", () => Device.getUptimeAsync()],
      ...(Platform.OS === "android" ? [
        ["memoriaApp", () => Device.getMaxMemoryAsync()],
        ["instalacaoExterna", () => Device.isSideLoadingEnabledAsync()],
        ["recursos", () => Device.getPlatformFeaturesAsync()],
      ] : []),
    ];
    Promise.all(consultas.map(async ([chave, consultar]) => {
      try { return [chave, await consultar()]; }
      catch { return [chave, null]; }
    })).then((resultados) => {
      if (ativo) {
        setExtras(Object.fromEntries(resultados));
        setCarregando(false);
      }
    });
    return () => { ativo = false; };
  }, []);

  const secoes = [
    ["Dispositivo", [
      ["Nome", Device.deviceName], ["Marca", Device.brand],
      ["Fabricante", Device.manufacturer], ["Modelo", Device.modelName],
      ["Identificador do modelo", Device.modelId],
      ["Tipo", tipos[extras.tipo ?? Device.deviceType]],
      ["Aparelho físico", Platform.OS === "web" ? null : Device.isDevice],
      ["Nome de projeto", Device.designName], ["Nome do produto", Device.productName],
      ["Classe de desempenho (ano)", Device.deviceYearClass],
    ]],
    ["Sistema", [
      ["Plataforma", Platform.OS], ["Sistema operacional", Device.osName],
      ["Versão", Device.osVersion], ["Compilação", Device.osBuildId],
      ["Compilação interna", Device.osInternalBuildId],
      ["Identificação da compilação", Device.osBuildFingerprint],
      ["Nível da API Android", Device.platformApiLevel],
      ["Tempo desde a inicialização", extras.tempo == null ? null : `${Math.floor(extras.tempo / 3600000)} h ${Math.floor(extras.tempo / 60000) % 60} min`],
      ...(Platform.OS === "android" ? [["Instalação de fontes externas habilitada", extras.instalacaoExterna]] : []),
    ]],
    ["Memória e processador", [
      ["Memória RAM total", memoria(Device.totalMemory)],
      ["Arquiteturas da CPU", Device.supportedCpuArchitectures],
      ...(Platform.OS === "android" ? [["Limite de memória da VM do app", memoria(extras.memoriaApp)]] : []),
    ]],
    ["Tela do aplicativo", [
      ["Área da janela", `${Math.round(width)} × ${Math.round(height)} dp`],
      ["Área em pixels", `${Math.round(width * scale)} × ${Math.round(height * scale)} px`],
      ["Escala de pixels", `${scale}×`], ["Escala da fonte", `${fontScale}×`],
      ["Orientação", width > height ? "Paisagem" : "Retrato"],
    ]],
    ...(Platform.OS === "android" ? [["Recursos suportados pelo Android", [["Recursos declarados pelo sistema", extras.recursos]]]] : []),
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <Ionicons name="information-circle-outline" size={48} color="#0f766e" />
      </View>
      <Text style={styles.title}>Informações</Text>
      <Text style={styles.subtitle}>Conheça o seu dispositivo. Alguns dados podem não estar disponíveis neste aparelho.</Text>
      {carregando && <Text style={styles.subtitle}>Carregando informações adicionais...</Text>}
      {secoes.map(([titulo, campos]) => (
        <View key={titulo} style={styles.card}>
          <Text style={styles.cardTitle}>{titulo}</Text>
          {campos.map(([rotulo, valor]) => (
            <View key={rotulo} style={styles.row}>
              <Text style={styles.label}>{rotulo}</Text>
              <Text selectable style={styles.value}>{exibir(valor)}</Text>
            </View>
          ))}
        </View>
      ))}
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdfa",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    backgroundColor: "#ccfbf1",
    borderRadius: 40,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#134e4a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#ccfbf1",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#134e4a",
    marginBottom: 8,
  },
  row: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f766e",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    lineHeight: 25,
    color: "#475569",
  },
  button: {
    width: "100%",
    maxWidth: 480,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0f766e",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  buttonPressed: {
    backgroundColor: "#115e59",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
