import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInLeft, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import GameScreen from '../components/GameScreen';
import LevelCompleteModal from '../components/LevelCompleteModal';
import useGameSounds from '../hooks/useGameSounds';
import useIconSounds from '../hooks/useIconSounds';

const MISSIONS = [
  { mode: 'all', cars: ['🚗', '🚕', '🚙'], answer: 3, prompt: '¿Cuántos vehículos esperan?' },
  { mode: 'all', cars: ['🏎️', '🚗', '🚕', '🚙', '🚓'], answer: 5, prompt: 'Cuenta toda la fila' },
  { mode: 'type', cars: ['🚕', '🚓', '🚕', '🚙', '🚕'], target: '🚕', answer: 3, prompt: '¿Cuántos taxis hay?' },
  { mode: 'type', cars: ['🚓', '🚑', '🚓', '🚗', '🚓', '🚑'], target: '🚓', answer: 3, prompt: 'Cuenta solo los policías' },
  { mode: 'math', cars: ['🚗', '🚙'], add: ['🚕', '🚕'], answer: 4, prompt: 'Había 2 y llegaron 2. ¿Cuántos hay?' },
  { mode: 'math', cars: ['🚗', '🚕', '🚙', '🚓', '🏎️'], leave: 2, answer: 3, prompt: 'Había 5 y salieron 2. ¿Cuántos quedan?' },
];

