import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { BounceIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import GameScreen from '../components/GameScreen';
import useGameSounds from '../hooks/useGameSounds';

const RACES = [
  { world: 'Ciudad', icon: '🏙️', questions: [{ q: '¿Qué vehículo apaga el fuego?', o: ['🚑', '🚒', '🚓'], a: '🚒' }, { q: '¿Cuál transporta muchas personas?', o: ['🏎️', '🚌', '🚜'], a: '🚌' }] },
  { world: 'Campo', icon: '🌾', questions: [{ q: '¿Cuál trabaja en la granja?', o: ['🚜', '🚕', '🚓'], a: '🚜' }, { q: '¿Cuál lleva carga pesada?', o: ['🚲', '🚚', '🏎️'], a: '🚚' }] },
  { world: 'Pista final', icon: '🏁', questions: [{ q: '¿Qué auto está hecho para competir?', o: ['🚑', '🏎️', '🚌'], a: '🏎️' }, { q: 'La luz está roja. ¿Qué debes hacer?', o: ['💨', '🛑', '🏁'], a: '🛑' }, { q: 'La luz está verde. ¿Qué haces?', o: ['🚦', '▶️', '🅿️'], a: '▶️' }] },
];
export default function RaceGameScreen({ navigation }) {
  const [race, setRace] = useState(0); const [question, setQuestion] = useState(0); const [message, setMessage] = useState('¡Responde para acelerar!'); const x = useSharedValue(0); const sounds = useGameSounds();
  const stage = RACES[race]; const item = stage.questions[question]; const carStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const choose = (option) => { if (option !== item.a) { sounds.playTryAgain(); setMessage('Perdiste un poco de velocidad. ¡Prueba otra vez!'); x.value = withSpring(Math.max(0, x.value - 12)); return; } sounds.playCorrect(); x.value = withSpring((question + 1) * 95); if (question + 1 < stage.questions.length) { setQuestion((v) => v + 1); setMessage('¡Bien! Se acerca otra curva.'); } else { sounds.playWin(); setMessage(`¡Ganaste la etapa ${stage.world}!`); setTimeout(() => { setRace((v) => (v + 1) % RACES.length); setQuestion(0); x.value = 0; setMessage('¡Nueva pista desbloqueada!'); }, 1000); } };
  return <GameScreen navigation={navigation} color={race === 0 ? '#F08A24' : race === 1 ? '#3DA867' : '#D64E45'} title="Copa de conocimientos" subtitle={message} score={`Etapa ${race + 1}/3`}>
    <View style={styles.world}><Text style={styles.worldIcon}>{stage.icon}</Text><View><Text style={styles.worldLabel}>PISTA ACTUAL</Text><Text style={styles.worldName}>{stage.world}</Text></View></View>
    <View style={styles.track}><View style={styles.dash} /><Animated.Text style={[styles.car, carStyle]}>🏎️</Animated.Text><Text style={styles.finish}>🏁</Text></View>
    <Animated.View key={`${race}-${question}`} entering={FadeInDown.springify()} style={styles.questionBox}><Text style={styles.lap}>RETO {question + 1}/{stage.questions.length}</Text><Text style={styles.question}>{item.q}</Text></Animated.View>
    <View style={styles.options}>{item.o.map((option, i) => <Animated.View entering={BounceIn.delay(i * 80)} key={option} style={styles.optionWrap}><Pressable onPress={() => choose(option)} style={({ pressed }) => [styles.option, pressed && styles.pressed]}><Text style={styles.optionText}>{option}</Text></Pressable></Animated.View>)}</View>
  </GameScreen>;
}
const styles = StyleSheet.create({ world: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }, worldIcon: { fontSize: 39 }, worldLabel: { color: '#E16D18', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, worldName: { color: '#17305E', fontSize: 21, fontWeight: '900' }, track: { height: 95, backgroundColor: '#35415A', borderRadius: 22, justifyContent: 'center', overflow: 'hidden' }, dash: { height: 5, backgroundColor: '#FFD75C' }, car: { position: 'absolute', left: 7, fontSize: 48 }, finish: { position: 'absolute', right: 8, fontSize: 42 }, questionBox: { backgroundColor: '#FFF4D0', borderRadius: 24, padding: 19 }, lap: { color: '#D56518', fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }, question: { color: '#17305E', fontSize: 23, lineHeight: 28, fontWeight: '900', paddingTop: 4 }, options: { flexDirection: 'row', gap: 10 }, optionWrap: { flex: 1 }, option: { height: 100, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderBottomColor: '#D7C8B6' }, pressed: { transform: [{ scale: 0.92 }] }, optionText: { fontSize: 44 } });
