import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PlanScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.sbIcon}>
            <Text style={styles.sbText}>SB</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Plan de Entrenamiento</Text>
            <Text style={styles.headerTitle}>Semanal</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.weekText}>Semana 1 de 4</Text>
        </View>

        {/* Cards */}
        <PlanCard
          title="Shadowboxing"
          duration="10 minutos"
          description="Enfoque en movimiento y técnica sin oponente."
          icon="hand-left"
          color="#FF7A00"
        />

        <PlanCard
          title="Golpes combinados"
          duration="15 minutos"
          description="Practica combinaciones de jab, cross y gancho."
          icon="flash"
          color="#2E8BFF"
        />

        <PlanCard
          title="Descanso"
          duration="5 minutos"
          description="Recuperación activa. Mantente ligero sobre tus pies."
          icon="time"
          color="#2E8BFF"
        />

        <PlanCard
          title="Ejercicio de resistencia"
          duration="15 minutos"
          description="Fortalecimiento del cuerpo completo para resistencia."
          icon="walk"
          color="#FF7A00"
        />

        {/* Footer */}
        <View style={styles.totalRow}>
          <Ionicons name="time-outline" size={20} color="#FF7A00" />
          <Text style={styles.totalText}>Duración total: 45 minutos</Text>
        </View>

        <Pressable style={styles.startBtn}>
          <Text style={styles.startText}>Iniciar entrenamiento</Text>
        </Pressable>

        <Pressable style={styles.downloadBtn}>
          <Text style={styles.downloadText}>Descargar para offline</Text>
        </Pressable>

        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

function PlanCard({
  title,
  duration,
  description,
  icon,
  color,
}: {
  title: string;
  duration: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardIconWrap, { borderColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDuration}>Duración: {duration}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
  container: { padding: 16, paddingBottom: 30 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  sbIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E2A38",
    alignItems: "center",
    justifyContent: "center",
  },
  sbText: { color: "#2E8BFF", fontSize: 20, fontWeight: "900" },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  progressRow: { marginBottom: 16 },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "#2E8BFF",
  },
  weekText: {
    marginTop: 6,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.6)",
    backgroundColor: "rgba(0,0,0,0.45)",
    marginBottom: 12,
    alignItems: "center",
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  cardDuration: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
    fontSize: 13,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
  },
  totalText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },

  startBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#FF7A00",
    shadowOpacity: Platform.OS === "android" ? 0.35 : 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  startText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  downloadBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1E4E8C",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  backLink: { marginTop: 12, alignItems: "center" },
  backText: { color: "rgba(255,255,255,0.55)", fontWeight: "700" },
});
