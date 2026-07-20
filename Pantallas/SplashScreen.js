import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function SplashScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const carX = useRef(new Animated.Value(-width)).current;
  const scale = useRef(new Animated.Value(0.75)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(carX, { toValue: width * 0.1, duration: 1400, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('Home'), 2200);
    return () => clearTimeout(timer);
  }, [carX, fade, navigation, scale, width]);
  return (
    <View style={styles.screen}>
      <View style={styles.sun}><Text style={styles.sunText}>★</Text></View>
      <Animated.View style={[styles.logo, { opacity: fade, transform: [{ scale }] }]}>
        <Text style={styles.kicker}>APRENDE • JUEGA • SONRÍE</Text><Text style={styles.title}>Hot Wheels</Text><Text style={styles.subtitle}>KIDS ADVENTURE</Text>
      </Animated.View>
      <View style={styles.road}><View style={styles.roadLine} /><Animated.Text style={[styles.car, { transform: [{ translateX: carX }] }]}>🏎️</Animated.Text></View>
      <Animated.Text style={[styles.welcome, { opacity: fade }]}>¡Preparando tu aventura!</Animated.Text>
      <View style={styles.dots}><View style={styles.dot} /><View style={[styles.dot, styles.dotLight]} /><View style={[styles.dot, styles.dotLight]} /></View>
    </View>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#4CA9F5', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }, sun: { position: 'absolute', top: 70, right: 34, width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFD447', alignItems: 'center', justifyContent: 'center' }, sunText: { color: '#FFFFFF', fontSize: 35 }, logo: { backgroundColor: '#FFFFFF', borderRadius: 32, paddingHorizontal: 27, paddingVertical: 24, alignItems: 'center', borderBottomWidth: 8, borderBottomColor: '#D8E8F7' }, kicker: { color: '#ED5C5C', fontSize: 11, letterSpacing: 1.2, fontWeight: '900' }, title: { color: '#17305E', fontSize: 42, lineHeight: 48, fontWeight: '900' }, subtitle: { color: '#F28C28', fontSize: 16, letterSpacing: 2.4, fontWeight: '900' }, road: { width: '100%', height: 82, backgroundColor: '#35415A', marginTop: 42, justifyContent: 'center' }, roadLine: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: '#FFD447' }, car: { fontSize: 55 }, welcome: { color: '#FFFFFF', fontSize: 19, fontWeight: '900', paddingTop: 28 }, dots: { flexDirection: 'row', gap: 8, paddingTop: 14 }, dot: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }, dotLight: { width: 8, opacity: 0.5 } });
