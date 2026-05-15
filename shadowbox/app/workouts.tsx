import React, { useEffect, useState } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { router } from "expo-router";
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

type Workout = {
  id: string;
  title: string;
  level: string;
  estimatedMinutes: number;
  rounds?: any[];
  createdBy?: string;
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.92)",
    border: isDark ? "rgba(255,122,0,0.4)" : "rgba(255,122,0,0.35)",
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  function formatLevel(level: string) {
    if (level === "basico") return t("basic");
    if (level === "intermedio") return t("intermediate");
    if (level === "experto") return t("expert");
    return level;
  }

  async function loadWorkouts() {
    try {
      const snap = await getDocs(collection(db, "workouts"));

      const data = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Workout, "id">),
        }))
        .filter((workout) => workout.createdBy === "system");

      setWorkouts(data);
    } catch (e) {
      console.log("ERROR CARGANDO WORKOUTS:", e);
    } finally {
      setLoading(false);
    }
  }

  function openWorkout(id: string) {
    router.push({
      pathname: "/workout-detail",
      params: { workoutId: id },
    } as any);
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.38 : 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t("workouts")}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF7A00" />
        ) : workouts.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="albums-outline" size={34} color="#FF7A00" />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t("noAppWorkouts")}
            </Text>

            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {t("noAppWorkoutsHint")}
            </Text>
          </View>
        ) : (
          workouts.map((w) => (
            <Pressable
              key={w.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => openWorkout(w.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {w.title}
                </Text>

                <Text style={[styles.cardInfo, { color: colors.muted }]}>
                  {w.rounds?.length || 0} {t("rounds")} ·{" "}
                  {w.estimatedMinutes} min · {formatLevel(w.level)}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#FF7A00" />
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
    paddingTop: 60,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
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
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  cardInfo: {
    marginTop: 6,
  },
});