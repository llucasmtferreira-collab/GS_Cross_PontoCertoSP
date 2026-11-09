// Comunicação com a API Olho Vivo (SPTrans).
// Não salvamos o token em arquivos ou no código do aplicativo.
const URL_BASE = 'https://api.olhovivo.sptrans.com.br/v2.1';

export async function autenticar(token) {
  const resposta = await fetch(
    `${URL_BASE}/Login/Autenticar?token=${encodeURIComponent(token.trim())}`,
    { method: 'POST', credentials: 'include' }
  );

  if (!resposta.ok) {
    throw new Error('Não foi possível autenticar na SPTrans. Confira a conexão e o token.');
  }

  const resultado = await resposta.json();
  if (resultado !== true) {
    throw new Error('A SPTrans não aceitou esse token. Verifique a chave de acesso.');
  }
  return true;
}

async function consultar(caminho, token) {
  // Garante que o cookie de sessão esteja válido para cada consulta.
  // As chamadas seguintes enviam o cookie com credentials: 'include'.
  await autenticar(token);
  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resposta.ok) {
    throw new Error(`A consulta à SPTrans falhou (HTTP ${resposta.status}).`);
  }
  return resposta.json();
}

export async function buscarParadas(termo, token) {
  const dados = await consultar(
    `/Parada/Buscar?termosBusca=${encodeURIComponent(termo.trim())}`,
    token
  );
  return Array.isArray(dados) ? dados : [];
}

export async function consultarPrevisao(codigoParada, token) {
  const dados = await consultar(
    `/Previsao/Parada?codigoParada=${encodeURIComponent(codigoParada)}`,
    token
  );
  // A resposta é { hr: 'HH:MM', p: { cp, np, l: [...] } }.
  if (!dados || typeof dados.hr !== 'string') {
    throw new Error('A previsão não veio no formato esperado. Tente novamente.');
  }
  // Se não houver ônibus previstos, `p` pode vir vazio ou sem a lista `l`: tratamos como lista vazia.
  const ponto = dados.p || {};
  return { hr: dados.hr, p: { ...ponto, l: Array.isArray(ponto.l) ? ponto.l : [] } };
}
