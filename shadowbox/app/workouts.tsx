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

type Workout = {
  id: string;
  title: string;
  level: string;
  estimatedMinutes: number;
  rounds?: any[];
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      const snap = await getDocs(collection(db, "workouts"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
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
      style={styles.bg}
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Entrenamientos</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF7A00" />
        ) : (
          workouts.map((w) => (
            <Pressable
              key={w.id}
              style={styles.card}
              onPress={() => openWorkout(w.id)}
            >
              <View>
                <Text style={styles.cardTitle}>{w.title}</Text>
                <Text style={styles.cardInfo}>
                  {w.rounds?.length || 0} rondas · {w.estimatedMinutes} min ·{" "}
                  {w.level}
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
  bg: { flex: 1 },
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.4)",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  cardInfo: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
  },
});