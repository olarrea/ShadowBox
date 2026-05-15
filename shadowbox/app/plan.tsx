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
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

type PlanWorkout = {
  day: number;
  workoutId: string;
  title: string;
  description?: string;
  level: string;
  estimatedMinutes: number;
  roundsCount: number;
};

type GeneratedPlan = {
  goal: string;
  level: string;
  days: number;
  duration: number;
  workouts: PlanWorkout[];
};

export default function PlanScreen() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.92)",
    hero: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.94)",
    orangeBorder: isDark
      ? "rgba(255,122,0,0.45)"
      : "rgba(255,122,0,0.35)",
  };

  useFocusEffect(
    useCallback(() => {
      loadPlan();
    }, [])
  );

  function formatLevel(level: string) {
    if (level === "basico") return t("basic");
    if (level === "intermedio") return t("intermediate");
    if (level === "experto") return t("expert");
    return level;
  }

  function formatGoal(goal: string) {
    if (goal === "Resistencia") return t("endurance");
    if (goal === "Técnica") return t("technique");
    if (goal === "Fuerza") return t("strength");
    return goal;
  }

  async function loadPlan() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "plans", "generated");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPlan(snap.data() as GeneratedPlan);
      }
    } catch (error) {
      console.log("ERROR CARGANDO PLAN:", error);
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
            {t("generatedPlan")}
          </Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />

            <Text style={[styles.loadingText, { color: colors.text }]}>
              {t("loadingPlan")}
            </Text>
          </View>
        ) : !plan ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
          >
            <Ionicons name="navigate-outline" size={34} color="#FF7A00" />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t("noGeneratedPlan")}
            </Text>

            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {t("generatePlanHint")}
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: colors.hero,
                  borderColor: colors.orangeBorder,
                },
              ]}
            >
              <Text style={[styles.heroSmall, { color: colors.muted }]}>
                {t("goal")}
              </Text>

              <Text style={[styles.heroTitle, { color: colors.text }]}>
                {formatGoal(plan.goal)}
              </Text>

              <Text style={[styles.heroText, { color: colors.muted }]}>
                {plan.days} {t("daysPerWeek").toLowerCase()} · {plan.duration}{" "}
                min {t("maximum").toLowerCase()} · {t("level")}{" "}
                {formatLevel(plan.level)}
              </Text>
            </View>

            {plan.workouts.map((workout) => (
              <Pressable
                key={`${workout.day}-${workout.workoutId}`}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.orangeBorder,
                  },
                ]}
                onPress={() => openWorkout(workout.workoutId)}
              >
                <View style={styles.dayCircle}>
                  <Text style={styles.dayText}>{workout.day}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {t("day")} {workout.day}
                  </Text>

                  <Text style={[styles.workoutTitle, { color: colors.text }]}>
                    {workout.title}
                  </Text>

                  <Text style={[styles.cardInfo, { color: colors.muted }]}>
                    {workout.roundsCount} {t("rounds")} ·{" "}
                    {workout.estimatedMinutes} min · {formatLevel(workout.level)}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#FF7A00" />
              </Pressable>
            ))}
          </>
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
    fontWeight: "900",
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
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },

  heroCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    marginBottom: 22,
  },

  heroSmall: {
    marginBottom: 6,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },

  heroText: {
    lineHeight: 20,
  },

  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },

  dayCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  dayText: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },

  cardTitle: {
    color: "#2E8BFF",
    fontWeight: "900",
    marginBottom: 4,
  },

  workoutTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },

  cardInfo: {
    fontSize: 13,
  },
});