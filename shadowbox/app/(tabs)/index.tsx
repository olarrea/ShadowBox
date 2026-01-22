import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.hello}>Hola,</Text>
          <Text style={styles.name}>Oier</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="hand-left" size={26} color="#4da3ff" />
          <Text style={styles.statText}>Sesiones</Text>
          <Text style={styles.statValue}>18</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={26} color="#ff9f43" />
          <Text style={styles.statText}>Tiempo</Text>
          <Text style={styles.statValue}>4h 30m</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        <Pressable
          style={[styles.card, styles.blueGlow]}
          onPress={() => router.push("/(tabs)/train")}
        >
          <Ionicons name="hand-left-outline" size={42} color="#4da3ff" />
          <Text style={styles.cardText}>Entrenar ahora</Text>
        </Pressable>

        <Pressable
          style={[styles.card, styles.orangeGlow]}
          onPress={() => router.push("/generate")}
        >
          <Ionicons name="target-outline" size={42} color="#ff9f43" />
          <Text style={styles.cardText}>Generar plan</Text>
        </Pressable>

        <Pressable
          style={[styles.card, styles.blueGlow]}
          onPress={() => router.push("/(tabs)/community")}
        >
          <Ionicons name="people-outline" size={42} color="#4da3ff" />
          <Text style={styles.cardText}>Comunidad</Text>
        </Pressable>

        <Pressable
          style={[styles.card, styles.orangeGlow]}
          onPress={() => router.push("/(tabs)/progress")}
        >
          <Ionicons name="bar-chart-outline" size={42} color="#ff9f43" />
          <Text style={styles.cardText}>Progreso</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#ff9f43",
  },

  hello: {
    color: "#ccc",
    fontSize: 16,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },

  statText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 6,
  },

  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    height: 140,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  cardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },

  blueGlow: {
    borderWidth: 2,
    borderColor: "#4da3ff",
  },

  orangeGlow: {
    borderWidth: 2,
    borderColor: "#ff9f43",
  },
});
