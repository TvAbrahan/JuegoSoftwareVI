// Pantallas/HomeScreen.js
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import BigButton from '../components/BigButton';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🚗 Hot Wheels Kids</Text>
      <Text style={styles.stars}>★★★★★★★★★★★★</Text>

      <View style={styles.menu}>
         <BigButton title="JUGAR" color="#4CAF50" onPress={() => navigation.navigate('Quiz')} /> 
          <BigButton title="MEMORIA" color="#2196F3" onPress={() => navigation.navigate('MemoryGame')} />
        {/* <BigButton title="SONIDOS" color="#2196F3" onPress={() => navigation.navigate('SoundGame')} /> */}
        {/* <BigButton title="MEMORIA" color="#9C27B0" onPress={() => navigation.navigate('MemoryGame')} /> */}
        {/* <BigButton title="CARRERA" color="#FF9800" onPress={() => navigation.navigate('RaceGame')} /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  stars: { color: '#FFD700', fontSize: 16, marginBottom: 40 },
  menu: { width: '100%', alignItems: 'center' }
});