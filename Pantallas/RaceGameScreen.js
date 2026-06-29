// Pantallas/RaceGameScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function RaceGameScreen({ navigation }) {
  const [progress, setProgress] = useState(0); 
  const [hasWon, setHasWon] = useState(false);

  
  const questions = [
    { q: '¿Qué vehículo apaga el fuego?', opciones: ['🚑', '🚒', '🚓'], correcta: '🚒' },
    { q: '¿Cuál va por las vías del tren?', opciones: ['🚂', '🚗', '🛵'], correcta: '🚂' },
    { q: '¿Cuál vuela por el cielo?', opciones: ['🚜', '🚢', '🚀'], correcta: '🚀' },
  ];

  const [currentQ, setCurrentQ] = useState(0);

  const handleAnswer = (opcion) => {
    if (hasWon) return;

    if (opcion === questions[currentQ].correcta) {
      const nextProgress = progress + (width - 120) / questions.length;
      setProgress(nextProgress);

      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setHasWon(true);
      }
    } else {
      alert('¡Inténtalo otra vez! ❌');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏎️ ¡Carrera de Respuestas! 🏁</Text>

      {/* Pista de carreras */}
      <View style={styles.track}>
        <Animated.View style={[styles.carContainer, { left: progress }]}>
          <Text style={styles.car}>{hasWon ? '🎉' : '🏎️'}</Text>
        </Animated.View>
        <Text style={styles.finishLine}>🏁</Text>
      </View>

      {hasWon ? (
        <View style={styles.winBox}>
          <Text style={styles.winText}>🎉🎉🎉 ¡GANASTE! 🎉🎉🎉</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameBox}>
          <Text style={styles.question}>{questions[currentQ].q}</Text>
          <View style={styles.optionsRow}>
            {questions[currentQ].opciones.map((op, index) => (
              <TouchableOpacity key={index} style={styles.optionCard} onPress={() => handleAnswer(op)}>
                <Text style={styles.optionEmoji}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FF9800', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 30 },
  track: { height: 60, backgroundColor: '#333', borderRadius: 10, position: 'relative', justifyContent: 'center', marginVertical: 20, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#FFF', borderStyle: 'dashed' },
  carContainer: { position: 'absolute' },
  car: { fontSize: 35 },
  finishLine: { position: 'absolute', right: 10, fontSize: 30 },
  gameBox: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 20, borderRadius: 20, alignItems: 'center' },
  question: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  optionCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, elevation: 3 },
  optionEmoji: { fontSize: 45 },
  winBox: { alignItems: 'center', marginTop: 20 },
  winText: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  backBtn: { backgroundColor: '#FFF', padding: 15, borderRadius: 20, marginTop: 20 },
  backText: { fontSize: 18, fontWeight: 'bold', color: '#FF9800' }
});