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
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

type Workout = {
  id: string;
  title: string;
  description?: string;
  level: string;
  estimatedMinutes: number;
  createdBy?: string;
  rounds?: any[];
};

export default function TrainHubScreen() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkout();
  }, []);

  async function loadWorkout() {
    try {
      const querySnapshot = await getDocs(collection(db, "workouts"));

      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        setWorkout({
          id: firstDoc.id,
          ...(firstDoc.data() as Omit<Workout, "id">),
        });
      }
    } catch (error) {
      console.log("ERROR CARGANDO WORKOUTS:", error);
    } finally {
      setLoading(false);
    }
  }

  function goToWorkoutDetail() {
    if (!workout) return;
    router.push({
      pathname: "/workout-detail",
      params: { workoutId: workout.id },
    } as any);
  }

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
          <Ionicons name="barbell-outline" size={28} color="#FF7A00" />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={styles.loadingText}>Cargando entrenamiento...</Text>
          </View>
        ) : workout ? (
          <Pressable style={styles.mainCard} onPress={goToWorkoutDetail}>
            <View style={styles.mainCardTextWrap}>
              <Text style={styles.mainCardSmall}>Plan actual</Text>
              <Text style={styles.mainCardTitle}>{workout.title}</Text>
              <Text style={styles.mainCardInfo}>
                {(workout.rounds?.length || 0) > 0
                  ? `${workout.rounds?.length} rondas`
                  : "Rondas por definir"}{" "}
                · {workout.estimatedMinutes} min ·{" "}
                {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
              </Text>
            </View>

            <View style={styles.playCircle}>
              <Ionicons name="play" size={28} color="#fff" />
            </View>
          </Pressable>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No hay entrenamientos cargados</Text>
            <Text style={styles.emptyText}>
              Crea o añade un entrenamiento en Firebase para empezar.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Accesos rápidos</Text>

        <View style={styles.grid}>
          <Pressable style={[styles.card, styles.blueCard]}>
            <Ionicons name="download-outline" size={30} color="#2E8BFF" />
            <Text style={styles.cardTitle}>Descargados</Text>
            <Text style={styles.cardText}>Entrena sin conexión</Text>
          </Pressable>

          <Pressable style={[styles.card, styles.orangeCard]}>
            <Ionicons name="heart-outline" size={30} color="#FF7A00" />
            <Text style={styles.cardTitle}>Favoritos</Text>
            <Text style={styles.cardText}>Tus rutinas guardadas</Text>
          </Pressable>

          <Pressable style={[styles.card, styles.blueCard]}>
            <Ionicons name="create-outline" size={30} color="#2E8BFF" />
            <Text style={styles.cardTitle}>Mis entrenos</Text>
            <Text style={styles.cardText}>Rutinas creadas por ti</Text>
          </Pressable>

          <Pressable style={[styles.card, styles.orangeCard]}>
            <Ionicons name="add-circle-outline" size={30} color="#FF7A00" />
            <Text style={styles.cardTitle}>Crear rutina</Text>
            <Text style={styles.cardText}>Diseña un entrenamiento</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Última sesión</Text>

        <View style={styles.lastSessionCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.lastSessionTitle}>
              {workout?.title || "Shadowboxing básico"}
            </Text>
            <Text style={styles.lastSessionInfo}>
              Última vez: hoy · {workout?.estimatedMinutes || 20} min
            </Text>
          </View>

          <Pressable style={styles.repeatBtn} onPress={goToWorkoutDetail}>
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

  loadingWrap: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  loadingText: {
    color: "white",
    marginTop: 12,
    fontWeight: "700",
  },

  mainCard: {
    backgroundColor: "rgba(0,0,0,0.72)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.55)",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#FF7A00",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },

  mainCardTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  mainCardSmall: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    marginBottom: 6,
  },

  mainCardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },

  mainCardInfo: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 20,
  },

  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    minHeight: 150,
    borderRadius: 20,
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
    lineHeight: 18,
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
    marginLeft: 12,
  },

  repeatBtnText: {
    color: "#fff",
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
  },

  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: 20,
  },
});