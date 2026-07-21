import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { BounceIn, FadeInDown } from 'react-native-reanimated';
import GameScreen from '../components/GameScreen';
import LevelCompleteModal from '../components/LevelCompleteModal';
import useIconSounds from '../hooks/useIconSounds';

const VEHICLES = [{ id: 'ambulance', name: 'Ambulancia', icon: '🚑' }, { id: 'fire', name: 'Bomberos', icon: '🚒' }, { id: 'police', name: 'Policía', icon: '🚓' }, { id: 'bus', name: 'Autobús', icon: '🚌' }];
const MISSIONS = [
  { mode: 'name', answer: 'ambulance', question: 'Encuentra la Ambulancia' },
  { mode: 'name', answer: 'bus', question: 'Encuentra el Autobús' },
  { mode: 'job', answer: 'fire', question: '¿Quién apaga los incendios?' },
  { mode: 'job', answer: 'police', question: '¿Quién protege la ciudad?' },
  { mode: 'situation', answer: 'ambulance', question: 'Hay una persona herida. ¿A quién llamas?' },
  { mode: 'situation', answer: 'bus', question: 'Muchas personas van a la escuela. ¿Qué usan?' },
];
export default function QuizScreen({ navigation }) {
  const [missionIndex, setMissionIndex] = useState(0); const [message, setMessage] = useState('👀'); const [levelComplete, setLevelComplete] = useState(false); const { playIcon } = useIconSounds();
  const mission = MISSIONS[missionIndex]; const level = missionIndex < 2 ? 1 : missionIndex < 4 ? 2 : 3;
  const choose = (vehicle) => { playIcon(vehicle.id); if (vehicle.id === mission.answer) { setMessage('⭐'); setTimeout(() => { if (missionIndex % 2 === 1) setLevelComplete(true); else { setMissionIndex((v) => v + 1); setMessage('👀'); } }, 1000); } else { setMessage('🔁'); } };
  return <GameScreen navigation={navigation} color="#3DA867" title="Centro de rescate" subtitle={message} score={`Nivel ${level} • ${missionIndex + 1}/6`}>
    <View style={styles.levels}>{['Nombres', 'Trabajos', 'Emergencias'].map((name, i) => <View key={name} style={[styles.level, i + 1 === level && styles.active]}><Text style={[styles.levelText, i + 1 === level && styles.activeText]}>{i + 1}. {name}</Text></View>)}</View>
    <Animated.View key={missionIndex} entering={FadeInDown.springify()} style={styles.dispatch}><Text style={styles.radio}>📡</Text><Text style={styles.question}>{mission.question}</Text></Animated.View>
    <View style={styles.city}><Text style={styles.cityTop}>🏥　　　🏫　　　🏢</Text><View style={styles.road} /></View>
    <View style={styles.grid}>{VEHICLES.map((vehicle, i) => <Animated.View entering={BounceIn.delay(i * 70)} key={vehicle.id} style={styles.wrap}><TouchableOpacity activeOpacity={0.75} style={styles.card} onPress={() => choose(vehicle)}><Text style={styles.icon}>{vehicle.icon}</Text><Text style={styles.name}>{vehicle.name}</Text></TouchableOpacity></Animated.View>)}</View>
    <LevelCompleteModal visible={levelComplete} game="rescue" level={level} hasNext={level < 3} onNext={() => { setLevelComplete(false); setMissionIndex((v) => v + 1); setMessage('👀'); }} onReplay={() => { setLevelComplete(false); setMissionIndex((level - 1) * 2); setMessage('👀'); }} onHome={() => navigation.navigate('Home')} />
  </GameScreen>;
}
const styles = StyleSheet.create({ levels: { flexDirection: 'row', gap: 6 }, level: { flex: 1, borderRadius: 12, padding: 7, backgroundColor: 'rgba(255,255,255,0.2)' }, active: { backgroundColor: '#DFFFE9' }, levelText: { color: '#E9FFF0', fontSize: 10, fontWeight: '800', textAlign: 'center' }, activeText: { color: '#1C6740' }, dispatch: { minHeight: 105, borderRadius: 23, padding: 17, backgroundColor: '#FFF5C7', flexDirection: 'row', alignItems: 'center', gap: 13 }, radio: { fontSize: 37 }, question: { flex: 1, color: '#17305E', fontSize: 22, lineHeight: 27, fontWeight: '900' }, city: { height: 90, backgroundColor: '#A8E4F7', borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' }, cityTop: { fontSize: 33, paddingLeft: 10 }, road: { height: 25, backgroundColor: '#35415A', borderTopWidth: 4, borderTopColor: '#FFD75C' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, wrap: { width: '48%', flexGrow: 1 }, card: { minHeight: 118, backgroundColor: '#FFFFFF', borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderBottomColor: '#D4E4D8' }, icon: { fontSize: 50 }, name: { color: '#17305E', fontSize: 15, fontWeight: '900' } });
