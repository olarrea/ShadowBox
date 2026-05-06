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

  useFocusEffect(
    useCallback(() => {
      loadPlan();
    }, [])
  );

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
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>

          <Text style={styles.title}>Plan generado</Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={styles.loadingText}>Cargando plan...</Text>
          </View>
        ) : !plan ? (
          <View style={styles.emptyCard}>
            <Ionicons name="navigate-outline" size={34} color="#FF7A00" />
            <Text style={styles.emptyTitle}>No hay plan generado</Text>
            <Text style={styles.emptyText}>
              Genera un plan desde la pantalla anterior para verlo aquí.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroSmall}>Objetivo</Text>
              <Text style={styles.heroTitle}>{plan.goal}</Text>
              <Text style={styles.heroText}>
                {plan.days} días por semana · {plan.duration} min máximo · Nivel {plan.level}
              </Text>
            </View>

            {plan.workouts.map((workout) => (
              <Pressable
                key={`${workout.day}-${workout.workoutId}`}
                style={styles.card}
                onPress={() => openWorkout(workout.workoutId)}
              >
                <View style={styles.dayCircle}>
                  <Text style={styles.dayText}>{workout.day}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Día {workout.day}</Text>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.cardInfo}>
                    {workout.roundsCount} rondas · {workout.estimatedMinutes} min · {workout.level}
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
    fontWeight: "900",
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
    borderColor: "rgba(255,122,0,0.35)",
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    lineHeight: 20,
  },
  heroCard: {
    backgroundColor: "rgba(0,0,0,0.72)",
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.45)",
    marginBottom: 22,
  },
  heroSmall: {
    color: "rgba(255,255,255,0.65)",
    marginBottom: 6,
  },
  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.35)",
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
    color: "white",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },
  cardInfo: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
});