import { Alert, Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

const CANAL_CHEGADAS = 'chegadas';
let canalCriado = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function criarCanalAndroid() {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync(CANAL_CHEGADAS, {
      name: 'Chegada de ônibus',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 200, 250],
    });
    canalCriado = true;
  } catch (erro) {
    canalCriado = false;
    console.log('Não foi possível criar o canal de notificações:', erro.message);
  }
}

export async function pedirPermissaoAviso() {
  await criarCanalAndroid();

  try {
    const atual = await Notifications.getPermissionsAsync();
    if (atual.granted) return true;

    const permissao = await Notifications.requestPermissionsAsync();
    return permissao.granted;
  } catch (erro) {
    console.log('Não foi possível pedir permissão para notificações:', erro.message);
    return false;
  }
}

export async function emitirAviso(titulo, mensagem, permitido) {
  Vibration.vibrate(500);

  if (permitido) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: mensagem,
          sound: 'default',
        },
        // Não tenta usar o canal personalizado caso ele não tenha sido criado.
        trigger: Platform.OS === 'android' && canalCriado
          ? { channelId: CANAL_CHEGADAS }
          : null,
      });
    } catch (erro) {
      console.log('Não foi possível enviar a notificação local:', erro.message);
    }
  }

  // O alerta funciona mesmo quando a notificação do Expo Go falha.
  Alert.alert(titulo, mensagem);
}
