import React, { useState, useEffect } from "react";
import { Platform, Pressable, ScrollView, View, Text, StyleSheet, useWindowDimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';


async function localizacaoAtual(setLocation) {

  try {
  const sevicoAtivo = await Location.hasServicesEnabledAsync();
    if (!sevicoAtivo) {
      console.log("Serviço de localização não está ativo");
      return;
    }

    const {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log("Permissão para acessar localização negada");
      alert("Permissão para acessar localização negada");
      return;
    }

    const localizacao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

  const [endereco] = await Location.reverseGeocodeAsync({
  latitude: localizacao.coords.latitude,
  longitude: localizacao.coords.longitude,
});

setLocation({
  latitude: localizacao.coords.latitude,
  longitude: localizacao.coords.longitude,
  address: endereco
    ? [
        endereco.street,
        endereco.streetNumber,
        endereco.city ?? endereco.subregion,
        endereco.region,
      ].filter(Boolean).join(', ') || 'Endereço não disponível'
    : 'Endereço não disponível',
});

  }catch (error) {
    console.log("Erro ao verificar se o serviço de localização está ativo:", error);
    alert("Erro ao verificar se o serviço de localização está ativo:", error);

    }
}


export default function GPS({ navigation }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    localizacaoAtual(setLocation);

  },[])

  return(

    <View style={styles.container}>

        <Text style={styles.text}>GPS {'\n'} </Text>
        <Text style={styles.text}>Latitude: {location?.latitude ?? 'Carregando...'}</Text>
        <Text style={styles.text}>Longitude: {location?.longitude ?? 'Carregando...'}</Text>
        <Text style={styles.text}>Endereço: {location?.address ?? 'Carregando...'}</Text>

        <MapView style={{ flex: 1, width: '100%' }} region={{ latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0, latitudeDelta: 0.01, longitudeDelta: 0.01 }} />

    </View>

  )



}

const styles = StyleSheet.create({
  container: {
    flex: 1,  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})