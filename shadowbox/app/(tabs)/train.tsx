import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function TrainHubScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Entrenar</Text>
          <Ionicons name="barbell-outline" size={26} color="#FF7A00" />
        </View>

        <Pressable
          style={styles.mainCard}
          onPress={() => router.push({ pathname: "/training-session" } as any)}
        >
          <View>
            <Text style={styles.mainCardSmall}>Plan actual</Text>
            <Text style={styles.mainCardTitle}>Plan semanal de boxeo</Text>
            <Text style={styles.mainCardInfo}>5 rondas · 45 min · Nivel 1</Text>
          </View>

          <View style={styles.playCircle}>
            <Ionicons name="play" size={28} color="#fff" />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Accesos rápidos</Text>

        <View style={styles.grid}>
          <Pressable style={[styles.card, styles.blueCard]}>
            <Ionicons name="download-outline" size={28} color="#2E8BFF" />
            <Text style={styles.cardTitle}>Descargados</Text>
            <Text style={styles.cardText}>Entrena sin conexión</Text>
          </Pressable>

          <Pressable style={[styles.card, styles.orangeCard]}>
            <Ionicons name="heart-outline" size={28} color="#FF7A00" />
            <Text style={styles.cardTitle}>Favoritos</Text>
            <Text style={styles.cardText}>Tus rutinas guardadas</Text>
          </Pressable>

          <Pressable style={[styles.card, styles.blueCard]}>
            <Ionicons name="create-outline" size={28} color="#2E8BFF" />
            <Text style={styles.cardTitle}>Mis entrenos</Text>
            <Text style={styles.cardText}>Rutinas creadas por ti</Text>
          </Pressable>

          <Pressable style={[styles.card, styles.orangeCard]}>
            <Ionicons name="add-circle-outline" size={28} color="#FF7A00" />
            <Text style={styles.cardTitle}>Crear rutina</Text>
            <Text style={styles.cardText}>Diseña un entrenamiento</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Última sesión</Text>

        <View style={styles.lastSessionCard}>
          <View>
            <Text style={styles.lastSessionTitle}>Shadowboxing básico</Text>
            <Text style={styles.lastSessionInfo}>
              Última vez: hoy · 5 rondas · 25 min
            </Text>
          </View>

          <Pressable
            style={styles.repeatBtn}
            onPress={() => router.push({ pathname: "/training-session" } as any)}
          >
            <Text style={styles.repeatBtnText}>Repetir</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#070A0F",
  },

  container: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 30,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },

  mainCard: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.55)",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  mainCardSmall: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 4,
  },

  mainCardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  mainCardInfo: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
  },

  playCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 4,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  card: {
    width: "48%",
    minHeight: 140,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
    marginBottom: 14,
    justifyContent: "space-between",
  },

  blueCard: {
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.55)",
  },

  orangeCard: {
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.55)",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },

  cardText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    marginTop: 6,
  },

  lastSessionCard: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
  },

  lastSessionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
  },

  lastSessionInfo: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
  },

  repeatBtn: {
    backgroundColor: "#2E8BFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  repeatBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
});