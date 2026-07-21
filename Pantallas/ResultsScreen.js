import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../utils/progressStorage';

const GAMES = [
  { key: 'rescue', icon: '🚑', name: 'Rescate', skill: 'Reconoce vehículos y sus funciones' },
  { key: 'memory', icon: '🧠', name: 'Memoria', skill: 'Memoria visual y concentración' },
  { key: 'race', icon: '🏎️', name: 'Carrera', skill: 'Conocimiento y seguridad vial' },
  { key: 'colors', icon: '🎨', name: 'Pintura', skill: 'Colores y creatividad' },
  { key: 'counting', icon: '🔢', name: 'Conteo', skill: 'Conteo y cálculo inicial' },
  { key: 'patterns', icon: '🚗', name: 'Patrones', skill: 'Lógica y secuencias' },
];

export default function ResultsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const progress = useProgress();
  const played = GAMES.filter((game) => progress[game.key]);
  const strongest = [...played].sort((a, b) => {
    const first = progress[a.key]; const second = progress[b.key];
    return second.highestLevel - first.highestLevel || second.completedLevels - first.completedLevels;
  })[0];

  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 30 }]}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Volver" onPress={() => navigation.goBack()} style={styles.back}><Text style={styles.backText}>‹</Text></TouchableOpacity>
        <View><Text style={styles.title}>Resultados</Text><Text style={styles.subtitle}>Área para padres</Text></View>
      </View>
      {strongest ? <View style={styles.strength}><Text style={styles.strengthIcon}>🌟 {strongest.icon}</Text><View style={styles.strengthCopy}><Text style={styles.strengthLabel}>FORTALEZA DESTACADA</Text><Text style={styles.strengthTitle}>{strongest.name}</Text><Text style={styles.strengthText}>{strongest.skill}</Text></View></View> : <View style={styles.empty}><Text style={styles.emptyIcon}>🌱</Text><Text style={styles.emptyTitle}>Aún no hay resultados</Text><Text style={styles.emptyText}>Completen un nivel para comenzar a descubrir sus fortalezas.</Text></View>}
      <View style={styles.grid}>{GAMES.map((game) => {
        const result = progress[game.key];
        return <View key={game.key} style={styles.card}><Text style={styles.icon}>{game.icon}</Text><View style={styles.cardCopy}><Text style={styles.cardTitle}>{game.name}</Text><Text style={styles.skill}>{game.skill}</Text><Text style={styles.level}>{result ? `Nivel máximo: ${result.highestLevel}/3` : 'Sin jugar'}</Text>{result ? <Text style={styles.completed}>Celebraciones: {result.completedLevels}{game.key === 'memory' && result.bestScore !== null ? ` · Mejor: ${result.bestScore} intentos` : ''}</Text> : null}</View></View>;
      })}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF5FC' }, content: { paddingHorizontal: 18, gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 }, back: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#17305E', alignItems: 'center', justifyContent: 'center' }, backText: { color: '#FFF', fontSize: 37, lineHeight: 40, fontWeight: '900' }, title: { color: '#17305E', fontSize: 28, fontWeight: '900' }, subtitle: { color: '#60708E', fontSize: 15, fontWeight: '700' },
  strength: { backgroundColor: '#FFF2B3', borderRadius: 26, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 15, borderBottomWidth: 6, borderBottomColor: '#E4C450' }, strengthIcon: { fontSize: 38 }, strengthCopy: { flex: 1, gap: 2 }, strengthLabel: { color: '#8B6816', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 }, strengthTitle: { color: '#17305E', fontSize: 23, fontWeight: '900' }, strengthText: { color: '#59647A', fontSize: 14, fontWeight: '600' },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 26, padding: 24, alignItems: 'center', gap: 7 }, emptyIcon: { fontSize: 42 }, emptyTitle: { color: '#17305E', fontSize: 20, fontWeight: '900' }, emptyText: { color: '#60708E', textAlign: 'center', fontSize: 14, lineHeight: 20 },
  grid: { gap: 11 }, card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 15, flexDirection: 'row', gap: 13, alignItems: 'center' }, icon: { fontSize: 38 }, cardCopy: { flex: 1, gap: 2 }, cardTitle: { color: '#17305E', fontSize: 18, fontWeight: '900' }, skill: { color: '#60708E', fontSize: 13, fontWeight: '600' }, level: { color: '#3D70A7', fontSize: 13, fontWeight: '900', paddingTop: 3 }, completed: { color: '#71809B', fontSize: 12, fontWeight: '600' },
});
