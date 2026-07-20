import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GameScreen({ navigation, title, subtitle, color, children, score }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: color }]}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 }]}
    >
      <View style={styles.topBar}>
        <TouchableOpacity accessibilityRole="button" style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Menú</Text>
        </TouchableOpacity>
        {score !== undefined && <Text style={styles.score}>{score}</Text>}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, gap: 14 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { backgroundColor: 'rgba(18,31,64,0.2)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18 },
  backText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  score: { color: '#17305E', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
  title: { color: '#FFFFFF', fontSize: 30, lineHeight: 36, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#FFFFFF', fontSize: 17, lineHeight: 23, fontWeight: '700', textAlign: 'center', opacity: 0.95 },
});
