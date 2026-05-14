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
import { useTheme } from "../themeContext";

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

  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.92)",
    blueBorder: isDark ? "rgba(46,139,255,0.35)" : "rgba(46,139,255,0.35)",
  };

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
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.65 : 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={26}
              color={isDark ? "white" : "#07111F"}
            />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            Descargados
          </Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2E8BFF" />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Cargando entrenamientos...
            </Text>
          </View>
        ) : downloads.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.blueBorder,
              },
            ]}
          >
            <Ionicons name="download-outline" size={34} color="#2E8BFF" />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Aún no has descargado entrenamientos
            </Text>

            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Descárgalos desde el detalle para entrenar sin conexión.
            </Text>
          </View>
        ) : (
          downloads.map((workout) => (
            <Pressable
              key={workout.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.blueBorder,
                },
              ]}
              onPress={() => openWorkout(workout.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {workout.title}
                </Text>

                <Text style={[styles.cardInfo, { color: colors.muted }]}>
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
  bg: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: "800",
  },

  loadingWrap: {
    marginTop: 40,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontWeight: "700",
  },

  emptyCard: {
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    marginTop: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardInfo: {
    fontSize: 14,
    lineHeight: 20,
  },
});