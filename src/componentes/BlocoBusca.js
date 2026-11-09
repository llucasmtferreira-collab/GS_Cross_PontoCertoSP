import React from 'react';
import { Text, TextInput, View } from 'react-native';
import estilos from '../estilos';
import Botao from './Botao';

// Caixa "3. Encontre seu ponto": campo de busca por nome ou endereço.
export default function BlocoBusca({ termo, aoMudarTermo, buscando, aoBuscar }) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.secaoTitulo}>3. Encontre seu ponto</Text>
      <Text style={estilos.pequeno}>
        Pesquise pelo nome ou endereço, como "Paulista", "Afonso Braz" ou "Balthazar". O GPS ordena os resultados pela distância.
      </Text>
      <TextInput
        style={[estilos.campo, { marginTop: 12 }]}
        placeholder="Nome do ponto ou endereço"
        placeholderTextColor="#738299"
        value={termo}
        onChangeText={aoMudarTermo}
        onSubmitEditing={aoBuscar}
        returnKeyType="search"
      />
      <Botao titulo={buscando ? 'Buscando...' : 'Buscar pontos'} aoPressionar={aoBuscar} desativado={buscando} />
    </View>
  );
}
