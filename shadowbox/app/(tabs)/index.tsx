import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { theme } from "../theme";
import { SBCard } from "../ui/SBCard";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>S</Text>
        </View>
        <View>
          <Text style={styles.hello}>Hola,</Text>
          <Text style={styles.name}>Oier</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <SBCard style={styles.statCard}>
          <Text style={styles.statLabel}>Sesiones completadas</Text>
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statSub}>/20 esta semana</Text>
        </SBCard>

        <SBCard style={styles.statCard}>
          <Text style={styles.statLabel}>Tiempo entrenado</Text>
          <Text style={styles.statValue}>4h 30m</Text>
          <Text style={styles.statSub}>esta semana</Text>
        </SBCard>
      </View>

      {/* Grid buttons */}
      <View style={styles.grid}>
        <Pressable style={[styles.bigCard, styles.blueGlow]} onPress={() => router.push("/workout")}>
          <Text style={styles.bigTitle}>Entrenar{`\n`}ahora</Text>
        </Pressable>

        <Pressable
          style={[styles.bigCard, styles.orangeGlow]}
          onPress={() => router.push("/(tabs)/train")}
        >
          <Text style={styles.bigTitle}>Generar{`\n`}plan</Text>
        </Pressable>

        <Pressable
          style={[styles.bigCard, styles.blueGlow]}
          onPress={() => router.push("/(tabs)/community")}
        >
          <Text style={styles.bigTitle}>Comunidad</Text>
        </Pressable>

        <Pressable
          style={[styles.bigCard, styles.orangeGlow]}
          onPress={() => router.push("/progress")}
        >
          <Text style={styles.bigTitle}>Progreso</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: 18,
    paddingTop: 26,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  hello: { color: theme.colors.muted, fontSize: 16 },
  name: { color: theme.colors.text, fontSize: 26, fontWeight: "800" },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 18 },
  statCard: { flex: 1 },
  statLabel: { color: theme.colors.muted, fontSize: 12, marginBottom: 6 },
  statValue: { color: theme.colors.text, fontSize: 22, fontWeight: "800" },
  statSub: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bigCard: {
    width: "48%",
    height: 140,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    justifyContent: "center",
  },
  bigTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },

  blueGlow: {
    shadowColor: theme.colors.blue,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  orangeGlow: {
    shadowColor: theme.colors.orange,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
});
