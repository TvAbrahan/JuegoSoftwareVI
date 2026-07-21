import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AnswerButton({ label, emoji, color = '#FFFFFF', onPress, disabled }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.75}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }, disabled && styles.disabled]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 120, minHeight: 92, flex: 1, padding: 14, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 5, borderBottomWidth: 5, borderBottomColor: 'rgba(23,48,94,0.16)' },
  emoji: { fontSize: 42 },
  label: { color: '#17305E', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  disabled: { opacity: 0.65 },
});
