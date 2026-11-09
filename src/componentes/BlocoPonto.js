import React from 'react';
import { Text, View } from 'react-native';
import estilos from '../estilos';
import { textoDistancia } from '../calculos';
import Botao from './Botao';

// Cabeçalho do ponto escolhido: nome, endereço, distância e botões de voltar e atualizar.
export default function BlocoPonto({ ponto, distancia, previsao, carregando, aoVoltar, aoAtualizar }) {
  return (
    <View style={estilos.caixa}>
      <Botao titulo="Voltar aos pontos" aoPressionar={aoVoltar} secundario />
      <Text style={[estilos.secaoTitulo, { marginTop: 16 }]}>{ponto.np}</Text>
      <Text style={estilos.pequeno}>{ponto.ed || 'Endereço não informado'}</Text>
      <Text style={[estilos.texto, { marginTop: 8 }]}>{textoDistancia(distancia)}</Text>
      <Botao titulo={carregando ? 'Atualizando...' : 'Atualizar chegadas'} aoPressionar={aoAtualizar} desativado={carregando} />
      {previsao && <Text style={[estilos.pequeno, { marginTop: 8 }]}>Horário de referência da SPTrans: {previsao.hr}</Text>}
    </View>
  );
}
