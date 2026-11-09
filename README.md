# Ponto Certo SP

**Global Solution 2026.2 — Cross-Platform Application Development**  
**Aluno:** Lucas Mota — RM566670  
**Professor:** Rodrigo Moraes — FIAP  
**Modalidade:** individual

## O que o aplicativo faz

O **Ponto Certo SP** ajuda quem usa ônibus municipais em São Paulo a encontrar uma parada e acompanhar as próximas chegadas. Ele usa dados reais da **API Olho Vivo da SPTrans**, a localização do celular e alertas de chegada.

Funcionalidades:

1. Solicita permissão de **GPS**, mostra latitude e longitude e permite atualizar a localização. Se o sistema não perguntar mais, aparece um botão para abrir as configurações do celular.
2. Conecta à **API Olho Vivo v2.1** com um token pessoal da SPTrans.
3. Pesquisa **paradas pelo nome ou endereço** na API.
4. Calcula a **distância em linha reta** entre a localização do usuário e as paradas encontradas e ordena os resultados da mais próxima para a mais distante. A distância é recalculada sempre que a localização é atualizada.
5. Mostra, ao selecionar uma parada, **linhas, previsão de chegada, quantidade de veículos e informação de acessibilidade**, quando disponíveis.
6. Permite escolher uma linha para **monitorar a chegada a cada 30 segundos**, enquanto o aplicativo está aberto.
7. Quando a previsão indicar **até 3 minutos**, dispara **notificação local, mensagem e vibração**. Se as notificações estiverem bloqueadas, usa mensagem e vibração.
8. Disponibiliza um **teste de alerta** identificado claramente como demonstração (não usa previsão fictícia).

A API e as previsões são da SPTrans. As previsões podem mudar de acordo com o trânsito. A busca de paradas está limitada às paradas cadastradas pela API Olho Vivo, que pode abranger somente corredores.

## Tecnologias

- **React Native + Expo**, com JavaScript e JSX.
- Componentes reutilizáveis com propriedades (`props`), na pasta `src/componentes`.
- `useState` para os dados e a interface.
- `useEffect` e `setInterval` para monitorar uma linha.
- `FlatList` para a lista de pontos e linhas.
- `fetch`, `async/await` e JSON para consultar a API.
- **expo-location** para GPS.
- **expo-notifications**, `Alert` e `Vibration` para avisos locais.
- **react-native-safe-area-context** para respeitar a barra de status do celular.
- `StyleSheet` e Flexbox para o layout.

## Como executar no celular

### 1. Pré-requisitos

- Node.js instalado no computador.
- VS Code (opcional).
- Celular Android ou iPhone com **Expo Go** instalado e GPS ativado.
- Conexão à internet no celular e computador.
- **Token da API Olho Vivo liberado pela SPTrans.**

### 2. Obter token da SPTrans

1. Abra a [área de desenvolvedores da SPTrans](https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/).
2. Crie uma conta e confirme o cadastro.
3. Em **Meus Aplicativos**, cadastre um aplicativo e gere o token.
4. Aguarde a liberação, caso o token ainda não funcione.

### 3. Instalar e iniciar

No terminal, dentro da pasta do projeto:

```bash
npm install
npx expo install --fix
npx expo start
```

As bibliotecas `expo-location`, `expo-notifications` e `react-native-safe-area-context` já aparecem em `package.json`. O comando `expo install --fix` ajusta as versões se necessário. Com o Expo Go, leia o QR Code mostrado no terminal. Computador e celular normalmente precisam usar a mesma rede Wi-Fi.

Se não conectar na rede local:

```bash
npx expo start --tunnel
```

> O projeto usa **Expo SDK 57**, com React Native 0.86 e JavaScript, para manter compatibilidade com o Expo Go dessa versão. Se o Expo Go instalado pedir outra versão, consulte a documentação da versão do seu Expo Go antes de alterar as dependências.

### 4. Usar o aplicativo

