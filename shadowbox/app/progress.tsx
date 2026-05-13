import React, { useCallback, useState } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { CHALLENGES } from "../utils/challenges";

type UserStats = {
  sessions?: number;
  totalTime?: number;
  level?: number;
  lastWorkoutTitle?: string;
  lastWorkoutMinutes?: number;
  lastWorkoutRounds?: number;
  completedChallenges?: string[];
};

export default function ProgressScreen() {
  const [stats, setStats] = useState<UserStats>({
    sessions: 0,
    totalTime: 0,
    level: 1,
    completedChallenges: [],
  });

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setStats(snap.data() as UserStats);
      }
    } catch (error) {
      console.log("ERROR CARGANDO PROGRESO:", error);
    }
  }

  const sessions = stats.sessions || 0;
  const totalTime = stats.totalTime || 0;
  const level = stats.level || 1;
  const completedChallenges = stats.completedChallenges || [];

  const completed = CHALLENGES.filter((challenge) =>
    completedChallenges.includes(challenge.id)
  );

  const pending = CHALLENGES.filter(
    (challenge) => !completedChallenges.includes(challenge.id)
  );

  const totalChallenges = CHALLENGES.length;
  const challengePercent =
    totalChallenges > 0
      ? Math.round((completed.length / totalChallenges) * 100)
      : 0;

  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  function getChallengeProgress(challenge: any) {
    if (challenge.id.startsWith("sessions")) {
      return Math.min(sessions, challenge.target);
    }

    if (challenge.id.startsWith("time")) {
      return Math.min(totalTime, challenge.target);
    }

    return 0;
  }

  function getChallengeIcon(challengeId: string) {
    if (challengeId.startsWith("sessions")) return "checkmark-done-outline";
    if (challengeId.startsWith("time")) return "time-outline";
    return "trophy-outline";
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

          <Text style={styles.title}>Progreso</Text>

          <View style={{ width: 26 }} />
        </View>

        <View style={styles.levelCard}>
          <View style={styles.circle}>
            <Text style={styles.levelText}>Nivel {level}</Text>
            <Text style={styles.percentText}>{challengePercent}%</Text>
          </View>

          <Text style={styles.levelInfo}>
            {completed.length} de {totalChallenges} retos completados
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${challengePercent}%` }]} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCardBlue}>
            <Ionicons name="checkmark-done-outline" size={28} color="#4DA3FF" />
            <Text style={styles.statValue}>{sessions}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>

          <View style={styles.statCardOrange}>
            <Ionicons name="time-outline" size={28} color="#FF7A00" />
            <Text style={styles.statValue}>
              {hours}h {minutes}m
            </Text>
            <Text style={styles.statLabel}>Tiempo</Text>
          </View>

          <View style={styles.statCardBlue}>
            <Ionicons name="trophy-outline" size={28} color="#4DA3FF" />
            <Text style={styles.statValue}>{completed.length}</Text>
            <Text style={styles.statLabel}>Retos</Text>
          </View>
        </View>

        <View style={styles.lastCard}>
          <View style={styles.lastHeader}>
            <Ionicons name="flame-outline" size={24} color="#FF7A00" />
            <Text style={styles.lastTitle}>Último entrenamiento</Text>
          </View>

          {stats.lastWorkoutTitle ? (
            <>
              <Text style={styles.lastWorkout}>{stats.lastWorkoutTitle}</Text>
              <Text style={styles.lastInfo}>
                {stats.lastWorkoutRounds || 0} rondas · {stats.lastWorkoutMinutes || 0} min
              </Text>
            </>
          ) : (
            <Text style={styles.emptyText}>
              Aún no has completado ningún entrenamiento.
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Retos superados</Text>

        {completed.length === 0 ? (
          <View style={styles.emptyChallengeCard}>
            <Ionicons name="trophy-outline" size={26} color="#FF7A00" />
            <Text style={styles.emptyChallengeText}>
              Aún no has completado ningún reto. Termina entrenamientos para desbloquearlos.
            </Text>
          </View>
        ) : (
          completed.map((challenge) => (
            <View key={challenge.id} style={styles.completedChallengeCard}>
              <View style={styles.challengeIconOrange}>
                <Ionicons name={getChallengeIcon(challenge.id) as any} size={22} color="white" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeText}>{challenge.description}</Text>
              </View>

              <Ionicons name="checkmark-circle" size={24} color="#FF7A00" />
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Retos pendientes</Text>

        {pending.map((challenge) => {
          const current = getChallengeProgress(challenge);
          const percent = Math.round((current / challenge.target) * 100);

          return (
            <View key={challenge.id} style={styles.pendingChallengeCard}>
              <View style={styles.challengeIconBlue}>
                <Ionicons name={getChallengeIcon(challenge.id) as any} size={22} color="white" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeText}>{challenge.description}</Text>

                <View style={styles.smallProgressBar}>
                  <View style={[styles.smallProgressFill, { width: `${percent}%` }]} />
                </View>

                <Text style={styles.challengeProgress}>
                  {current} / {challenge.target}
                </Text>
              </View>
            </View>
          );
        })}

        <Pressable
          style={styles.trainBtn}
          onPress={() => router.push({ pathname: "/(tabs)/train" } as any)}
        >
          <Ionicons name="play" size={20} color="white" />
          <Text style={styles.trainBtnText}>Nueva sesión</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
  container: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "900",
  },
  levelCard: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.45)",
    marginBottom: 22,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: "#4DA3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  levelText: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
  },
  percentText: {
    color: "#FF7A00",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },
  levelInfo: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#FF7A00",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCardBlue: {
    width: "31%",
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(77,163,255,0.45)",
  },
  statCardOrange: {
    width: "31%",
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.45)",
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  statLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12,
    marginTop: 4,
  },
  lastCard: {
    backgroundColor: "rgba(0,0,0,0.68)",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 22,
  },
  lastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lastTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
  lastWorkout: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  lastInfo: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  emptyText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 4,
  },
  emptyChallengeCard: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.25)",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emptyChallengeText: {
    color: "rgba(255,255,255,0.72)",
    flex: 1,
    lineHeight: 20,
  },
  completedChallengeCard: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.45)",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pendingChallengeCard: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(77,163,255,0.35)",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  challengeIconOrange: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
  },
  challengeIconBlue: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2E8BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  challengeText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    lineHeight: 18,
  },
  smallProgressBar: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: 10,
    overflow: "hidden",
  },
  smallProgressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#2E8BFF",
  },
  challengeProgress: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "700",
  },
  trainBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 12,
  },
  trainBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "900",
  },
});