let activePlayer = null;

export function playExclusive(player) {
  if (activePlayer) {
    try {
      activePlayer.pause();
    } catch {
      // Expo libera automáticamente los players al desmontar su pantalla.
    }
  }

  activePlayer = player;
  try {
    player.seekTo(0);
  } catch {
    // Un recurso nuevo ya comienza desde el segundo cero.
  }
  player.play();
}

export function stopExclusive(player) {
  if (activePlayer !== player) return;
  try {
    player.pause();
    player.seekTo(0);
  } catch {
    // El player ya fue liberado por Expo.
  }
  activePlayer = null;
}

export function forgetActive(players) {
  if (players.includes(activePlayer)) activePlayer = null;
}
