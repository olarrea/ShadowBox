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
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

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

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.92)",
    orangeBorder: isDark
      ? "rgba(255,122,0,0.35)"
      : "rgba(255,122,0,0.35)",
  };

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
            {t("favorites")}
          </Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />

            <Text style={[styles.loadingText, { color: colors.text }]}>
              {t("loadingFavorites")}
            </Text>
          </View>
        ) : favorites.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
          >
            <Ionicons name="heart-outline" size={34} color="#FF7A00" />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t("noFavorites")}
            </Text>

            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {t("favoritesHint")}
            </Text>
          </View>
        ) : (
          favorites.map((workout) => (
            <Pressable
              key={workout.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.orangeBorder,
                },
              ]}
              onPress={() => openWorkout(workout.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {workout.title}
                </Text>

                <Text style={[styles.cardInfo, { color: colors.muted }]}>
                  {(workout.rounds?.length || 0) > 0
                    ? `${workout.rounds?.length} ${t("rounds")}`
                    : t("roundsUndefined")}{" "}
                  · {workout.estimatedMinutes} min ·{" "}
                  {workout.level.charAt(0).toUpperCase() +
                    workout.level.slice(1)}
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
    fontWeight: "800",
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
    marginTop: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardInfo: {
    fontSize: 14,
    lineHeight: 20,
  },
});