import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";

type WorkoutRound = {
  title: string;
  description: string;
  duration: number;
  image?: string;
};

type Workout = {
  title: string;
  description: string;
  level: string;
  estimatedMinutes: number;
  createdBy?: string;
  rounds?: WorkoutRound[];
};

const DEFAULT_ROUNDS: WorkoutRound[] = [
  {
    title: "Calentamiento",
    description: "Movilidad articular y activación general antes de empezar.",
    duration: 300,
    image: "warmup",
  },
  {
    title: "Shadowboxing",
    description: "Practica desplazamientos, guardia y combinaciones simples.",
    duration: 180,
    image: "shadowboxing",
  },
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export default function TrainScreen() {
  const { workoutId } = useLocalSearchParams();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [rounds, setRounds] = useState<WorkoutRound[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSecondsUsed, setTotalSecondsUsed] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workoutId) {
      loadWorkout();
    } else {
      setWorkout({
        title: "Entrenamiento",
        description: "Entrenamiento por defecto",
        level: "basico",
        estimatedMinutes: 8,
        rounds: DEFAULT_ROUNDS,
      });
      setRounds(DEFAULT_ROUNDS);
      setSecondsLeft(DEFAULT_ROUNDS[0].duration);
      setLoading(false);
    }
  }, [workoutId]);

  async function loadWorkout() {
    try {
      const ref = doc(db, "workouts", String(workoutId));
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Workout;
        const loadedRounds =
          data.rounds && data.rounds.length > 0 ? data.rounds : DEFAULT_ROUNDS;

        setWorkout(data);
        setRounds(loadedRounds);
        setSecondsLeft(loadedRounds[0].duration);
      } else {
        setWorkout({
          title: "Entrenamiento",
          description: "Entrenamiento por defecto",
          level: "basico",
          estimatedMinutes: 8,
          rounds: DEFAULT_ROUNDS,
        });
        setRounds(DEFAULT_ROUNDS);
        setSecondsLeft(DEFAULT_ROUNDS[0].duration);
      }
    } catch (error) {
      console.log("ERROR CARGANDO TRAINING SESSION:", error);
      setWorkout({
        title: "Entrenamiento",
        description: "Entrenamiento por defecto",
        level: "basico",
        estimatedMinutes: 8,
        rounds: DEFAULT_ROUNDS,
      });
      setRounds(DEFAULT_ROUNDS);
      setSecondsLeft(DEFAULT_ROUNDS[0].duration);
    } finally {
      setLoading(false);
    }
  }

  const currentRound = rounds[currentRoundIndex];

  useEffect(() => {
    if (loading || !isRunning || !currentRound) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });

      setTotalSecondsUsed((t) => t + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [loading, isRunning, currentRoundIndex, currentRound]);

  useEffect(() => {
    if (!loading && secondsLeft === 0) {
      setIsRunning(false);
      Alert.alert(
        "Ronda terminada",
        currentRoundIndex < rounds.length - 1
          ? "Pulsa 'Cambiar ronda' para continuar."
          : "Has terminado la última ronda. Pulsa 'Finalizar'."
      );
    }
  }, [secondsLeft, loading]);

  const mmss = useMemo(() => formatMMSS(secondsLeft), [secondsLeft]);
  const [mm, ss] = useMemo(() => mmss.split(":"), [mmss]);

  const progress = useMemo(() => {
    if (!currentRound?.duration) return 0;
    return secondsLeft / currentRound.duration;
  }, [secondsLeft, currentRound]);

  function togglePause() {
    setIsRunning((v) => !v);
  }

  function nextRound() {
    if (!rounds.length) return;

    if (currentRoundIndex >= rounds.length - 1) {
      Alert.alert("Última ronda", "Ya estás en la última ronda del entrenamiento.");
      return;
    }

    const nextIndex = currentRoundIndex + 1;
    setCurrentRoundIndex(nextIndex);
    setSecondsLeft(rounds[nextIndex].duration);
    setIsRunning(true);
  }

  async function finish() {
    try {
      setSaving(true);
      setIsRunning(false);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No hay usuario autenticado.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Error", "No se encontraron los datos del usuario.");
        return;
      }

      const currentData = userSnap.data();
      const currentSessions = currentData.sessions ?? 0;
      const currentTotalTime = currentData.totalTime ?? 0;

      const sessionMinutes = Math.max(1, Math.ceil(totalSecondsUsed / 60));
      const newSessions = currentSessions + 1;
      const newTotalTime = currentTotalTime + sessionMinutes;
      const newLevel = Math.floor(newSessions / 5) + 1;

      await updateDoc(userRef, {
        sessions: newSessions,
        totalTime: newTotalTime,
        level: newLevel,

        // último entrenamiento realizado
        lastWorkoutId: String(workoutId || ""),
        lastWorkoutTitle: workout?.title || "Entrenamiento",
        lastWorkoutMinutes: workout?.estimatedMinutes || sessionMinutes,
        lastWorkoutLevel: workout?.level || "basico",
        lastWorkoutRounds: rounds.length,
        lastCompletedAt: new Date().toISOString(),
      });

      Alert.alert(
        "Entrenamiento guardado",
        `Has completado 1 sesión y sumado ${sessionMinutes} min.`,
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (err) {
      console.log("ERROR GUARDANDO ENTRENAMIENTO:", err);
      Alert.alert("Error", "No se pudo guardar el progreso del entrenamiento.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !currentRound) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Cargando entrenamiento...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
          </Pressable>

          <View style={styles.brandRow}>
            <Ionicons name="hand-left" size={22} color="#FF7A00" />
            <Text style={styles.brand}>
              <Text style={{ color: "#2E8BFF", fontWeight: "900" }}>Shado</Text>
              <Text style={{ color: "#FF7A00", fontWeight: "900" }}>wBox</Text>
            </Text>
          </View>

          <View style={{ width: 22 }} />
        </View>

        <View style={styles.centerWrap}>
          <ProgressRing progress={progress} />

          <View style={styles.timeOverlay}>
            <Text style={styles.timeText}>
              <Text style={styles.timeWhite}>{mm}</Text>
              <Text style={styles.timeColon}>:</Text>
              <Text style={styles.timeBlue}>{ss}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.infoWrap}>
          <Text style={styles.roundText}>
            Ronda {currentRoundIndex + 1} de {rounds.length}
          </Text>

          <View style={styles.restRow}>
            <Ionicons
              name="fitness-outline"
              size={18}
              color="rgba(255,255,255,0.85)"
            />
            <Text style={styles.restText}>Trabajo</Text>
          </View>
        </View>

        <Text style={styles.bigTitle}>
          <Text style={{ color: "#FFFFFF" }}>{currentRound.title}</Text>
        </Text>

        <Text style={styles.roundDescription}>{currentRound.description}</Text>

        <View style={styles.imageTag}>
          <Ionicons name="image-outline" size={18} color="#FF7A00" />
          <Text style={styles.imageTagText}>
            Referencia visual: {currentRound.image || "sin imagen"}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.bigBtn, styles.blueBtn]}
            onPress={togglePause}
            disabled={saving}
          >
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.blueBtnText}>
              {isRunning ? "Pausar" : "Continuar"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.midBtn, saving && styles.disabledBtn]}
            onPress={finish}
            disabled={saving}
          >
            <View style={styles.stopSquare} />
            <Text style={styles.orangeBtnText}>
              {saving ? "Guardando..." : "Finalizar"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.bigBtn, styles.whiteBtn]}
            onPress={nextRound}
            disabled={saving}
          >
            <Ionicons name="repeat" size={22} color="#2E8BFF" />
            <Text style={styles.whiteBtnText}>Cambiar{"\n"}ronda</Text>
          </Pressable>
        </View>

        <View style={styles.fakeBottomRow}>
          <Ionicons
            name="time-outline"
            size={22}
            color="#FFFFFF"
            style={{ opacity: 0.95 }}
          />
          <Ionicons
            name="layers-outline"
            size={22}
            color="#FFFFFF"
            style={{ opacity: 0.6 }}
          />
          <Ionicons
            name="fitness-outline"
            size={22}
            color="#FFFFFF"
            style={{ opacity: 0.6 }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const orangeOpacity = Math.max(0.25, 1 - progress);

  return (
    <View style={styles.ringWrap}>
      <View style={styles.ringBlue} />
      <View style={[styles.ringOrange, { opacity: orangeOpacity }]} />
      <View style={styles.ringCenter} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#070A0F",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "white",
    marginTop: 12,
    fontWeight: "700",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 22,
    letterSpacing: 0.5,
  },

  centerWrap: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  timeOverlay: {
    position: "absolute",
    top: 78,
    alignItems: "center",
    justifyContent: "center",
  },

  timeText: {
    fontSize: 54,
    fontWeight: "900",
  },

  timeWhite: { color: "#FFFFFF" },
  timeBlue: { color: "#2E8BFF" },
  timeColon: { color: "rgba(255,255,255,0.85)" },

  ringWrap: {
    width: 210,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
  },

  ringBlue: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 10,
    borderColor: "#2E8BFF",
    shadowColor: "#2E8BFF",
    shadowOpacity: Platform.OS === "android" ? 0.25 : 0.35,
    shadowRadius: 18,
    elevation: 8,
  },

  ringOrange: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 10,
    borderColor: "#FF7A00",
  },

  ringCenter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  infoWrap: {
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  roundText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 18,
    fontWeight: "700",
  },

  restRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  restText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 18,
    fontWeight: "700",
  },

  bigTitle: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 10,
    color: "#FFFFFF",
    paddingHorizontal: 12,
  },

  roundDescription: {
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 14,
    paddingHorizontal: 12,
  },

  imageTag: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },

  imageTagText: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "600",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },

  bigBtn: {
    width: 118,
    height: 106,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  blueBtn: {
    backgroundColor: "#2E8BFF",
  },

  blueBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 20,
  },

  midBtn: {
    width: 118,
    height: 106,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.35)",
    backgroundColor: "rgba(255,122,0,0.20)",
  },

  disabledBtn: {
    opacity: 0.7,
  },

  stopSquare: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#FF7A00",
  },

  orangeBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  whiteBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.5)",
  },

  whiteBtnText: {
    color: "#2E8BFF",
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 18,
  },

  fakeBottomRow: {
    marginTop: "auto",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    paddingBottom: 10,
  },
});