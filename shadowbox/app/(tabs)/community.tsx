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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useTheme } from "../../themeContext";
import { useTranslation } from "../../utils/useTranslation";

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

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.68)" : "rgba(7,17,31,0.65)",
    card: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.92)",
    cardSoft: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.9)",
    blueBorder: isDark ? "rgba(46,139,255,0.45)" : "rgba(46,139,255,0.35)",
    orangeBorder: isDark ? "rgba(255,122,0,0.45)" : "rgba(255,122,0,0.38)",
    avatarBg: isDark ? "rgba(255,255,255,0.10)" : "rgba(7,17,31,0.08)",
    badgeBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(7,17,31,0.08)",
  };

  useEffect(() => {
    loadCommunityWorkouts();
  }, []);

  async function loadCommunityWorkouts() {
    try {
      const user = auth.currentUser;

      const snap = await getDocs(collection(db, "workouts"));

      const baseData = snap.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Workout, "id">),
        }))
        .filter((workout) => {
          if (workout.createdBy === "system") return false;
          if (workout.createdBy === user?.uid) return false;
          return true;
        });

      const data = await Promise.all(
        baseData.map(async (workout) => {
          if (workout.createdByName || !workout.createdBy) {
            return workout;
          }

          try {
            const userRef = doc(db, "users", workout.createdBy);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();

              return {
                ...workout,
                createdByName: userData.name || userData.email || "Usuario",
              };
            }

            return workout;
          } catch (error) {
            console.log("ERROR CARGANDO AUTOR:", error);
            return workout;
          }
        })
      );

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
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.65 : 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("community")}
          </Text>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: isDark
                  ? "rgba(0,0,0,0.45)"
                  : "rgba(255,255,255,0.9)",
                borderColor: colors.blueBorder,
              },
            ]}
          >
            <Ionicons name="people" size={18} color="#FF7A00" />
          </View>
        </View>

        <Pressable
          style={[
            styles.leaderboardBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.orangeBorder,
            },
          ]}
          onPress={() => router.push("/leaderboard")}
        >
          <View style={styles.leaderboardLeft}>
            <View style={styles.leaderboardIcon}>
              <Ionicons name="trophy" size={22} color="#FF7A00" />
            </View>

            <View>
              <Text style={[styles.leaderboardTitle, { color: colors.text }]}>
                {t("ranking")}
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#2E8BFF" />
        </Pressable>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />

            <Text style={[styles.loadingText, { color: colors.text }]}>
              {t("loading")}
            </Text>
          </View>
        ) : workouts.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.cardSoft,
                borderColor: colors.blueBorder,
              },
            ]}
          >
            <Ionicons name="people-outline" size={34} color="#2E8BFF" />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t("noCommunityWorkouts")}
            </Text>

            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {t("communityWorkoutsInfo")}
            </Text>
          </View>
        ) : (
          workouts.map((workout) => (
            <View
              key={workout.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.blueBorder,
                },
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.avatarWrap}>
                  <View style={[styles.avatarRing, { borderColor: "#FF7A00" }]}>
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: colors.avatarBg },
                      ]}
                    >
                      <Text style={[styles.avatarText, { color: colors.text }]}>
                        {(workout.createdByName || "U")
                          .slice(0, 1)
                          .toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {workout.title}
                  </Text>

                  <Text style={[styles.authorText, { color: colors.muted }]}>
                    {t("by")} {workout.createdByName || "Usuario"}
                  </Text>

                  <View style={styles.badgeRow}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>{workout.level}</Text>
                    </View>

                    <View
                      style={[
                        styles.infoBadge,
                        { backgroundColor: colors.badgeBg },
                      ]}
                    >
                      <Text
                        style={[styles.infoBadgeText, { color: colors.text }]}
                      >
                        {workout.estimatedMinutes} {t("minutes")}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.infoBadge,
                        { backgroundColor: colors.badgeBg },
                      ]}
                    >
                      <Text
                        style={[styles.infoBadgeText, { color: colors.text }]}
                      >
                        {workout.rounds?.length || 0} {t("rounds")}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#FF7A00" />

                    <Text style={[styles.ratingText, { color: colors.text }]}>
                      {workout.averageRating || 0}/5
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={styles.btn}
                onPress={() => openWorkout(workout.id)}
              >
                <Text style={styles.btnText}>{t("viewWorkout")}</Text>
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
    fontSize: 34,
    fontWeight: "900",
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  leaderboardBtn: {
    height: 82,
    borderRadius: 22,
    borderWidth: 2,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  leaderboardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  leaderboardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,122,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  leaderboardTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  leaderboardSubtitle: {
    marginTop: 4,
    fontSize: 13,
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
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    borderRadius: 20,
    borderWidth: 2,
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
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontWeight: "900",
    fontSize: 18,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  authorText: {
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
    alignItems: "center",
    justifyContent: "center",
  },

  infoBadgeText: {
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