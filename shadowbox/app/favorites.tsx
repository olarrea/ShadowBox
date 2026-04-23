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
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type FavoriteWorkout = {
  id: string;
  title: string;
  description?: string;
  level: string;
  estimatedMinutes: number;
  rounds?: any[];
};

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const user = auth.currentUser;
      if (!user) {
        setFavorites([]);
        return;
      }

      const favRef = collection(db, "users", user.uid, "favorites");
      const snapshot = await getDocs(favRef);

      const data: FavoriteWorkout[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<FavoriteWorkout, "id">),
      }));

      setFavorites(data);
    } catch (error) {
      console.log("ERROR CARGANDO FAVORITOS:", error);
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

          <Text style={styles.title}>Favoritos</Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={styles.loadingText}>Cargando favoritos...</Text>
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="heart-outline" size={34} color="#FF7A00" />
            <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
            <Text style={styles.emptyText}>
              Añade entrenamientos desde el detalle para verlos aquí.
            </Text>
          </View>
        ) : (
          favorites.map((workout) => (
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
                  · {workout.estimatedMinutes} min ·{" "}
                  {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
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
    borderColor: "rgba(255,122,0,0.35)",
    marginTop: 20,
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
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
    borderColor: "rgba(255,122,0,0.35)",
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