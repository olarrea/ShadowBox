import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { router } from "expo-router";
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

type UserRanking = {
  id: string;
  name: string;
  level: number;
  sessions: number;
  totalTime: number;
  points: number;
};

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark
      ? "rgba(255,255,255,0.7)"
      : "rgba(7,17,31,0.65)",
    card: isDark
      ? "rgba(0,0,0,0.65)"
      : "rgba(255,255,255,0.92)",
    border: isDark
      ? "rgba(255,122,0,0.35)"
      : "rgba(46,139,255,0.28)",
  };

  useEffect(() => {
    loadRanking();
  }, []);

  async function loadRanking() {
    try {
      const snap = await getDocs(collection(db, "users"));

      const data: UserRanking[] = snap.docs.map((docSnap) => {
        const data = docSnap.data();

        const sessions = data.sessions || 0;
        const totalTime = data.totalTime || 0;
        const level = data.level || 1;

        const points =
          sessions * 20 +
          totalTime * 2 +
          level * 100;

        return {
          id: docSnap.id,
          name: data.name || t("user"),
          level,
          sessions,
          totalTime,
          points,
        };
      });

      data.sort((a, b) => b.points - a.points);

      setUsers(data);
    } catch (error) {
      console.log("ERROR CARGANDO RANKING:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMedal(index: number) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
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
              color={colors.text}
            />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            {t("globalRanking")}
          </Text>

          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF7A00" />

            <Text style={[styles.loadingText, { color: colors.text }]}>
              {t("loadingRanking")}
            </Text>
          </View>
        ) : (
          users.map((user, index) => (
            <View
              key={user.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.left}>
                <Text style={styles.position}>
                  {getMedal(index)}
                </Text>

                <View>
                  <Text
                    style={[styles.name, { color: colors.text }]}
                  >
                    {user.name}
                  </Text>

                  <Text
                    style={[styles.info, { color: colors.muted }]}
                  >
                    {t("level")} {user.level} · {user.sessions} {t("sessions")}
                  </Text>
                </View>
              </View>

              <View style={styles.pointsWrap}>
                <Ionicons
                  name="flame"
                  size={18}
                  color="#FF7A00"
                />

                <Text style={styles.points}>
                  {user.points}
                </Text>
              </View>
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
    padding: 20,
    paddingTop: 54,
    paddingBottom: 30,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
  },

  loadingWrap: {
    marginTop: 40,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontWeight: "700",
  },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  position: {
    fontSize: 28,
    fontWeight: "900",
    marginRight: 16,
    width: 54,
    textAlign: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },

  info: {
    fontSize: 13,
    fontWeight: "600",
  },

  pointsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  points: {
    color: "#FF7A00",
    fontWeight: "900",
    fontSize: 18,
  },
});