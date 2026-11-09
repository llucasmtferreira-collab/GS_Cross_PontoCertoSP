import React from 'react';
import { Text, View } from 'react-native';
import estilos from '../estilos';
import Botao from './Botao';

// Final da lista: teste de alerta (depois de conectar) e crédito dos dados da SPTrans.
export default function Rodape({ conectado, aoTestarAlerta }) {
  return (
    <View>
      {conectado && (
        <View style={estilos.caixa}>
          <Text style={estilos.secaoTitulo}>Alertas no celular</Text>
          <Text style={estilos.pequeno}>
            O teste abaixo demonstra notificação local, mensagem e vibração. Não simula dados da SPTrans.
          </Text>
          <Botao titulo="Testar alerta (demonstração)" aoPressionar={aoTestarAlerta} secundario />
        </View>
      )}
      <Text style={estilos.rodape}>
        Fonte: SPTrans • API Olho Vivo v2.1. Previsões podem mudar conforme o trânsito. Paradas consultadas são as disponíveis na API, que pode cobrir apenas corredores. Este app precisa estar aberto para monitorar chegadas.
      </Text>
    </View>
  );
}
