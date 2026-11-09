import React from 'react';
import { Text, View } from 'react-native';
import estilos from '../estilos';
import Botao from './Botao';

// Caixa "1. Localização": status do GPS e coordenadas.
// `precisaConfiguracoes` fica true quando o sistema não mostra mais o pedido de permissão.
export default function BlocoLocalizacao({ status, localizacao, precisaConfiguracoes, aoAtualizar, aoAbrirConfiguracoes }) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.secaoTitulo}>1. Localização</Text>
      <Text style={estilos.texto}>{status}</Text>
      {localizacao && (
        <Text style={estilos.pequeno}>
          Latitude {localizacao.latitude.toFixed(5)} | Longitude {localizacao.longitude.toFixed(5)}
        </Text>
      )}
      <Botao titulo="Atualizar minha localização" aoPressionar={aoAtualizar} secundario />
      {precisaConfiguracoes && <Botao titulo="Abrir configurações do celular" aoPressionar={aoAbrirConfiguracoes} />}
    </View>
  );
}
