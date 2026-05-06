import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
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

function formatSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
}

function formatLevel(level: string) {
  if (!level) return "Básico";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export default function WorkoutDetailScreen() {
  const { workoutId } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (workoutId) {
      loadWorkout();
      checkFavorite();
      checkDownloaded();
      loadRatings();
    }
  }, [workoutId]);

  async function loadWorkout() {
    try {
      const ref = doc(db, "workouts", String(workoutId));
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setWorkout(snap.data() as Workout);
      }
    } catch (error) {
      console.log("ERROR CARGANDO WORKOUT DETAIL:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadRatings() {
    try {
      if (!workoutId) return;

      const ratingsRef = collection(
        db,
        "workouts",
        String(workoutId),
        "ratings"
      );

      const snap = await getDocs(ratingsRef);

      if (snap.empty) {
        setAverageRating(0);
        setUserRating(0);
        return;
      }

      let total = 0;

      snap.docs.forEach((ratingDoc) => {
        total += ratingDoc.data().value || 0;
      });

      const average = total / snap.docs.length;
      setAverageRating(Number(average.toFixed(1)));

      const user = auth.currentUser;

      if (user) {
        const userRatingRef = doc(
          db,
          "workouts",
          String(workoutId),
          "ratings",
          user.uid
        );

        const userRatingSnap = await getDoc(userRatingRef);

        if (userRatingSnap.exists()) {
          setUserRating(userRatingSnap.data().value || 0);
        }
      }
    } catch (error) {
      console.log("ERROR CARGANDO VALORACIONES:", error);
    }
  }

  async function rateWorkout(value: number) {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión para valorar.");
        return;
      }

      if (!workoutId) return;

      const ratingRef = doc(
        db,
        "workouts",
        String(workoutId),
        "ratings",
        user.uid
      );

      await setDoc(ratingRef, {
        value,
        ratedAt: new Date().toISOString(),
      });

      setUserRating(value);
      await loadRatings();
    } catch (error) {
      console.log("ERROR VALORANDO ENTRENAMIENTO:", error);
      Alert.alert("Error", "No se pudo guardar la valoración.");
    }
  }

  async function checkFavorite() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const favRef = doc(db, "users", user.uid, "favorites", String(workoutId));
      const favSnap = await getDoc(favRef);

      setFavorite(favSnap.exists());
    } catch (error) {
      console.log("ERROR REVISANDO FAVORITO:", error);
    }
  }

  async function checkDownloaded() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const downloadRef = doc(
        db,
        "users",
        user.uid,
        "downloads",
        String(workoutId)
      );
      const downloadSnap = await getDoc(downloadRef);

      setDownloaded(downloadSnap.exists());
    } catch (error) {
      console.log("ERROR REVISANDO DESCARGA:", error);
    }
  }

  async function toggleFavorite() {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión.");
        return;
      }

      if (!workout) return;

      setFavoriteLoading(true);

      const favRef = doc(db, "users", user.uid, "favorites", String(workoutId));

      if (favorite) {
        await deleteDoc(favRef);
        setFavorite(false);
      } else {
        await setDoc(favRef, {
          title: workout.title,
          description: workout.description,
          level: workout.level,
          estimatedMinutes: workout.estimatedMinutes,
          createdBy: workout.createdBy || "system",
          rounds: workout.rounds || [],
          addedAt: new Date().toISOString(),
        });
        setFavorite(true);
      }
    } catch (error) {
      console.log("ERROR TOGGLE FAVORITE:", error);
      Alert.alert("Error", "No se pudo actualizar favoritos.");
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function toggleDownload() {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión.");
        return;
      }

      if (!workout) return;

      setDownloadLoading(true);

      const downloadRef = doc(
        db,
        "users",
        user.uid,
        "downloads",
        String(workoutId)
      );

      if (downloaded) {
        await deleteDoc(downloadRef);
        setDownloaded(false);
      } else {
        await setDoc(downloadRef, {
          title: workout.title,
          description: workout.description,
          level: workout.level,
          estimatedMinutes: workout.estimatedMinutes,
          createdBy: workout.createdBy || "system",
          rounds: workout.rounds || [],
          downloadedAt: new Date().toISOString(),
        });
        setDownloaded(true);
      }
    } catch (error) {
      console.log("ERROR TOGGLE DOWNLOAD:", error);
      Alert.alert("Error", "No se pudo actualizar la descarga.");
    } finally {
      setDownloadLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>No se encontró el entrenamiento</Text>
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>

          <Text style={styles.topTitle}>Entrenamiento</Text>

          <Pressable onPress={toggleFavorite} disabled={favoriteLoading}>
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={24}
              color="#FF7A00"
            />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroSmall}>Plan actual</Text>
          <Text style={styles.heroTitle}>{workout.title}</Text>
          <Text style={styles.heroDescription}>{workout.description}</Text>

          <View style={styles.ratingMiniRow}>
            <Ionicons name="star" size={18} color="#FF7A00" />
            <Text style={styles.ratingMiniText}>
              {averageRating}/5 valoración media
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Resumen</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={24} color="#2E8BFF" />
            <Text style={styles.summaryNumber}>{workout.estimatedMinutes}</Text>
            <Text style={styles.summaryLabel}>Minutos</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="layers-outline" size={24} color="#FF7A00" />
            <Text style={styles.summaryNumber}>{workout.rounds?.length || 0}</Text>
            <Text style={styles.summaryLabel}>Rondas</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="fitness-outline" size={24} color="#2E8BFF" />
            <Text style={styles.summaryNumber}>{formatLevel(workout.level)}</Text>
            <Text style={styles.summaryLabel}>Nivel</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Rondas del entrenamiento</Text>

        {workout.rounds && workout.rounds.length > 0 ? (
          workout.rounds.map((round, index) => (
            <View key={index} style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <View style={styles.roundNumber}>
                  <Text style={styles.roundNumberText}>{index + 1}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.roundTitle}>{round.title}</Text>
                  <Text style={styles.roundDuration}>
                    ⏱ {formatSeconds(round.duration)}
                  </Text>
                </View>
              </View>

              <Text style={styles.roundDescription}>{round.description}</Text>

              <View style={styles.roundImagePlaceholder}>
                <Ionicons name="fitness-outline" size={28} color="#FF7A00" />
                <Text style={styles.roundImageText}>
                  Referencia visual: {round.image || "sin imagen"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noRoundsCard}>
            <Text style={styles.noRoundsTitle}>
              Este entrenamiento aún no tiene rondas cargadas
            </Text>
            <Text style={styles.noRoundsText}>
              Añade las rondas en Firestore para mostrar cada bloque con su
              duración, explicación e imagen.
            </Text>
          </View>
        )}

        <Pressable
          style={styles.startBtn}
          onPress={() =>
            router.push({
              pathname: "/training-session",
              params: { workoutId: String(workoutId) },
            } as any)
          }
        >
          <Ionicons name="play" size={18} color="white" />
          <Text style={styles.startBtnText}>Iniciar entrenamiento</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryBtn, favorite && styles.secondaryBtnActive]}
          onPress={toggleFavorite}
          disabled={favoriteLoading}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={18}
            color="white"
          />
          <Text style={styles.secondaryBtnText}>
            {favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.secondaryBlueBtn,
            downloaded && styles.secondaryBlueBtnActive,
          ]}
          onPress={toggleDownload}
          disabled={downloadLoading}
        >
          <Ionicons
            name={downloaded ? "checkmark-circle" : "download-outline"}
            size={18}
            color="white"
          />
          <Text style={styles.secondaryBtnText}>
            {downloaded ? "Quitar de descargados" : "Descargar entrenamiento"}
          </Text>
        </Pressable>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Valora este entrenamiento</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => rateWorkout(star)}>
                <Ionicons
                  name={star <= userRating ? "star" : "star-outline"}
                  size={34}
                  color="#FF7A00"
                />
              </Pressable>
            ))}
          </View>

          <Text style={styles.averageText}>
            Valoración media: {averageRating}/5
          </Text>
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
    paddingTop: 54,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#070A0F",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  topTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
  },

  heroCard: {
    backgroundColor: "rgba(0,0,0,0.72)",
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.45)",
    marginBottom: 22,
    shadowColor: "#FF7A00",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  heroSmall: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    marginBottom: 6,
  },

  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
    lineHeight: 34,
  },

  heroDescription: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },

  ratingMiniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ratingMiniText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  summaryCard: {
    width: "31%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  summaryNumber: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },

  summaryLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },

  roundCard: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },

  roundHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  roundNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  roundNumberText: {
    color: "white",
    fontWeight: "900",
  },

  roundTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },

  roundDuration: {
    color: "#2E8BFF",
    marginTop: 4,
    fontWeight: "700",
  },

  roundDescription: {
    color: "rgba(255,255,255,0.76)",
    lineHeight: 20,
    marginBottom: 14,
  },

  roundImagePlaceholder: {
    height: 90,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  roundImageText: {
    color: "#aaa",
    marginTop: 8,
    textAlign: "center",
  },

  noRoundsCard: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },

  noRoundsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  noRoundsText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: 20,
  },

  startBtn: {
    marginTop: 8,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  startBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },

  secondaryBtn: {
    marginTop: 12,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,122,0,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  secondaryBtnActive: {
    backgroundColor: "rgba(255,122,0,0.4)",
  },

  secondaryBlueBtn: {
    marginTop: 12,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(46,139,255,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(46,139,255,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  secondaryBlueBtnActive: {
    backgroundColor: "rgba(46,139,255,0.42)",
  },

  secondaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  ratingCard: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    marginBottom: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.25)",
  },

  ratingTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 14,
  },

  starsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  averageText: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
  },
});