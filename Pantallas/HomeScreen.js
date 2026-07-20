import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useGameSounds from '../hooks/useGameSounds';

const GAMES = [
  { route: 'Quiz', icon: '🚑', title: 'Centro de rescate', hint: '3 niveles • nombres y emergencias', color: '#49B870' },
  { route: 'MemoryGame', icon: '🧠', title: 'Memoria', hint: '3 niveles • hasta 6 parejas', color: '#7A63D8' },
  { route: 'RaceGame', icon: '🏎️', title: 'Copa de conocimientos', hint: '3 pistas • ciudad, campo y final', color: '#F28C28' },
  { route: 'ColorGame', icon: '🎨', title: 'Pinta tu auto', hint: '3 niveles • pinta, decora y mezcla', color: '#ED5C88' },
  { route: 'CountingGame', icon: '🚦', title: 'Autos en pista', hint: '3 niveles • cuenta y calcula', color: '#00A9A5' },
  { route: 'PatternGame', icon: '🛣️', title: 'Caravana extrema', hint: '3 niveles • patrones y detectives', color: '#E85D4A' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { playTap } = useGameSounds();
  const openGame = (route) => { playTap(); navigation.navigate(route); };
  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 30 }]}>
      <View style={styles.hero}>
        <View style={styles.bubble}><Text style={styles.heroEmoji}>🏁</Text></View>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>HOT WHEELS KIDS</Text>
          <Text style={styles.title}>¡Vamos a aprender!</Text>
          <Text style={styles.subtitle}>Elige una aventura y consigue estrellas</Text>
        </View>
      </View>
      <View style={styles.streak}><Text style={styles.streakIcon}>⭐</Text><View><Text style={styles.streakTitle}>Tu garaje de juegos</Text><Text style={styles.streakText}>6 aventuras para explorar</Text></View></View>
      <Text style={styles.sectionTitle}>¿Qué jugamos hoy?</Text>
      <View style={styles.grid}>
        {GAMES.map((game) => (
          <TouchableOpacity key={game.route} accessibilityRole="button" accessibilityLabel={`${game.title}. ${game.hint}`} activeOpacity={0.78} onPress={() => openGame(game.route)} style={[styles.card, { backgroundColor: game.color }]}>
            <Text style={styles.icon}>{game.icon}</Text>
            <Text style={styles.cardTitle}>{game.title}</Text>
            <Text style={styles.cardHint}>{game.hint}</Text>
            <View style={styles.playPill}><Text style={styles.playText}>JUGAR  ›</Text></View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAF6FF' },
  content: { paddingHorizontal: 18, gap: 20 },
  hero: { backgroundColor: '#17305E', borderRadius: 30, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 15 },
  bubble: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#FFD447', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  heroEmoji: { fontSize: 39 }, heroCopy: { flex: 1, gap: 4 },
  eyebrow: { color: '#73D8FF', fontSize: 12, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: '#FFFFFF', fontSize: 26, lineHeight: 31, fontWeight: '900' },
  subtitle: { color: '#DDE9FF', fontSize: 15, lineHeight: 20, fontWeight: '600' },
  streak: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakIcon: { fontSize: 32 }, streakTitle: { color: '#17305E', fontSize: 18, fontWeight: '900' }, streakText: { color: '#60708E', fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: '#17305E', fontSize: 24, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', minHeight: 205, flexGrow: 1, flexBasis: 150, borderRadius: 26, padding: 16, gap: 5, borderBottomWidth: 6, borderBottomColor: 'rgba(23,48,94,0.18)' },
  icon: { fontSize: 43 }, cardTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' }, cardHint: { color: '#FFFFFF', fontSize: 14, lineHeight: 18, fontWeight: '700', opacity: 0.94, flex: 1 },
  playPill: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 13, paddingVertical: 7 }, playText: { color: '#17305E', fontWeight: '900', fontSize: 12 },
});
