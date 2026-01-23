import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProgressScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/ring_bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Progreso</Text>

      {/* Nivel */}
      <View style={styles.levelContainer}>
        <View style={styles.circle}>
          <Text style={styles.levelText}>Nivel 5</Text>
          <Text style={styles.percentText}>75% completado</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCardBlue}>
          <Ionicons name="time-outline" size={28} color="#4da6ff" />
          <Text style={styles.statLabel}>Tiempo total</Text>
          <Text style={styles.statValue}>12h 34m</Text>
        </View>

        <View style={styles.statCardBlue}>
          <Ionicons name="checkmark-done-outline" size={28} color="#4da6ff" />
          <Text style={styles.statLabel}>Sesiones</Text>
          <Text style={styles.statValue}>28</Text>
        </View>

        <View style={styles.statCardOrange}>
          <Ionicons name="trending-up-outline" size={28} color="#ff9f43" />
          <Text style={styles.statLabel}>Mejora</Text>
          <Text style={styles.statValueOrange}>+15%</Text>
        </View>
      </View>

      {/* Tendencia fake */}
      <View style={styles.trendBox}>
        <Text style={styles.trendTitle}>Tendencia</Text>
        <View style={styles.fakeChart} />
        <Text style={styles.trendLabels}>Semana 1   Semana 2   Semana 3   Semana 4</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable style={styles.btnBlue}>
          <Text style={styles.btnText}>Compartir</Text>
        </Pressable>

        <Pressable
          style={styles.btnOrange}
          onPress={() => router.push("/train")}
        >
          <Text style={styles.btnText}>Nueva sesión</Text>
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
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  levelContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: "#4da6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  percentText: {
    color: "#aaa",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCardBlue: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4da6ff",
  },
  statCardOrange: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff9f43",
  },
  statLabel: {
    color: "#aaa",
    marginTop: 6,
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statValueOrange: {
    color: "#ff9f43",
    fontSize: 18,
    fontWeight: "bold",
  },
  trendBox: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  trendTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 12,
  },
  fakeChart: {
    height: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    marginBottom: 8,
  },
  trendLabels: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnBlue: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4da6ff",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    marginRight: 10,
  },
  btnOrange: {
    flex: 1,
    backgroundColor: "#ff9f43",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    marginLeft: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});

