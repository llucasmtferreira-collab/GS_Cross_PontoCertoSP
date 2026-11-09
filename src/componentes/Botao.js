import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import estilos from '../estilos';

// Botão reutilizável: a aparência muda conforme as propriedades (props) recebidas.
export default function Botao({ titulo, aoPressionar, secundario = false, perigo = false, desativado = false }) {
  return (
    <TouchableOpacity
      style={[
        estilos.botao,
        secundario && estilos.botaoSecundario,
        perigo && estilos.botaoPerigo,
        desativado && estilos.botaoDesativado,
      ]}
      onPress={aoPressionar}
      disabled={desativado}
      accessibilityRole="button"
    >
      <Text style={[estilos.botaoTexto, secundario && estilos.botaoSecundarioTexto, perigo && estilos.botaoPerigoTexto]}>
        {titulo}
      </Text>
    </TouchableOpacity>
  );
}
