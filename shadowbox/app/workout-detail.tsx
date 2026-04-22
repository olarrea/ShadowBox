import React, { useState } from "react";
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

export default function WorkoutDetailScreen() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>

          <Text style={styles.title}>Detalle</Text>

          <Pressable onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF7A00" : "white"}
            />
          </Pressable>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.mainTitle}>Plan semanal de boxeo</Text>
          <Text style={styles.mainSubtitle}>
            Técnica, resistencia y ritmo de combate
          </Text>

          <View style={styles.badgesRow}>
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeText}>Nivel 1</Text>
            </View>
            <View style={styles.badgeOrange}>
              <Text style={styles.badgeText}>45 min</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Resumen</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Ionicons name="repeat-outline" size={22} color="#2E8BFF" />
            <Text style={styles.summaryNumber}>5</Text>
            <Text style={styles.summaryLabel}>Rondas</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={22} color="#FF7A00" />
            <Text style={styles.summaryNumber}>60s</Text>
            <Text style={styles.summaryLabel}>Descanso</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="flash-outline" size={22} color="#2E8BFF" />
            <Text style={styles.summaryNumber}>Media</Text>
            <Text style={styles.summaryLabel}>Intensidad</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Bloques del entrenamiento</Text>

        <View style={styles.blockCard}>
          <Ionicons name="body-outline" size={20} color="#2E8BFF" />
          <View style={styles.blockTextWrap}>
            <Text style={styles.blockTitle}>Calentamiento</Text>
            <Text style={styles.blockText}>5 min · movilidad y activación</Text>
          </View>
        </View>

        <View style={styles.blockCard}>
          <Ionicons name="hand-left-outline" size={20} color="#FF7A00" />
          <View style={styles.blockTextWrap}>
            <Text style={styles.blockTitle}>Shadowboxing</Text>
            <Text style={styles.blockText}>3 rondas · técnica y desplazamientos</Text>
          </View>
        </View>

        <View style={styles.blockCard}>
          <Ionicons name="flash-outline" size={20} color="#2E8BFF" />
          <View style={styles.blockTextWrap}>
            <Text style={styles.blockTitle}>Combinaciones</Text>
            <Text style={styles.blockText}>2 rondas · jab, cross, hook</Text>
          </View>
        </View>

        <View style={styles.blockCard}>
          <Ionicons name="walk-outline" size={20} color="#FF7A00" />
          <View style={styles.blockTextWrap}>
            <Text style={styles.blockTitle}>Vuelta a la calma</Text>
            <Text style={styles.blockText}>5 min · respiración y recuperación</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.startBtn}
            onPress={() => router.push({ pathname: "/training-session" } as any)}
          >
            <Ionicons name="play" size={18} color="white" />
            <Text style={styles.startBtnText}>Iniciar entrenamiento</Text>
          </Pressable>

          <Pressable
            style={styles.downloadBtn}
            onPress={() => setIsDownloaded(!isDownloaded)}
          >
            <Ionicons
              name={isDownloaded ? "checkmark-circle" : "download-outline"}
              size={18}
              color="white"
            />
            <Text style={styles.downloadBtnText}>
              {isDownloaded ? "Descargado" : "Descargar offline"}
            </Text>
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
    paddingTop: 54,
    paddingBottom: 30,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  mainCard: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.45)",
    padding: 20,
    marginBottom: 22,
  },

  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },

  mainSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    marginBottom: 14,
  },

  badgesRow: {
    flexDirection: "row",
    gap: 10,
  },

  badgeBlue: {
    backgroundColor: "rgba(46,139,255,0.25)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  badgeOrange: {
    backgroundColor: "rgba(255,122,0,0.25)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 2,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  summaryCard: {
    width: "31%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  summaryNumber: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    marginTop: 6,
  },

  summaryLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  blockCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },

  blockTextWrap: {
    marginLeft: 12,
    flex: 1,
  },

  blockTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 4,
  },

  blockText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  actions: {
    marginTop: 18,
    gap: 12,
  },

  startBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  startBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  downloadBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#2E8BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  downloadBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});