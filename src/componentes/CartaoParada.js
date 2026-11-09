import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import estilos, { cores } from '../estilos';
import { textoDistancia } from '../calculos';

// Item da lista de pontos encontrados.
export default function CartaoParada({ parada, aoAbrir }) {
  return (
    <TouchableOpacity style={estilos.item} onPress={() => aoAbrir(parada)} accessibilityRole="button">
      <View style={estilos.linha}>
        <Text style={[estilos.itemTitulo, { flex: 1 }]}>{parada.np}</Text>
        <Text style={estilos.etiqueta}>{textoDistancia(parada.distancia)}</Text>
      </View>
      <Text style={[estilos.pequeno, { marginTop: 7 }]}>{parada.ed || 'Sem endereço cadastrado'}</Text>
      <Text style={[estilos.pequeno, { marginTop: 8, color: cores.destaque, fontWeight: '700' }]}>Ver próximas chegadas</Text>
    </TouchableOpacity>
  );
}
