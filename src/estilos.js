import { StyleSheet } from 'react-native';

export const cores = {
  fundo: '#F1F5F9',
  branco: '#FFFFFF',
  azul: '#173764',
  destaque: '#1670DC',
  texto: '#15243A',
  secundario: '#52647C',
  borda: '#D9E3EF',
  verde: '#096A4A',
  verdeClaro: '#E2F7EC',
  amarelo: '#FFF2CE',
  vermelho: '#B42318',
};

export default StyleSheet.create({
  // A área atrás da barra de status fica azul, igual ao topo do app.
  pagina: { flex: 1, backgroundColor: cores.azul },
  lista: { flex: 1, backgroundColor: cores.fundo },
  topo: { backgroundColor: cores.azul, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 20 },
  marca: { fontSize: 12, color: '#BBD8FF', letterSpacing: 1.3, fontWeight: '700' },
  titulo: { fontSize: 28, color: cores.branco, fontWeight: '800', marginTop: 5 },
  subtitulo: { fontSize: 13, color: '#E0EAFF', marginTop: 6, lineHeight: 19 },
  conteudo: { padding: 16, paddingBottom: 32 },
  caixa: { backgroundColor: cores.branco, borderRadius: 15, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: cores.borda },
  secaoTitulo: { fontSize: 17, color: cores.texto, fontWeight: '800', marginBottom: 9 },
  texto: { fontSize: 14, color: cores.texto, lineHeight: 21 },
  pequeno: { fontSize: 12, color: cores.secundario, lineHeight: 18 },
  campo: { backgroundColor: '#F9FBFE', borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 10, fontSize: 15, color: cores.texto },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  botao: { backgroundColor: cores.destaque, paddingHorizontal: 17, paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  botaoTexto: { color: cores.branco, fontWeight: '800', fontSize: 14 },
  botaoSecundario: { backgroundColor: '#E8F1FD', borderWidth: 1, borderColor: '#B7D2F5' },
  botaoSecundarioTexto: { color: cores.azul },
  botaoPerigo: { backgroundColor: '#FCE9E8', borderWidth: 1, borderColor: '#F2BBB7' },
  botaoPerigoTexto: { color: cores.vermelho },
  botaoDesativado: { opacity: 0.45 },
  // Faixa de mensagem: vermelha por padrão (erro) e azul quando for só um aviso (info).
  mensagem: { padding: 12, backgroundColor: '#FFF0EE', borderColor: '#F5B5B0', borderWidth: 1, borderRadius: 10, marginBottom: 12, color: cores.vermelho, fontSize: 13 },
  mensagemInfo: { backgroundColor: '#EAF3FF', color: cores.azul, borderColor: '#ADCDF5' },
  destaque: { padding: 12, backgroundColor: '#EAF3FF', borderRadius: 10, marginBottom: 12 },
  item: { backgroundColor: cores.branco, padding: 15, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: cores.borda },
  itemTitulo: { fontSize: 16, fontWeight: '800', color: cores.azul },
  etiqueta: { color: cores.verde, backgroundColor: cores.verdeClaro, padding: 6, borderRadius: 7, overflow: 'hidden', fontSize: 12, fontWeight: '700' },
  minutos: { fontSize: 18, color: cores.azul, fontWeight: '800' },
  rodape: { fontSize: 11, color: cores.secundario, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
