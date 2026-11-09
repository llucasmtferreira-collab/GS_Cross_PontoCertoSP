// Valores usados nas contas de horário.
const MINUTOS_NO_DIA = 24 * 60;
const LIMITE_PREVISAO_MIN = 120; // previsões acima de 2 horas são ignoradas
const SEM_PREVISAO = 999; // as linhas sem previsão vão para o fim da lista

// Fórmula de Haversine: distância aproximada entre duas coordenadas GPS.
export function distanciaMetros(latitude1, longitude1, latitude2, longitude2) {
  const numeros = [latitude1, longitude1, latitude2, longitude2];
  const invalido = numeros.some((numero) => numero === null || numero === undefined || !Number.isFinite(Number(numero)));
  if (invalido) return null;

  const raioTerra = 6371000;
  const paraRadianos = (graus) => (Number(graus) * Math.PI) / 180;
  const diferencaLatitude = paraRadianos(latitude2 - latitude1);
  const diferencaLongitude = paraRadianos(longitude2 - longitude1);
  const a =
    Math.sin(diferencaLatitude / 2) ** 2 +
    Math.cos(paraRadianos(latitude1)) *
      Math.cos(paraRadianos(latitude2)) *
      Math.sin(diferencaLongitude / 2) ** 2;

  return 2 * raioTerra * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function textoDistancia(metros) {
  if (metros === null || !Number.isFinite(metros)) return 'Distância não disponível';
  if (metros < 1000) return `${Math.round(metros)} m de você`;
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km de você`;
}

// Considera a hora da consulta 'hr' retornada pela própria SPTrans.
// Aceita a virada da meia-noite, mas ignora previsões muito distantes (acima do limite).
export function minutosAteChegada(horarioPrevisto, horarioConsulta) {
  const formato = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const chegada = formato.exec(String(horarioPrevisto || ''));
  const consulta = formato.exec(String(horarioConsulta || ''));
  if (!chegada || !consulta) return null;

  const emMinutos = (partes) => Number(partes[1]) * 60 + Number(partes[2]);
  const diferenca = (emMinutos(chegada) - emMinutos(consulta) + MINUTOS_NO_DIA) % MINUTOS_NO_DIA;
  return diferenca <= LIMITE_PREVISAO_MIN ? diferenca : null;
}

export function proximaChegada(linha, horaConsulta) {
  const veiculos = Array.isArray(linha.vs) ? linha.vs : [];
  const minutosValidos = veiculos
    .map((veiculo) => minutosAteChegada(veiculo.t, horaConsulta))
    .filter((valor) => valor !== null);
  return minutosValidos.length ? Math.min(...minutosValidos) : null;
}

export function linhasOrdenadas(previsao) {
  return [...previsao.p.l].sort((a, b) => {
    const minA = proximaChegada(a, previsao.hr);
    const minB = proximaChegada(b, previsao.hr);
    return (minA === null ? SEM_PREVISAO : minA) - (minB === null ? SEM_PREVISAO : minB);
  });
}
