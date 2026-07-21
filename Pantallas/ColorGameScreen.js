import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { BounceIn, FadeIn, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import GameScreen from '../components/GameScreen';
import LevelCompleteModal from '../components/LevelCompleteModal';
import useGameSounds from '../hooks/useGameSounds';
import useIconSounds from '../hooks/useIconSounds';

const PAINTS = [
  { name: 'rojo', color: '#F04452' }, { name: 'azul', color: '#3185E7' },
  { name: 'amarillo', color: '#F8C537' }, { name: 'verde', color: '#43B96A' },
];
const DECALS = ['⚡', '⭐', '🔥', '🏁'];
const MISSIONS = [
  { type: 'paint', color: 'rojo', title: 'Pedido rápido', help: 'Pinta el auto del color pedido' },
  { type: 'paint', color: 'azul', title: 'Auto de policía', help: 'Encuentra el color correcto' },
  { type: 'decal', color: 'amarillo', decal: '⚡', title: 'Diseño especial', help: 'Primero pinta y luego decora' },
  { type: 'decal', color: 'verde', decal: '🏁', title: 'Edición de carrera', help: 'Completa las dos etapas' },
  { type: 'mix', colors: ['rojo', 'amarillo'], result: '#F28A2E', resultName: 'naranja', title: 'Laboratorio de pintura', help: 'Combina dos colores diferentes' },
  { type: 'mix', colors: ['rojo', 'azul'], result: '#8D56C2', resultName: 'morado', title: 'Mezcla experta', help: 'Crea un color nuevo' },
];

export default function ColorGameScreen({ navigation }) {
  const [missionIndex, setMissionIndex] = useState(0);
  const [paint, setPaint] = useState('#D9E2EC');
  const [decal, setDecal] = useState('');
  const [phase, setPhase] = useState('paint');
  const [mix, setMix] = useState([]);
  const [message, setMessage] = useState('¡Recibimos una misión nueva!');
  const [levelComplete, setLevelComplete] = useState(false);
  const carScale = useSharedValue(1);
  const sprayOpacity = useSharedValue(0);
  const sounds = useGameSounds();
  const { playIcon } = useIconSounds();
  const mission = MISSIONS[missionIndex % MISSIONS.length];
  const level = missionIndex < 2 ? 1 : missionIndex < 4 ? 2 : 3;
  const progress = useMemo(() => `${missionIndex + 1}/${MISSIONS.length}`, [missionIndex]);
  const carStyle = useAnimatedStyle(() => ({ transform: [{ scale: carScale.value }] }));
  const sprayStyle = useAnimatedStyle(() => ({ opacity: sprayOpacity.value }));

  const animatePaint = () => {
    sprayOpacity.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 260 }));
    carScale.value = withSequence(withSpring(0.93), withSpring(1));
  };
  const resetCar = () => { setPaint('#D9E2EC'); setDecal(''); setMix([]); setPhase('paint'); setMessage('👀 🎨'); carScale.value = withSpring(1); };
  const finish = (text) => {
    setMessage(text); carScale.value = withSequence(withSpring(1.08), withTiming(0, { duration: 420 }));
    setTimeout(() => {
      if (missionIndex % 2 === 1) setLevelComplete(true); else { setMissionIndex((value) => value + 1); resetCar(); }
    }, 850);
  };
  const selectPaint = (choice) => {
    playIcon('spray');
    animatePaint();
    if (mission.type === 'mix') {
      if (mix.includes(choice.name)) return;
      const next = [...mix, choice.name].slice(-2); setMix(next); setPaint(choice.color);
      if (next.length === 2) {
        const correct = mission.colors.every((name) => next.includes(name));
        if (correct) { setPaint(mission.result); sounds.playCorrect(); finish(`¡Creaste ${mission.resultName}!`); }
        else { sounds.playTryAgain(); setMessage('Esa mezcla no funciona. Vacía y prueba otra.'); setMix([]); setTimeout(() => setPaint('#D9E2EC'), 450); }
      } else { sounds.playTap(); setMessage(`Añadiste ${choice.name}. Falta otro color.`); }
      return;
    }
    setPaint(choice.color);
    if (choice.name !== mission.color) { sounds.playTryAgain(); setMessage(`Ese es ${choice.name}. Revisa la orden.`); return; }
    sounds.playCorrect();
    if (mission.type === 'decal') { setPhase('decal'); setMessage('¡Pintura lista! Ahora elige la calcomanía.'); }
    else finish('¡Color perfecto! Saliendo del taller…');
  };
  const selectDecal = (choice) => {
    setDecal(choice); carScale.value = withSequence(withSpring(0.94), withSpring(1));
    if (choice === mission.decal) finish('¡Diseño completo! Gran trabajo.');
    else { sounds.playTryAgain(); setMessage('Esa calcomanía no aparece en la orden.'); }
  };

  return (
    <GameScreen navigation={navigation} color="#5947C5" title="Taller de pintura" subtitle={message} score={`Nivel ${level} • ${progress}`}>
      <View style={styles.levelBar}><View style={[styles.levelFill, { width: `${((missionIndex + 1) / MISSIONS.length) * 100}%` }]} /></View>
      <View style={styles.orderCard}><Text style={styles.orderLabel}>{mission.title.toUpperCase()}</Text><Text style={styles.orderText}>{mission.type === 'mix' ? `Crear color ${mission.resultName}` : `Auto ${mission.color}${mission.decal ? ` + ${mission.decal}` : ''}`}</Text><Text style={styles.orderHelp}>{mission.help}</Text></View>
      <View style={styles.garage}><Text style={styles.lights}>💡　💡　💡</Text><Animated.View style={[styles.spray, sprayStyle]}><Text style={styles.sprayText}>✦ ✦ ✦</Text></Animated.View>
        <Animated.View accessibilityRole="button" accessibilityLabel="Escuchar auto" onTouchEnd={() => playIcon('race')} entering={FadeIn} style={[styles.car, carStyle]}><View style={[styles.roof, { backgroundColor: paint }]}><View style={styles.window} /></View><View style={[styles.body, { backgroundColor: paint }]}><Text style={styles.decal}>{decal || ' '}</Text><View style={styles.light} /></View><View style={styles.wheels}><View style={styles.wheel} /><View style={styles.wheel} /></View></Animated.View><View style={styles.floor} /></View>
      <Text style={styles.instruction}>{phase === 'decal' ? 'Elige la calcomanía' : mission.type === 'mix' ? `Mezcla 2 colores • ${mix.length}/2` : 'Elige la pintura'}</Text>
      <View style={styles.palette}>{(phase === 'decal' ? DECALS : PAINTS).map((choice, index) => {
        const key = typeof choice === 'string' ? choice : choice.name;
        return <Animated.View key={key} entering={BounceIn.delay(index * 60)} style={styles.paintWrap}><Pressable onPress={() => phase === 'decal' ? selectDecal(choice) : selectPaint(choice)} style={({ pressed }) => [styles.paintButton, { backgroundColor: typeof choice === 'string' ? '#FFFFFF' : choice.color }, pressed && styles.pressed]}><Text style={[styles.choiceIcon, typeof choice !== 'string' && styles.can]}>{typeof choice === 'string' ? choice : '▥'}</Text><Text style={[styles.paintName, typeof choice === 'string' && styles.dark]}>{typeof choice === 'string' ? 'elegir' : choice.name}</Text></Pressable></Animated.View>;
      })}</View>
      <LevelCompleteModal visible={levelComplete} game="colors" level={level} hasNext={level < 3} onNext={() => { setLevelComplete(false); setMissionIndex((v) => v + 1); resetCar(); }} onReplay={() => { setLevelComplete(false); setMissionIndex((level - 1) * 2); resetCar(); }} onHome={() => navigation.navigate('Home')} />
    </GameScreen>
  );
}

