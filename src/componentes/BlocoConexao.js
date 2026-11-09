import React from 'react';
import { Text, TextInput, View } from 'react-native';
import estilos from '../estilos';
import Botao from './Botao';

// Caixa "2": campo do token antes de conectar e etiqueta "Dados reais" depois.
export default function BlocoConexao({ token, aoMudarToken, conectado, conectando, aoConectar }) {
  if (conectado) {
    return (
      <View style={estilos.caixa}>
        <View style={estilos.linha}>
          <Text style={estilos.secaoTitulo}>2. SPTrans conectada</Text>
          <Text style={estilos.etiqueta}>Dados reais</Text>
        </View>
        <Text style={estilos.pequeno}>Consultas na API Olho Vivo v2.1</Text>
      </View>
    );
  }

  return (
    <View style={estilos.caixa}>
      <Text style={estilos.secaoTitulo}>2. Conectar à SPTrans</Text>
      <Text style={estilos.pequeno}>
        Cole o token gerado em "Meus Aplicativos", no site de desenvolvedores da SPTrans. Ele não fica salvo no projeto.
      </Text>
      <TextInput
        style={[estilos.campo, { marginTop: 12 }]}
        placeholder="Cole o token da API aqui"
        placeholderTextColor="#738299"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={token}
        onChangeText={aoMudarToken}
      />
      <Botao titulo={conectando ? 'Conectando...' : 'Conectar'} aoPressionar={aoConectar} desativado={conectando} />
    </View>
  );
}
