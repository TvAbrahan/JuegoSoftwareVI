import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { BounceIn, FadeInRight, SlideInLeft, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import GameScreen from '../components/GameScreen';
import LevelCompleteModal from '../components/LevelCompleteModal';
import useGameSounds from '../hooks/useGameSounds';
import useIconSounds from '../hooks/useIconSounds';

const ROUTES = [
  { mode: 'next', sequence: ['🏎️', '🚙', '🏎️', '🚙'], answer: '🏎️', options: ['🚕', '🏎️', '🚙'], place: 'Playa', prompt: '¿Quién sigue en la fila?' },
  { mode: 'next', sequence: ['🚕', '🚕', '🚓', '🚕', '🚕'], answer: '🚓', options: ['🚓', '🚑', '🚚'], place: 'Ciudad', prompt: 'Completa el patrón' },
  { mode: 'intruder', sequence: ['🚗', '🚚', '🚗', '🚑', '🚗', '🚚'], answer: '🚑', options: ['🚗', '🚑', '🚚'], place: 'Desierto', prompt: '¿Quién se metió en la fila?' },
  { mode: 'intruder', sequence: ['🚓', '🚕', '🚓', '🚕', '🚜', '🚕'], answer: '🚜', options: ['🚓', '🚕', '🚜'], place: 'Bosque', prompt: 'Encuentra al intruso' },
  { mode: 'double', sequence: ['🏎️', '🚙', '🚕', '🏎️', '🚙', '🚕'], answer: '🏎️ 🚙', options: ['🚕 🏎️', '🏎️ 🚙', '🚙 🚕'], place: 'Montaña', prompt: '¿Qué dos vehículos siguen?' },
  { mode: 'double', sequence: ['🚗', '🚗', '🚚', '🚗', '🚗', '🚚'], answer: '🚗 🚗', options: ['🚚 🚗', '🚗 🚗', '🚗 🚚'], place: 'Gran final', prompt: 'Completa dos espacios' },
];

export default function PatternGameScreen({ navigation }) {
  const [route, setRoute] = useState(0);
  const [message, setMessage] = useState('Observa el tráfico y completa la caravana');
  const [chosen, setChosen] = useState(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const roadX = useSharedValue(0);
  const sounds = useGameSounds();
  const { playIcon } = useIconSounds();
  const mission = ROUTES[route % ROUTES.length];
  const level = route < 2 ? 1 : route < 4 ? 2 : 3;
  const roadStyle = useAnimatedStyle(() => ({ transform: [{ translateX: roadX.value }] }));

  const drive = (vehicle) => {
    playIcon(vehicle.split(' ')[0]);
    setChosen(vehicle);
    if (vehicle === mission.answer) {
      setMessage(mission.mode === 'intruder' ? '¡Intruso detectado! Ruta asegurada.' : `¡Caravana lista! Viajando a ${mission.place}…`);
      roadX.value = withSequence(withSpring(-12), withTiming(500, { duration: 900 }));
      setTimeout(() => { if (route % 2 === 1) setLevelComplete(true); else { setRoute((value) => value + 1); setChosen(null); roadX.value = -500; roadX.value = withSpring(0); setMessage('👀 🚗'); } }, 1150);
    } else {
      setMessage(mission.mode === 'intruder' ? 'Ese sí pertenece a la secuencia. Busca el diferente.' : 'Esa opción rompe el patrón. ¡Mira quién se repite!');
      roadX.value = withSequence(withTiming(-9, { duration: 70 }), withTiming(9, { duration: 70 }), withSpring(0));
      setTimeout(() => setChosen(null), 500);
    }
  };

  return (
    <GameScreen navigation={navigation} color="#E87922" title="Caravana extrema" subtitle={message} score={`Nivel ${level} • ${route + 1}/${ROUTES.length}`}>
      <View style={styles.levels}>{['Continuar', 'Detective', 'Doble patrón'].map((name, index) => <View key={name} style={[styles.levelChip, index + 1 === level && styles.levelActive]}><Text style={[styles.levelText, index + 1 === level && styles.levelTextActive]}>{index + 1}. {name}</Text></View>)}</View>
      <View style={styles.map}><Text style={styles.clouds}>☁️　　　　　　☁️</Text><View style={styles.destination}><Text style={styles.destinationIcon}>🏁</Text><Text style={styles.destinationText}>{mission.place}</Text></View>
        <View style={styles.road}><View style={styles.dashes}>{[1, 2, 3, 4, 5].map((dash) => <View key={dash} style={styles.dash} />)}</View>
          <Animated.View key={route} style={[styles.traffic, roadStyle]}>{mission.sequence.map((car, index) => <Animated.Text accessibilityRole="button" accessibilityLabel="Escuchar vehículo" onPress={() => playIcon(car)} entering={SlideInLeft.delay(index * 90).springify()} key={`${car}-${index}`} style={[styles.car, mission.mode === 'intruder' && chosen === car && car === mission.answer && styles.markedCar]}>{car}</Animated.Text>)}{mission.mode !== 'intruder' && <View style={[styles.emptySlot, mission.mode === 'double' && styles.doubleSlot]}>{chosen ? <Animated.Text entering={BounceIn} style={styles.chosen}>{chosen}</Animated.Text> : <Text style={styles.question}>{mission.mode === 'double' ? '??' : '?'}</Text>}</View>}</Animated.View>
        </View>
      </View>
      <View style={styles.radio}><Text style={styles.radioIcon}>{mission.mode === 'intruder' ? '🕵️' : '📻'}</Text><View style={styles.radioCopy}><Text style={styles.radioLabel}>{mission.mode === 'intruder' ? 'MODO DETECTIVE' : 'MENSAJE DEL EQUIPO'}</Text><Text style={styles.radioText}>{mission.prompt}</Text></View></View>
      <View style={styles.options}>{mission.options.map((vehicle, index) => <Animated.View entering={FadeInRight.delay(index * 90)} key={vehicle} style={styles.optionWrap}><Pressable accessibilityLabel={`Elegir ${vehicle}`} onPress={() => drive(vehicle)} style={({ pressed }) => [styles.vehicleButton, pressed && styles.pressed]}><Text style={styles.vehicle}>{vehicle}</Text><Text style={styles.go}>ENVIAR</Text></Pressable></Animated.View>)}</View>
      <LevelCompleteModal visible={levelComplete} game="patterns" level={level} hasNext={level < 3} onNext={() => { setLevelComplete(false); setRoute((value) => value + 1); setChosen(null); roadX.value = 0; setMessage('👀 🚗'); }} onReplay={() => { setLevelComplete(false); setRoute((level - 1) * 2); setChosen(null); roadX.value = 0; setMessage('👀 🚗'); }} onHome={() => navigation.navigate('Home')} />
    </GameScreen>
  );
}

const styles = StyleSheet.create({
  levels: { flexDirection: 'row', gap: 6 }, levelChip: { flex: 1, paddingVertical: 7, paddingHorizontal: 3, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' }, levelActive: { backgroundColor: '#FFF4D0' }, levelText: { color: '#FFF5E5', fontSize: 10, fontWeight: '800', textAlign: 'center' }, levelTextActive: { color: '#8B4312' },
  map: { height: 255, borderRadius: 28, backgroundColor: '#8AD9F5', overflow: 'hidden', justifyContent: 'flex-end' }, clouds: { position: 'absolute', top: 13, fontSize: 29 }, destination: { position: 'absolute', right: 12, top: 10, backgroundColor: '#FFFFFF', borderRadius: 17, padding: 8, alignItems: 'center' }, destinationIcon: { fontSize: 24 }, destinationText: { color: '#17305E', fontSize: 11, fontWeight: '900' }, road: { height: 125, backgroundColor: '#35415A', justifyContent: 'center' }, dashes: { position: 'absolute', flexDirection: 'row', gap: 26, left: 15 }, dash: { width: 35, height: 5, borderRadius: 3, backgroundColor: '#FFD75C' }, traffic: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }, car: { fontSize: 34, width: 44 }, markedCar: { backgroundColor: '#FFD75C', borderRadius: 10 }, emptySlot: { width: 46, height: 55, borderRadius: 15, borderWidth: 3, borderStyle: 'dashed', borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, doubleSlot: { width: 78 }, question: { color: '#FFFFFF', fontSize: 27, fontWeight: '900' }, chosen: { fontSize: 30 },
  radio: { backgroundColor: '#FFF4D0', borderRadius: 21, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }, radioIcon: { fontSize: 32 }, radioCopy: { flex: 1 }, radioLabel: { color: '#D26B1F', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, radioText: { color: '#17305E', fontSize: 17, fontWeight: '900' },
  options: { flexDirection: 'row', gap: 10 }, optionWrap: { flex: 1 }, vehicleButton: { height: 105, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderBottomColor: '#D7C8B6' }, pressed: { transform: [{ scale: 0.92 }] }, vehicle: { fontSize: 43 }, go: { color: '#D26B1F', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});