const styles = StyleSheet.create({ levelBar: { height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' }, levelFill: { height: '100%', borderRadius: 5, backgroundColor: '#FFD75C' }, orderCard: { backgroundColor: '#FFF5C7', borderRadius: 22, padding: 15, borderWidth: 3, borderColor: '#F3C643' }, orderLabel: { color: '#8B6816', fontSize: 11, fontWeight: '900', letterSpacing: 1.3 }, orderText: { color: '#352B4F', fontSize: 20, fontWeight: '900', paddingTop: 3 }, orderHelp: { color: '#75677E', fontSize: 13, fontWeight: '700', paddingTop: 2 }, garage: { height: 230, backgroundColor: '#26324B', borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }, lights: { position: 'absolute', top: 10, fontSize: 21 }, spray: { position: 'absolute', top: 68, zIndex: 4 }, sprayText: { color: '#FFFFFF', fontSize: 34 }, car: { width: 230, height: 125, alignItems: 'center', justifyContent: 'flex-end', zIndex: 2 }, roof: { width: 120, height: 54, borderTopLeftRadius: 35, borderTopRightRadius: 45, borderWidth: 4, borderColor: '#172033', justifyContent: 'center', alignItems: 'center' }, window: { width: 72, height: 30, borderTopLeftRadius: 20, borderTopRightRadius: 24, backgroundColor: '#9EE8FF' }, body: { width: 220, height: 56, borderRadius: 24, borderWidth: 4, borderColor: '#172033', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28 }, decal: { fontSize: 25 }, light: { width: 18, height: 12, borderRadius: 6, backgroundColor: '#FFF0A8' }, wheels: { position: 'absolute', bottom: -13, width: 165, flexDirection: 'row', justifyContent: 'space-between' }, wheel: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#121926', borderWidth: 8, borderColor: '#556078' }, floor: { height: 24, width: '100%', backgroundColor: '#151D2D' }, instruction: { color: '#FFFFFF', textAlign: 'center', fontSize: 18, fontWeight: '900' }, palette: { flexDirection: 'row', gap: 8 }, paintWrap: { flex: 1 }, paintButton: { minHeight: 78, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.2)' }, pressed: { transform: [{ scale: 0.92 }] }, choiceIcon: { fontSize: 29 }, can: { color: '#FFFFFF', fontWeight: '900' }, paintName: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }, dark: { color: '#17305E' } });
