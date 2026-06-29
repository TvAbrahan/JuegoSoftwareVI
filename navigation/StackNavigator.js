// navigation/StackNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import SplashScreen from '../Pantallas/SplashScreen';
import HomeScreen from '../Pantallas/HomeScreen';
import QuizScreen from '../Pantallas/QuizScreen';
//import SoundGameScreen from '../Pantallas/SoundGameScreen';
//import MemoryGameScreen from '../Pantallas/MemoryGameScreen';
import RaceGameScreen from '../Pantallas/RaceGameScreen';

const Stack = createStackNavigator();


export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        {/* <Stack.Screen name="SoundGame" component={SoundGameScreen} /> */}
        {/* <Stack.Screen name="MemoryGame" component={MemoryGameScreen} /> */}
        <Stack.Screen name="RaceGame" component={RaceGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}