1. Autorize a **localização** quando a permissão aparecer. Veja as coordenadas na seção Localização. Se você negar e o sistema não perguntar de novo, use o botão **Abrir configurações do celular**.
2. Cole seu token e toque em **Conectar**.
3. Pesquise pelo nome/endereço de uma parada, como `Afonso Braz`, `Balthazar` ou `Paulista`.
4. Abra uma parada e veja as **previsões reais** de chegadas.
5. Toque em **Avisar quando faltar até 3 minutos** para monitorar a linha escolhida.
6. Autorize **notificações** se solicitado. Mantenha o app aberto. Quando o próximo veículo estiver a até 3 minutos, o aviso será exibido.
7. Para testar o recurso de alerta imediatamente, toque em **Testar alerta (demonstração)**. O aviso diz explicitamente que é um teste e não representa a chegada real de ônibus.

## Permissões e limitações

- **GPS**: só é consultado com a permissão do usuário. Caso a permissão seja negada, a lista pode ser consultada, mas a distância não é calculada. Se o sistema não pedir a permissão de novo, o app mostra um botão para abrir as configurações do celular.
- **Notificações**: são **locais**, geradas pelo próprio aplicativo; não são notificações push de um servidor. Se a permissão for negada, a mensagem e a vibração continuam disponíveis.
- **Monitoramento**: verifica a API a cada 30 segundos **somente enquanto o app está aberto**; não há serviço em segundo plano. O horário exibido é o retornado pela SPTrans, e não um horário criado pelo aplicativo.
- **Distância**: é calculada em linha reta; não equivale a uma rota a pé.
- **Cobertura**: a API Olho Vivo pode devolver apenas paradas de corredores; nem todas as paradas da cidade aparecem na busca.
- **Sem token**: não é possível exibir dados reais. O projeto não inclui credenciais nem dados simulados como se fossem reais.

## Estrutura de arquivos

```text
GS_Cross_PontoCertoSP/
├── App.js                    # Tela principal: estados, GPS, busca e monitoramento
├── app.json                  # Configurações do Expo e permissões
├── package.json              # Dependências e comandos
├── package-lock.json         # Versões exatas das dependências instaladas
├── PARTICIPANTE.txt          # Identificação e responsabilidades (individual)
└── src/
    ├── olhoVivo.js           # Autenticação, busca e previsão da SPTrans
    ├── calculos.js           # Distância por GPS e minutos até chegada
    ├── avisos.js             # Permissão, notificação local, alerta e vibração
    ├── constantes.js         # Minutos do aviso e intervalo de consulta
    ├── estilos.js            # StyleSheet e Flexbox
    └── componentes/          # Componentes reutilizáveis (props)
        ├── Botao.js
        ├── BlocoLocalizacao.js
        ├── BlocoConexao.js
        ├── BlocoBusca.js
        ├── BlocoPonto.js
        ├── BlocoAlerta.js
        ├── Mensagem.js
        ├── CartaoParada.js
        ├── CartaoLinha.js
        └── Rodape.js
```

## Como o projeto usa os conteúdos das aulas

- **Aulas 2 a 4:** componentes com propriedades (`props`), `StyleSheet`, `FlatList` e Flexbox.
- **Aula 7:** `useState` para guardar dados e alterar a interface.
- **Aula 8:** `useEffect`, `setInterval` e limpeza do intervalo.
- **Aula 9:** comunicação com API, `fetch`, `async/await`, JSON e listas de informações externas.
- **Recursos novos autorizados no enunciado:** GPS e notificações locais com bibliotecas Expo.

## Dados e referências

- **Dados:** © SPTrans — [API Olho Vivo, documentação oficial](https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/documentacao-api/).
- [Área de desenvolvedores da SPTrans](https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/)
- [Expo Location](https://docs.expo.dev/versions/v57.0.0/sdk/location/)
- [Expo Notifications](https://docs.expo.dev/versions/v57.0.0/sdk/notifications/)
- [Expo Go](https://expo.dev/go)

## Demonstração

O vídeo apresenta o funcionamento do Ponto Certo SP em um celular real, demonstrando o uso do GPS, a consulta de previsões pela API Olho Vivo da SPTrans e os alertas de chegada dos ônibus.

[Assistir à demonstração no YouTube](https://www.youtube.com/watch?v=ZyHBK3UwxEI)

Este é um projeto acadêmico desenvolvido individualmente para a Global Solution 2026.2.
