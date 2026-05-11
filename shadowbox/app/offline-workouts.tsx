import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getOfflineWorkouts } from "../database";

type OfflineWorkout = {
  id: string;
  title: string;
  description?: string;
  level?: string;
  estimatedMinutes: number;
  rounds?: any[];
};

function formatLevel(level?: string) {
  if (!level) return "Básico";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export default function OfflineWorkoutsScreen() {
  const [downloads, setDownloads] = useState<OfflineWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadDownloads();
    }, [])
  );

  function loadDownloads() {
    try {
      setLoading(true);
      const data = getOfflineWorkouts();
      setDownloads(data as OfflineWorkout[]);
    } catch (error) {
      console.log("ERROR CARGANDO DESCARGADOS SQLITE:", error);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  }

  function openWorkout(workoutId: string) {
    router.push({
      pathname: "/workout-detail",
      params: { workoutId },
    } as any);
  }

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

          <Text style={styles.title}>Descargados</Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2E8BFF" />
            <Text style={styles.loadingText}>Cargando entrenamientos...</Text>
          </View>
        ) : downloads.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="download-outline" size={34} color="#2E8BFF" />
            <Text style={styles.emptyTitle}>
              Aún no has descargado entrenamientos
            </Text>
            <Text style={styles.emptyText}>
              Descárgalos desde el detalle para entrenar sin conexión.
            </Text>
          </View>
        ) : (
          downloads.map((workout) => (
            <Pressable
              key={workout.id}
              style={styles.card}
              onPress={() => openWorkout(workout.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{workout.title}</Text>
                <Text style={styles.cardInfo}>
                  {(workout.rounds?.length || 0) > 0
                    ? `${workout.rounds?.length} rondas`
                    : "Rondas por definir"}{" "}
                  · {workout.estimatedMinutes} min · {formatLevel(workout.level)}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#2E8BFF" />
            </Pressable>
          ))
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
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
    color: "white",
    fontSize: 24,
    fontWeight: "800",
  },
  loadingWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(46,139,255,0.35)",
    marginTop: 20,
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(46,139,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardInfo: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
});