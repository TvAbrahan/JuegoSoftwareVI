import { useEffect } from 'react';
import { setAudioModeAsync } from 'expo-audio';
import Navigation from "./navigation/StackNavigator";

export default function App() {
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  return <Navigation />;
}
