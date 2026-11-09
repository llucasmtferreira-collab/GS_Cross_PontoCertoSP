import React from 'react';
import { Text } from 'react-native';
import estilos from '../estilos';

// Faixa de mensagem: vermelha para erros ('erro') e azul para avisos informativos ('info').
export default function Mensagem({ texto, tipo = 'erro' }) {
  if (texto === '') return null;
  return <Text style={[estilos.mensagem, tipo === 'info' && estilos.mensagemInfo]}>{texto}</Text>;
}
