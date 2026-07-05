// Pantallas/MemoryGameScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';

// Lista de 6 transportes únicos para crear las parejas (Total: 12 tarjetas)
const TRANSPORTES_BASE = [
  { emoji: '🚑', nombre: 'Ambulancia' },
  { emoji: '🚓', nombre: 'Policía' },
  { emoji: '🚁', nombre: 'Helicóptero' },
  { emoji: '🚂', nombre: 'Tren' },
  { emoji: '🚕', nombre: 'Taxi' },
  { emoji: '🚢', nombre: 'Barco' },
];

// Función para generar y mezclar el tablero de juego
const generarTablero = () => {
  // Duplicamos la lista para tener parejas
  const tarjetasDuplicadas = [...TRANSPORTES_BASE, ...TRANSPORTES_BASE];
  
  // Les asignamos un ID único a cada una y estados iniciales
  return tarjetasDuplicadas
    .map((item, index) => ({
      id: index,
      emoji: item.emoji,
      nombre: item.nombre,
      descubierto: false,
      completado: false,
    }))
    .sort(() => Math.random() - 0.5); // Mezclar al azar
};

export default function MemoryGameScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [movimientos, setMovimientos] = useState(0);

  // Iniciar el tablero cuando se abre la pantalla
  useEffect(() => {
    setCards(generarTablero());
  }, []);

  const seleccionarTarjeta = (index) => {
    // Evitar que voltee la misma, una ya completada, o más de 2 a la vez
    if (cards[index].descubierto || cards[index].completado || seleccionadas.length >= 2) return;

    const nuevasCards = [...cards];
    nuevasCards[index].descubierto = true;
    setCards(nuevasCards);

    setSeleccionadas([...seleccionadas, index]);
  };

  // Lógica para revisar si las dos tarjetas volteadas son iguales
  useEffect(() => {
    if (seleccionadas.length === 2) {
      setMovimientos(prev => prev + 1);
      const [idx1, idx2] = seleccionadas;

      if (cards[idx1].emoji === cards[idx2].emoji) {
        // ¡Encontró una pareja!
        const nuevasCards = [...cards];
        nuevasCards[idx1].completado = true;
        nuevasCards[idx2].completado = true;
        setCards(nuevasCards);
        setSeleccionadas([]);
      } else {
        // No son iguales, se vuelven a tapar en 1 segundo
        setTimeout(() => {
          const nuevasCards = [...cards];
          nuevasCards[idx1].descubierto = false;
          nuevasCards[idx2].descubierto = false;
          setCards(nuevasCards);
          setSeleccionadas([]);
        }, 1000);
      }
    }
  }, [seleccionadas]);

  const reiniciarJuego = () => {
    setCards(generarTablero());
    setSeleccionadas([]);
    setMovimientos(0);
  };

  // El juego termina cuando todas las tarjetas están completadas
  const yaGano = cards.length > 0 && cards.every(c => c.completado);

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón Volver e Info */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backText}>⬅ Menú</Text>
        </TouchableOpacity>
        <Text style={styles.scoreText}>Intentos: {movimientos}</Text>
      </View>

      <Text style={styles.title}>¡Gran Memoria de Autos! 🧠</Text>

      {/* Tablero de 3 columnas x 4 filas (Ajustado para que quepa en cualquier pantalla) */}
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card, 
              (card.descubierto || card.completado) ? styles.cardOpen : styles.cardClosed
            ]}
            onPress={() => seleccionarTarjeta(index)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardText}>
              {(card.descubierto || card.completado) ? card.emoji : '❓'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pantalla de Ganador */}
      {yaGano && (
        <View style={styles.winBox}>
          <Text style={styles.winText}>🎉 ¡ERES UN CAMPEÓN! 🎉</Text>
          <Text style={styles.subWinText}>Logrado en {movimientos} intentos</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={reiniciarJuego}>
            <Text style={styles.resetText}>¡Jugar de nuevo! 🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9C27B0', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  header: { flexDirection: 'row', width: '90%', justifyContent: 'space-between', alignItems: 'center' },
  back: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  backText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  scoreText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 5 },
  
  // El Grid distribuye las tarjetas en filas de 3 de forma fluida
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 360, marginVertical: 10 },
  
  // Tamaño óptimo para que entren las 12 tarjetas sin salir de la pantalla
  card: { width: 95, height: 95, margin: 8, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 3 },
  cardClosed: { backgroundColor: '#FFF', borderBottomWidth: 5, borderColor: '#DDD' },
  cardOpen: { backgroundColor: '#FFD700', borderBottomWidth: 0 },
  cardText: { fontSize: 45 },
  
  winBox: { backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', padding: 20 },
  winText: { fontSize: 28, color: '#FFD700', fontWeight: 'bold', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
  subWinText: { fontSize: 18, color: '#FFF', marginVertical: 10, fontWeight: '500' },
  resetBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, marginTop: 10, elevation: 5 },
  resetText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});