import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function BigButton({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5722",

    width: "85%",

    padding: 18,

    marginVertical: 10,

    borderRadius: 20,

    alignItems: "center",

    elevation: 8,
  },

  text: {
    fontSize: 24,

    color: "white",

    fontWeight: "bold",
  },
});