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
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Workout = {
  id: string;
  title: string;
  level: string;
  estimatedMinutes: number;
  createdBy?: string;
  createdByName?: string;
  rounds?: any[];
  averageRating?: number;
};

export default function CommunityScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityWorkouts();
  }, []);

  async function loadCommunityWorkouts() {
    try {
      const user = auth.currentUser;

      const snap = await getDocs(collection(db, "workouts"));

      const data = snap.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Workout, "id">),
        }))
        .filter((workout) => {
          // excluir entrenos del sistema
          if (workout.createdBy === "system") return false;

          // excluir entrenos propios
          if (workout.createdBy === user?.uid) return false;

          return true;
        });

      setWorkouts(data);
    } catch (error) {
      console.log("ERROR CARGANDO COMMUNITY:", error);
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
      source={require("../../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Comunidad</Text>

          <View style={styles.headerIcon}>
            <Ionicons name="people" size={18} color="#FF7A00" />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={styles.loadingText}>
              Cargando entrenamientos...
            </Text>
          </View>
        ) : workouts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="people-outline" size={34} color="#2E8BFF" />

            <Text style={styles.emptyTitle}>
              Aún no hay entrenamientos compartidos
            </Text>

            <Text style={styles.emptyText}>
              Cuando otros usuarios creen entrenamientos aparecerán aquí.
            </Text>
          </View>
        ) : (
          workouts.map((workout) => (
            <View key={workout.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.avatarWrap}>
                  <View style={styles.avatarRing}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {(workout.createdByName || "U")
                          .slice(0, 1)
                          .toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {workout.title}
                  </Text>

                  <Text style={styles.authorText}>
                    por {workout.createdByName || "Usuario"}
                  </Text>

                  <View style={styles.badgeRow}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>
                        {workout.level}
                      </Text>
                    </View>

                    <View style={styles.infoBadge}>
                      <Text style={styles.infoBadgeText}>
                        {workout.estimatedMinutes} min
                      </Text>
                    </View>

                    <View style={styles.infoBadge}>
                      <Text style={styles.infoBadgeText}>
                        {workout.rounds?.length || 0} rondas
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="star"
                      size={16}
                      color="#FF7A00"
                    />

                    <Text style={styles.ratingText}>
                      {workout.averageRating || 0}/5
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={styles.btn}
                onPress={() => openWorkout(workout.id)}
              >
                <Text style={styles.btnText}>
                  VER ENTRENAMIENTO
                </Text>
              </Pressable>
            </View>
          ))
        )}
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
    padding: 16,
    paddingBottom: 28,
    paddingTop: 54,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.65)",
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.50)",
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.45)",
    padding: 16,
    marginBottom: 16,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarWrap: {
    width: 58,
    alignItems: "center",
  },

  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 18,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  authorText: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },

  badgeRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  levelBadge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(46,139,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  levelBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

  infoBadge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  infoBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },

  ratingText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  btn: {
    marginTop: 16,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#1E4E8C",
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#FF7A00",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 15,
  },
});