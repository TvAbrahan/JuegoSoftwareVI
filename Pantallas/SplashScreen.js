// Pantallas/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const carAnim = useRef(new Animated.Value(-150)).current; 
  const logoScale = useRef(new Animated.Value(0.3)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.timing(carAnim, {
        toValue: width / 2 - 40, 
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: logoScale }] }}>
        <Text style={styles.logoText}>HOT WHEELS</Text>
        <Text style={styles.subLogo}>Kids Adventure</Text>
      </Animated.View>

      <Text style={styles.stars}>⭐⭐⭐⭐</Text>

      <Animated.View style={[styles.carContainer, { transform: [{ translateX: carAnim }] }]}>
        <Text style={styles.car}>🚗</Text>
      </Animated.View>

      <Text style={styles.loading}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FF1F1F', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 40, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subLogo: { fontSize: 22, color: '#FFD700', fontWeight: 'bold', textAlign: 'center' },
  stars: { fontSize: 24, marginVertical: 15 },
  carContainer: { position: 'absolute', bottom: 160 },
  car: { fontSize: 75 },
  loading: { position: 'absolute', bottom: 50, color: '#FFF', fontSize: 18 }
});