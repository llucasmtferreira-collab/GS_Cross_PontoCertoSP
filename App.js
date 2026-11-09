import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Linking, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { autenticar, buscarParadas, consultarPrevisao } from './src/olhoVivo';
import { distanciaMetros, proximaChegada, linhasOrdenadas } from './src/calculos';
import { pedirPermissaoAviso, emitirAviso } from './src/avisos';
import { MINUTOS_AVISO, INTERVALO_MS } from './src/constantes';
import estilos, { cores } from './src/estilos';
import BlocoLocalizacao from './src/componentes/BlocoLocalizacao';
import BlocoConexao from './src/componentes/BlocoConexao';
import BlocoBusca from './src/componentes/BlocoBusca';
import BlocoPonto from './src/componentes/BlocoPonto';
import BlocoAlerta from './src/componentes/BlocoAlerta';
import Mensagem from './src/componentes/Mensagem';
import CartaoParada from './src/componentes/CartaoParada';
import CartaoLinha from './src/componentes/CartaoLinha';
import Rodape from './src/componentes/Rodape';

export default function App() {
  const [token, setToken] = useState('');
  const [conectado, setConectado] = useState(false);
  const [conectando, setConectando] = useState(false);
  const [localizacao, setLocalizacao] = useState(null);
  const [statusGPS, setStatusGPS] = useState('Aguardando permissão');
  const [gpsBloqueado, setGpsBloqueado] = useState(false); // true: só as configurações do celular liberam o GPS
  const [termo, setTermo] = useState('');
  const [paradas, setParadas] = useState([]);
  const [ponto, setPonto] = useState(null);
  const [previsao, setPrevisao] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [carregandoPrevisao, setCarregandoPrevisao] = useState(false);
  const [monitorando, setMonitorando] = useState(null);
  const [permiteNotificacoes, setPermiteNotificacoes] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('erro'); // 'erro' (vermelha) ou 'info' (azul)

  // Mostra uma mensagem na tela. Sem o segundo parâmetro, ela é tratada como erro.
  function mostrarMensagem(texto, tipo = 'erro') {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  async function ativarGPS() {
    try {
      setStatusGPS('Obtendo localização...');
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') {
        setLocalizacao(null);
        if (permissao.canAskAgain) {
          setGpsBloqueado(false);
          setStatusGPS('Permissão negada. Toque em "Atualizar minha localização" para tentar de novo.');
        } else {
          // O sistema não mostra mais o pedido: só as configurações do celular liberam o GPS.
          setGpsBloqueado(true);
          setStatusGPS('Permissão negada. Libere a localização nas configurações do celular.');
        }
        return;
      }
      setGpsBloqueado(false);
      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocalizacao(posicao.coords);
      setStatusGPS('Localização obtida pelo GPS');
    } catch (erro) {
      setLocalizacao(null);
      setStatusGPS('Não foi possível obter o GPS. Verifique se ele está ligado.');
    }
  }

  useEffect(() => {
    ativarGPS();
  }, []);

  function abrirConfiguracoes() {
    Linking.openSettings().catch(() => {
      mostrarMensagem('Não foi possível abrir as configurações. Abra-as manualmente e libere a localização.');
    });
  }

  async function conectar() {
    if (!token.trim()) {
      mostrarMensagem('Cole seu token da SPTrans antes de conectar.');
      return;
    }
    mostrarMensagem('');
    setConectando(true);
    try {
      await autenticar(token);
      setConectado(true);
    } catch (erro) {
      setConectado(false);
      mostrarMensagem(erro.message);
    } finally {
      setConectando(false);
    }
  }

  // A distância é calculada na hora de mostrar, sempre com a localização mais recente.
  function distanciaAte(parada) {
    if (!localizacao) return null;
    return distanciaMetros(localizacao.latitude, localizacao.longitude, parada.py, parada.px);
  }

  async function pesquisar() {
    if (!termo.trim()) {
      mostrarMensagem('Digite o nome do ponto ou uma rua para buscar.');
      return;
    }
    setBuscando(true);
    mostrarMensagem('');
    setPonto(null);
    setPrevisao(null);
    setMonitorando(null);
    Keyboard.dismiss();
    try {
      const encontrados = await buscarParadas(termo, token);
      setParadas(encontrados);
      if (!encontrados.length) mostrarMensagem('Nenhuma parada encontrada. Tente outro nome ou endereço.');
    } catch (erro) {
      mostrarMensagem(erro.message);
      setParadas([]);
    } finally {
      setBuscando(false);
    }
  }

  async function abrirPonto(parada) {
    setPonto(parada);
    setPrevisao(null);
    setMonitorando(null);
    mostrarMensagem('');
    await atualizarPrevisao(parada.cp);
  }

  async function atualizarPrevisao(codigo) {
    setCarregandoPrevisao(true);
    mostrarMensagem('');
    try {
      const dados = await consultarPrevisao(codigo, token);
      setPrevisao(dados);
    } catch (erro) {
      mostrarMensagem(erro.message);
    } finally {
      setCarregandoPrevisao(false);
    }
  }

  async function iniciarAlerta(linha) {
    const permitido = await pedirPermissaoAviso();
    setPermiteNotificacoes(permitido);
    setMonitorando({ codigo: linha.cl, sentido: linha.sl, nome: linha.c });
    mostrarMensagem(
      permitido
        ? 'Alerta ativado. Mantenha o aplicativo aberto para acompanhar a previsão.'
        : 'Notificações desativadas. O app usará mensagem e vibração enquanto estiver aberto.',
      'info'
    );
  }

  // Verifica a linha escolhida a cada 30 segundos, apenas com o app aberto.
  useEffect(() => {
    if (!monitorando || !ponto || !conectado) return;

    let cancelado = false;
    let verificando = false;

    async function verificarChegada() {
      if (verificando) return;
      verificando = true;
      try {
        const dados = await consultarPrevisao(ponto.cp, token);
        if (cancelado) return;
        setPrevisao(dados);
        const linha = dados.p.l.find(
          (item) => item.cl === monitorando.codigo && item.sl === monitorando.sentido
        );
        if (linha) {
          const minutos = proximaChegada(linha, dados.hr);
          if (minutos !== null && minutos <= MINUTOS_AVISO) {
            setMonitorando(null); // Evita repetir o aviso.
            const mensagemChegada = `A linha ${linha.c} está prevista para chegar ao ponto ${ponto.np} em ${minutos} minuto(s).`;
            mostrarMensagem(mensagemChegada, 'info'); // Troca o "Alerta ativado" que ainda estava na tela.
            await emitirAviso('Seu ônibus está chegando!', mensagemChegada, permiteNotificacoes);
          }
        }
      } catch (erro) {
        if (!cancelado) mostrarMensagem(`Não foi possível atualizar o alerta: ${erro.message}`);
      } finally {
        verificando = false;
      }
    }

    verificarChegada();
    const intervalo = setInterval(verificarChegada, INTERVALO_MS);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [monitorando, ponto, conectado, token, permiteNotificacoes]);

  function voltar() {
    setMonitorando(null);
    setPonto(null);
    setPrevisao(null);
    mostrarMensagem('');
  }

  async function testarAlerta() {
    const permitido = await pedirPermissaoAviso();
    setPermiteNotificacoes(permitido);
    await emitirAviso(
      'Teste do Ponto Certo SP',
      'Este é um teste de alerta. Não representa a chegada real de um ônibus.',
      permitido
    );
  }

  const linhas = previsao ? linhasOrdenadas(previsao) : [];

  // Pontos com a distância atual; havendo GPS, os mais próximos aparecem primeiro.
  const paradasExibidas = paradas.map((parada) => ({ ...parada, distancia: distanciaAte(parada) }));
  if (localizacao) paradasExibidas.sort((a, b) => (a.distancia ?? Infinity) - (b.distancia ?? Infinity));

  function cabecalho() {
    return (
      <View>
        <BlocoLocalizacao
          status={statusGPS}
          localizacao={localizacao}
          precisaConfiguracoes={gpsBloqueado}
          aoAtualizar={ativarGPS}
          aoAbrirConfiguracoes={abrirConfiguracoes}
        />

        <BlocoConexao
          token={token}
          aoMudarToken={setToken}
          conectado={conectado}
          conectando={conectando}
          aoConectar={conectar}
        />

        {conectado && !ponto && (
          <BlocoBusca termo={termo} aoMudarTermo={setTermo} buscando={buscando} aoBuscar={pesquisar} />
        )}

        {conectado && !ponto && paradas.length > 0 && (
          <Text style={[estilos.secaoTitulo, { marginTop: 4 }]}>
            {paradas.length} ponto(s) encontrado(s){localizacao ? ' • mais próximos primeiro' : ''}
          </Text>
        )}

        {ponto && (
          <BlocoPonto
            ponto={ponto}
            distancia={distanciaAte(ponto)}
            previsao={previsao}
            carregando={carregandoPrevisao}
            aoVoltar={voltar}
            aoAtualizar={() => atualizarPrevisao(ponto.cp)}
          />
        )}

        {monitorando && <BlocoAlerta monitorando={monitorando} aoCancelar={() => setMonitorando(null)} />}

        <Mensagem texto={mensagem} tipo={tipoMensagem} />

        {buscando || carregandoPrevisao ? <ActivityIndicator size="large" color={cores.destaque} style={{ marginVertical: 12 }} /> : null}
        {ponto && previsao && <Text style={[estilos.secaoTitulo, { marginTop: 4 }]}>Próximos ônibus neste ponto</Text>}
        {ponto && previsao && linhas.length === 0 && <Text style={estilos.pequeno}>Não há linhas com previsão para esse ponto neste momento.</Text>}
      </View>
    );
  }

  function renderizarParada({ item }) {
    return <CartaoParada parada={item} aoAbrir={abrirPonto} />;
  }

  function renderizarLinha({ item }) {
    const ativo = Boolean(monitorando && monitorando.codigo === item.cl && monitorando.sentido === item.sl);
    return (
      <CartaoLinha
        linha={item}
        minutos={previsao ? proximaChegada(item, previsao.hr) : null}
        ativo={ativo}
        aoAvisar={() => iniciarAlerta(item)}
      />
    );
  }

  return (
    <SafeAreaView style={estilos.pagina} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={cores.azul} />
      <View style={estilos.topo}>
        <Text style={estilos.marca}>MOBILIDADE EM SÃO PAULO</Text>
        <Text style={estilos.titulo}>Ponto Certo SP</Text>
        <Text style={estilos.subtitulo}>Encontre sua parada e saiba quando o ônibus está chegando.</Text>
      </View>
      <FlatList
        style={estilos.lista}
        data={ponto ? linhas : conectado ? paradasExibidas : []}
        keyExtractor={(item, index) => (ponto ? `linha-${item.cl}-${item.sl}-${index}` : `parada-${item.cp}-${index}`)}
        renderItem={ponto ? renderizarLinha : renderizarParada}
        ListHeaderComponent={cabecalho()}
        ListFooterComponent={<Rodape conectado={conectado} aoTestarAlerta={testarAlerta} />}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
