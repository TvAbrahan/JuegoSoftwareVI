import { useAudioPlayer } from 'expo-audio';

export default function useGameSounds() {
  const tap = useAudioPlayer(require('../assets/sounds/tap.wav'));
  const correct = useAudioPlayer(require('../assets/sounds/correct.wav'));
  const tryAgain = useAudioPlayer(require('../assets/sounds/try-again.wav'));
  const win = useAudioPlayer(require('../assets/sounds/win.wav'));

  const replay = (player) => {
    player.seekTo(0);
    player.play();
  };

  return {
    playTap: () => replay(tap),
    playCorrect: () => replay(correct),
    playTryAgain: () => replay(tryAgain),
    playWin: () => replay(win),
  };
}
