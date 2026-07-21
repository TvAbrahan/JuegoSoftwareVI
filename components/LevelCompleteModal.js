import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import useGameSounds from '../hooks/useGameSounds';
import { recordLevel } from '../utils/progressStorage';

export default function LevelCompleteModal({ visible, level, game, score, hasNext, onNext, onReplay, onHome }) {
  const { playTap, playWin } = useGameSounds();

  useEffect(() => {
    if (visible) {
      playWin();
      recordLevel(game, level, score);
    }
  }, [visible]);

  const choose = (action) => {
    playTap();
    action();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.stars}>⭐ 🎉 ⭐</Text>
          <Text style={styles.title}>¡Nivel {level} listo!</Text>
          <View style={styles.actions}>
            {hasNext ? <Pressable accessibilityRole="button" accessibilityLabel="Siguiente nivel" onPress={() => choose(onNext)} style={[styles.button, styles.next]}><Text style={styles.icon}>▶️</Text></Pressable> : null}
            <Pressable accessibilityRole="button" accessibilityLabel="Repetir nivel" onPress={() => choose(onReplay)} style={[styles.button, styles.replay]}><Text style={styles.icon}>🔄</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Volver al menú" onPress={() => choose(onHome)} style={[styles.button, styles.home]}><Text style={styles.icon}>🏠</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 28, 55, 0.72)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 390, backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, alignItems: 'center', gap: 20, borderBottomWidth: 8, borderBottomColor: '#D6E2F0' },
  stars: { fontSize: 42 },
  title: { color: '#17305E', fontSize: 27, fontWeight: '900', textAlign: 'center' },
  actions: { width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 12 },
  button: { width: 82, height: 82, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6 },
  next: { backgroundColor: '#65D17A', borderBottomColor: '#329F4C' },
  replay: { backgroundColor: '#FFD75C', borderBottomColor: '#D5A72A' },
  home: { backgroundColor: '#73C8FF', borderBottomColor: '#3D91C8' },
  icon: { fontSize: 37 },
});
