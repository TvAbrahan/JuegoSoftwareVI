import { audioPlayers } from '../utils/audioPlayers';
import { playExclusive } from '../utils/audioPlayback';

const players = {
  ambulance: audioPlayers.ambulance,
  police: audioPlayers.police,
  fire: audioPlayers.fire,
  bus: audioPlayers.bus,
  taxi: audioPlayers.horn,
  car: audioPlayers.horn,
  truck: audioPlayers.horn,
  race: audioPlayers.engine,
  tractor: audioPlayers.engine,
  helicopter: audioPlayers.helicopter,
  train: audioPlayers.horn,
  boat: audioPlayers.engine,
  bicycle: audioPlayers.bicycle,
  spray: audioPlayers.spray,
  signal: audioPlayers.horn,
};

const emojiToSound = {
  '🚑': 'ambulance', '🚓': 'police', '🚒': 'fire', '🚌': 'bus',
  '🚕': 'taxi', '🚗': 'car', '🚙': 'car', '🚚': 'truck',
  '🏎️': 'race', '🚜': 'tractor', '🚁': 'helicopter', '🚂': 'train',
  '🚢': 'boat', '🚲': 'bicycle', '🚦': 'signal',
};

export default function useIconSounds() {
  const playIcon = (iconOrName) => {
    const player = players[emojiToSound[iconOrName] || iconOrName];
    if (player) playExclusive(player);
  };

  return { playIcon };
}
