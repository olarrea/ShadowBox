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
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../themeContext";

type LastWorkout = {
  id?: string;
  title?: string;
  estimatedMinutes?: number;
  level?: string;
  roundsCount?: number;
};

export default function TrainHubScreen() {
  const [lastWorkout, setLastWorkout] = useState<LastWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.92)",
    orangeBorder: isDark
      ? "rgba(255,122,0,0.55)"
      : "rgba(255,122,0,0.35)",
    blueBorder: isDark
      ? "rgba(46,139,255,0.55)"
      : "rgba(46,139,255,0.35)",
    softBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(7,17,31,0.06)",
  };

  useFocusEffect(
    useCallback(() => {
      loadLastWorkout();
    }, [])
  );

  async function loadLastWorkout() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLastWorkout(null);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setLastWorkout(null);
        return;
      }

      const userData = userSnap.data();

      if (userData.lastWorkoutId) {
        setLastWorkout({
          id: userData.lastWorkoutId,
          title: userData.lastWorkoutTitle || "Entrenamiento",
          estimatedMinutes: userData.lastWorkoutMinutes || 0,
          level: userData.lastWorkoutLevel || "basico",
          roundsCount: userData.lastWorkoutRounds || 0,
        });
      } else {
        setLastWorkout(null);
      }
    } catch (error) {
      console.log("ERROR CARGANDO ÚLTIMO ENTRENAMIENTO:", error);
    } finally {
      setLoading(false);
    }
  }

  function goToLastWorkoutDetail() {
    if (!lastWorkout?.id) return;

    router.push({
      pathname: "/workout-detail",
      params: { workoutId: lastWorkout.id },
    } as any);
  }

  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.38 : 0.14 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Text style={[styles.title, { color: colors.text }]}>
            Entrenar
          </Text>

          <Ionicons name="barbell-outline" size={28} color="#FF7A00" />
        </View>

        {loading ? (
          <View
            style={[
              styles.loadingWrap,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
          >
            <ActivityIndicator size="large" color="#FF7A00" />

            <Text style={[styles.loadingText, { color: colors.text }]}>
              Cargando entrenamiento...
            </Text>
          </View>
        ) : lastWorkout ? (
          <Pressable
            style={[
              styles.mainCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
            onPress={goToLastWorkoutDetail}
          >
            <View style={styles.mainCardTextWrap}>
              <Text
                style={[styles.mainCardSmall, { color: colors.muted }]}
              >
                Último entrenamiento realizado
              </Text>

              <Text
                style={[styles.mainCardTitle, { color: colors.text }]}
              >
                {lastWorkout.title}
              </Text>

              <Text
                style={[styles.mainCardInfo, { color: colors.muted }]}
              >
                {(lastWorkout.roundsCount || 0) > 0
                  ? `${lastWorkout.roundsCount} rondas`
                  : "Rondas por definir"}{" "}
                · {lastWorkout.estimatedMinutes || 0} min ·{" "}
                {lastWorkout.level
                  ? lastWorkout.level.charAt(0).toUpperCase() +
                    lastWorkout.level.slice(1)
                  : "Básico"}
              </Text>
            </View>

            <View style={styles.playCircle}>
              <Ionicons name="play" size={28} color="#fff" />
            </View>
          </Pressable>
        ) : (
          <View
            style={[
              styles.emptyTopCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
          >
            <View style={styles.emptyTopLeft}>
              <Text
                style={[styles.mainCardSmall, { color: colors.muted }]}
              >
                Último entrenamiento realizado
              </Text>

              <Text
                style={[styles.emptyTopTitle, { color: colors.text }]}
              >
                Aún no has realizado ningún entrenamiento
              </Text>
            </View>

            <View style={styles.emptyPlayCircle}>
              <Ionicons name="time-outline" size={28} color="#fff" />
            </View>
          </View>
        )}

        <Text
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          Accesos rápidos
        </Text>

        <View style={styles.grid}>
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.blueBorder,
              },
            ]}
            onPress={() =>
              router.push({ pathname: "/offline-workouts" } as any)
            }
          >
            <Ionicons
              name="download-outline"
              size={30}
              color="#2E8BFF"
            />

            <Text
              style={[styles.cardTitle, { color: colors.text }]}
            >
              Descargados
            </Text>

            <Text
              style={[styles.cardText, { color: colors.muted }]}
            >
              Entrena sin conexión
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
            onPress={() =>
              router.push({ pathname: "/favorites" } as any)
            }
          >
            <Ionicons
              name="heart-outline"
              size={30}
              color="#FF7A00"
            />

            <Text
              style={[styles.cardTitle, { color: colors.text }]}
            >
              Favoritos
            </Text>

            <Text
              style={[styles.cardText, { color: colors.muted }]}
            >
              Tus rutinas guardadas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.blueBorder,
              },
            ]}
            onPress={() =>
              router.push({ pathname: "/my-workouts" } as any)
            }
          >
            <Ionicons
              name="create-outline"
              size={30}
              color="#2E8BFF"
            />

            <Text
              style={[styles.cardTitle, { color: colors.text }]}
            >
              Mis entrenos
            </Text>

            <Text
              style={[styles.cardText, { color: colors.muted }]}
            >
              Rutinas creadas por ti
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
            onPress={() =>
              router.push({ pathname: "/workouts" } as any)
            }
          >
            <Ionicons
              name="albums-outline"
              size={30}
              color="#FF7A00"
            />

            <Text
              style={[styles.cardTitle, { color: colors.text }]}
            >
              Entrenos app
            </Text>

            <Text
              style={[styles.cardText, { color: colors.muted }]}
            >
              Rutinas incluidas en ShadowBox
            </Text>
          </Pressable>
        </View>
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
    fontSize: 30,
    fontWeight: "900",
  },

  loadingWrap: {
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1.5,
  },

  loadingText: {
    marginTop: 12,
    fontWeight: "700",
  },

  mainCard: {
    borderRadius: 24,
    borderWidth: 2,
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

  emptyTopCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTopLeft: {
    flex: 1,
    paddingRight: 12,
  },

  emptyTopTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
    lineHeight: 28,
  },

  emptyPlayCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,122,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  mainCardTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  mainCardSmall: {
    fontSize: 14,
    marginBottom: 6,
  },

  mainCardTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },

  mainCardInfo: {
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
    padding: 16,
    marginBottom: 14,
    justifyContent: "space-between",
    borderWidth: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },

  cardText: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});