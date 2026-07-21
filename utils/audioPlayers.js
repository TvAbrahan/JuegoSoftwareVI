import { createAudioPlayer } from 'expo-audio';

export const audioPlayers = {
  tap: createAudioPlayer(require('../assets/sounds/tap.wav')),
  correct: createAudioPlayer(require('../assets/sounds/correct.wav')),
  tryAgain: createAudioPlayer(require('../assets/sounds/try-again.wav')),
  win: createAudioPlayer(require('../assets/sounds/win.wav')),
  ambulance: createAudioPlayer(require('../assets/sounds/ambulance-real.mp3')),
  police: createAudioPlayer(require('../assets/sounds/police-real.mp3')),
  fire: createAudioPlayer(require('../assets/sounds/fire-truck-real.mp3')),
  bus: createAudioPlayer(require('../assets/sounds/bus-real.mp3')),
  horn: createAudioPlayer(require('../assets/sounds/horn-real.wav')),
  engine: createAudioPlayer(require('../assets/sounds/engine-real.wav')),
  helicopter: createAudioPlayer(require('../assets/sounds/helicopter-real.ogg')),
  bicycle: createAudioPlayer(require('../assets/sounds/bicycle-real-files/rotating_bicycle_bell-1.ogg')),
  spray: createAudioPlayer(require('../assets/sounds/spray.wav')),
};
