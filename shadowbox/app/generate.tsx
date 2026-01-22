import { View, Text, StyleSheet } from "react-native";

export default function GenerateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generar plan</Text>
      <Text style={styles.subtitle}>
        Aquí el usuario podrá crear un plan de entrenamiento personalizado.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#ff9f43",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
  },
});
