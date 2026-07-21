import { audioPlayers } from '../utils/audioPlayers';
import { playExclusive } from '../utils/audioPlayback';

export default function useGameSounds() {
  return {
    playTap: () => playExclusive(audioPlayers.tap),
    playCorrect: () => playExclusive(audioPlayers.correct),
    playTryAgain: () => playExclusive(audioPlayers.tryAgain),
    playWin: () => playExclusive(audioPlayers.win),
  };
}
