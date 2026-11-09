import React from 'react';
import { Text, View } from 'react-native';
import estilos from '../estilos';
import { MINUTOS_AVISO, INTERVALO_MS } from '../constantes';
import Botao from './Botao';

// Caixa que aparece enquanto um alerta está ativo.
export default function BlocoAlerta({ monitorando, aoCancelar }) {
  return (
    <View style={[estilos.destaque, { borderWidth: 1, borderColor: '#A8C9FF' }]}>
      <Text style={[estilos.itemTitulo, { marginBottom: 4 }]}>Alerta ativado • {monitorando.nome}</Text>
      <Text style={estilos.pequeno}>
        Aviso quando a próxima previsão for de até {MINUTOS_AVISO} minutos. Verificação a cada {INTERVALO_MS / 1000} segundos com o app aberto.
      </Text>
      <Botao titulo="Cancelar alerta" aoPressionar={aoCancelar} perigo />
    </View>
  );
}