export default function CountingGameScreen({ navigation }) {
  const [missionIndex, setMissionIndex] = useState(0);
  const [message, setMessage] = useState('¡Lee la misión y observa la pista!');
  const [levelComplete, setLevelComplete] = useState(false);
  const convoyX = useSharedValue(0); const shake = useSharedValue(0);
  const sounds = useGameSounds(); const { playIcon } = useIconSounds(); const mission = MISSIONS[missionIndex % MISSIONS.length];
  const level = missionIndex < 2 ? 1 : missionIndex < 4 ? 2 : 3;
  const visibleCars = mission.mode === 'math' && mission.add ? [...mission.cars, ...mission.add] : mission.mode === 'math' && mission.leave ? mission.cars.slice(0, mission.answer) : mission.cars;
  const options = useMemo(() => [mission.answer, Math.min(6, mission.answer + 1), Math.max(1, mission.answer - 1)].filter((n, i, list) => list.indexOf(n) === i).sort(() => Math.random() - 0.5), [mission]);
  const convoyStyle = useAnimatedStyle(() => ({ transform: [{ translateX: convoyX.value + shake.value }] }));
  const resetRoad = () => { convoyX.value = -450; convoyX.value = withSpring(0); setMessage('👀 🚗'); };
  const finish = () => { setMessage('⭐'); convoyX.value = withTiming(480, { duration: 850 }); setTimeout(() => { if (missionIndex % 2 === 1) setLevelComplete(true); else { setMissionIndex((v) => v + 1); resetRoad(); } }, 950); };
  const answer = (number) => { playIcon('signal'); if (number === mission.answer) finish(); else { sounds.playTryAgain(); setMessage('🔁'); shake.value = withSequence(withTiming(-9, { duration: 70 }), withTiming(9, { duration: 70 }), withSpring(0)); } };
  return (
    <GameScreen navigation={navigation} color="#069C98" title="Academia de tráfico" subtitle={message} score={`Nivel ${level} • ${missionIndex + 1}/${MISSIONS.length}`}>
      <View style={styles.levels}>{['Contar', 'Clasificar', 'Sumar y restar'].map((name, index) => <View key={name} style={[styles.levelChip, index + 1 === level && styles.levelActive]}><Text style={[styles.levelText, index + 1 === level && styles.levelTextActive]}>{index + 1}. {name}</Text></View>)}</View>
      <View style={styles.city}><Text style={styles.skyline}>▥　▥▥　▥　▥▥</Text><Text style={styles.trafficLight}>🔴</Text>{mission.target && <View style={styles.targetBadge}><Text style={styles.targetText}>BUSCA {mission.target}</Text></View>}
        <View style={styles.roadLines}><View style={styles.line} /><View style={styles.line} /><View style={styles.line} /></View>
        <Animated.View key={missionIndex} style={[styles.convoy, convoyStyle]}>{visibleCars.map((car, index) => <Animated.View entering={FadeInLeft.delay(index * 100).springify()} key={`${missionIndex}-${index}`} style={styles.carWrap}><Pressable accessibilityRole="button" accessibilityLabel="Escuchar vehículo" onPress={() => playIcon(car)}><Text style={styles.car}>{car}</Text></Pressable>{mission.mode === 'type' && car === mission.target && <Text style={styles.targetDot}>•</Text>}</Animated.View>)}</Animated.View>
      </View>
      <View style={styles.mission}><Text style={styles.flag}>{mission.mode === 'math' ? '🧮' : mission.mode === 'type' ? '🔎' : '🏁'}</Text><View style={styles.missionCopy}><Text style={styles.missionSmall}>MISIÓN {missionIndex + 1}</Text><Text style={styles.question}>{mission.prompt}</Text></View></View>
      <View style={styles.options}>{options.map((number, index) => <Animated.View entering={ZoomIn.delay(index * 80)} key={number} style={styles.optionWrap}><Pressable onPress={() => answer(number)} style={({ pressed }) => [styles.numberButton, pressed && styles.pressed]}><Text style={styles.number}>{number}</Text></Pressable></Animated.View>)}</View>
      <LevelCompleteModal visible={levelComplete} game="counting" level={level} hasNext={level < 3} onNext={() => { setLevelComplete(false); setMissionIndex((v) => v + 1); resetRoad(); }} onReplay={() => { setLevelComplete(false); setMissionIndex((level - 1) * 2); resetRoad(); }} onHome={() => navigation.navigate('Home')} />
    </GameScreen>
  );
}
const styles = StyleSheet.create({ levels: { flexDirection: 'row', gap: 6 }, levelChip: { flex: 1, paddingVertical: 7, paddingHorizontal: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' }, levelActive: { backgroundColor: '#FFF1AA' }, levelText: { color: '#D9FFFF', fontSize: 10, fontWeight: '800', textAlign: 'center' }, levelTextActive: { color: '#17305E' }, city: { height: 225, borderRadius: 28, backgroundColor: '#A8E4F7', overflow: 'hidden', justifyContent: 'flex-end' }, skyline: { position: 'absolute', top: 20, color: '#6388A0', fontSize: 38, opacity: 0.7 }, trafficLight: { position: 'absolute', right: 14, top: 18, fontSize: 43 }, targetBadge: { position: 'absolute', left: 12, top: 14, backgroundColor: '#FFFFFF', borderRadius: 13, padding: 8 }, targetText: { color: '#17305E', fontSize: 13, fontWeight: '900' }, roadLines: { position: 'absolute', bottom: 55, flexDirection: 'row', gap: 32, left: 15 }, line: { width: 42, height: 6, borderRadius: 3, backgroundColor: '#FFF1A8' }, convoy: { height: 82, backgroundColor: '#35415A', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }, carWrap: { width: 48, alignItems: 'center' }, car: { fontSize: 38 }, targetDot: { position: 'absolute', bottom: -10, color: '#FFF1AA', fontSize: 28 }, mission: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 13 }, flag: { fontSize: 35 }, missionCopy: { flex: 1 }, missionSmall: { color: '#069C98', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 }, question: { color: '#17305E', fontSize: 18, lineHeight: 22, fontWeight: '900' }, options: { flexDirection: 'row', gap: 12 }, optionWrap: { flex: 1 }, numberButton: { height: 86, borderRadius: 24, backgroundColor: '#FFF1AA', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderBottomColor: '#D8A92D' }, pressed: { transform: [{ scale: 0.93 }] }, number: { color: '#17305E', fontSize: 38, fontWeight: '900', fontVariant: ['tabular-nums'] } });
