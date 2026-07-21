import 'expo-sqlite/localStorage/install';
import { useSyncExternalStore } from 'react';

const KEY = 'kids-game-progress-v1';
const EMPTY = {};
const listeners = new Set();

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

let snapshot = readProgress();

function save(next) {
  snapshot = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function recordLevel(game, level, score) {
  if (!game) return;
  const current = snapshot[game] || { highestLevel: 0, completedLevels: 0, bestScore: null };
  const bestScore = typeof score === 'number'
    ? current.bestScore === null ? score : Math.min(current.bestScore, score)
    : current.bestScore;
  save({
    ...snapshot,
    [game]: {
      highestLevel: Math.max(current.highestLevel, level),
      completedLevels: current.completedLevels + 1,
      bestScore,
      lastPlayed: new Date().toISOString(),
    },
  });
}

export function useProgress() {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    () => snapshot,
    () => EMPTY,
  );
}
