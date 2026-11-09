import React from 'react';
import { Text, View } from 'react-native';
import estilos, { cores } from '../estilos';
import { MINUTOS_AVISO } from '../constantes';
import Botao from './Botao';

// Item da lista de linhas do ponto: previsão de chegada e botão para ativar o alerta.
export default function CartaoLinha({ linha, minutos, ativo, aoAvisar }) {
  const veiculos = linha.vs || [];
  const acessivel = veiculos.some((veiculo) => veiculo.a === true);
  return (
    <View style={estilos.item}>
      <View style={estilos.linha}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.itemTitulo}>Linha {linha.c}</Text>
          <Text style={estilos.pequeno}>Trajeto: {linha.lt0} / {linha.lt1}</Text>
        </View>
        <Text style={estilos.minutos}>{minutos === null ? '—' : `${minutos} min`}</Text>
      </View>
      <Text style={[estilos.pequeno, { marginTop: 8 }]}>
        {minutos === null ? 'Sem previsão de veículo no momento' : `Previsão mais próxima • ${veiculos.length} veículo(s) identificado(s)`}
      </Text>
      {acessivel && <Text style={[estilos.pequeno, { marginTop: 4, color: cores.verde }]}>Há veículo acessível entre os previstos</Text>}
      <Botao
        titulo={ativo ? 'Alerta ativo para esta linha' : `Avisar quando faltar até ${MINUTOS_AVISO} minutos`}
        aoPressionar={aoAvisar}
        secundario
        desativado={ativo}
      />
    </View>
  );
}
