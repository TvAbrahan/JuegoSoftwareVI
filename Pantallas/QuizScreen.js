// Pantallas/QuizScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated } from 'react-native';

// Datos de los transportes con emojis grandes (perfecto para niños menores de 6 años)
const TRANSPORTES = [
  { id: '1', nombre: 'Ambulancia', emoji: '🚑', color: '#E3F2FD' },
  { id: '2', nombre: 'Camión de Bomberos', emoji: '🚒', color: '#FFEBEE' },
  { id: '3', nombre: 'Policía', emoji: '🚓', color: '#E8EAF6' },
  { id: '4', nombre: 'Autobús', emoji: '🚌', color: '#FFFDE7' },
];

export default function QuizScreen({ navigation }) {
  // Estado para la pregunta actual (comenzamos con la Ambulancia)
  const [preguntaCorrecta, setPreguntaCorrecta] = useState(TRANSPORTES[0]);
  const [mensajeFeedback, setMensajeFeedback] = useState('');
  const [estrellas, setEstrellas] = useState('');
  const [colorFondo, setColorFondo] = useState('#4CAF50'); // Fondo verde inicial amigable

  const handleSeleccion = (transporte) => {
    if (transporte.id === preguntaCorrecta.id) {
      // ¡ACERTÓ!
      setMensajeFeedback('¡Excelente! 🎉');
      setEstrellas('⭐⭐⭐⭐⭐');
      setColorFondo('#2ECC71'); // Cambia a un verde más brillante de éxito
    } else {
      // FALLÓ
      setMensajeFeedback('Intenta otra vez ❤️');
      setEstrellas('');
      setColorFondo('#E74C3C'); // Cambia a rojo suave temporalmente
      
      // Regresa al color normal después de 1.5 segundos para que lo vuelva a intentar
      setTimeout(() => {
        setColorFondo('#4CAF50');
        setMensajeFeedback('');
      }, 1500);
    }
  };

  // Función para cambiar a otra pregunta aleatoria y que el juego siga
  const siguientePregunta = () => {
    const indiceAleatorio = Math.floor(Math.random() * TRANSPORTES.length);
    setPreguntaCorrecta(TRANSPORTES[indiceAleatorio]);
    setMensajeFeedback('');
    setEstrellas('');
    setColorFondo('#4CAF50');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorFondo }]}>
      {/* Botón superior para regresar al menú */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.textoVolver}>⬅ Menú</Text>
      </TouchableOpacity>

      {/* Título de la pregunta */}
      <View style={styles.areaPregunta}>
        <Text style={styles.tituloPregunta}>¿Cuál es el transporte?</Text>
        <Text style={styles.nombreBuscar}>👉 {preguntaCorrecta.nombre} 👈</Text>
      </View>

      {/* Grid o área de opciones interactiva */}
      <View style={styles.gridOpciones}>
        {TRANSPORTES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.tarjetaOpcion, { backgroundColor: item.color }]}
            onPress={() => handleSeleccion(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.emojiTransporte}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback visual interactivo para los niños */}
      <View style={styles.areaFeedback}>
        <Text style={styles.textoEstrellas}>{estrellas}</Text>
        <Text style={styles.textoFeedback}>{mensajeFeedback}</Text>

        {/* Si acertó, le mostramos el botón grandote para pasar a otro transporte */}
        {estrellas !== '' && (
          <TouchableOpacity style={styles.botonSiguiente} onPress={siguientePregunta}>
            <Text style={styles.textoSiguiente}>¡Otro transporte! 🔄</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 30 },
  botonVolver: { alignSelf: 'flex-start', marginLeft: 20, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15 },
  textoVolver: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  areaPregunta: { alignItems: 'center', marginTop: 10, paddingHorizontal: 20 },
  tituloPregunta: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  nombreBuscar: { fontSize: 32, fontWeight: 'black', color: '#FFD700', marginTop: 10, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 3, textAlign: 'center' },
  gridOpciones: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 10 },
  tarjetaOpcion: { width: 140, height: 140, margin: 12, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  emojiTransporte: { fontSize: 75 },
  areaFeedback: { height: 160, alignItems: 'center', justifyContent: 'center', width: '100%' },
  textoEstrellas: { fontSize: 32, marginBottom: 5 },
  textoFeedback: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  botonSiguiente: { marginTop: 15, backgroundColor: '#FF9800', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25, elevation: 4 },
  textoSiguiente: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});