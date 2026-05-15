import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { CHALLENGES } from "../utils/challenges";
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

type UserStats = {
  sessions?: number;
  totalTime?: number;
  level?: number;
  lastWorkoutTitle?: string;
  lastWorkoutMinutes?: number;
  lastWorkoutRounds?: number;
  completedChallenges?: string[];
};

export default function ProgressScreen() {
  const [stats, setStats] = useState<UserStats>({
    sessions: 0,
    totalTime: 0,
    level: 1,
    completedChallenges: [],
  });

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.92)",
    hero: isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.94)",
    softBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(7,17,31,0.12)",
    orangeBorder: isDark ? "rgba(255,122,0,0.45)" : "rgba(255,122,0,0.35)",
    blueBorder: isDark ? "rgba(77,163,255,0.45)" : "rgba(46,139,255,0.35)",
    progressBg: isDark ? "rgba(255,255,255,0.12)" : "rgba(7,17,31,0.12)",
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setStats(snap.data() as UserStats);
      }
    } catch (error) {
      console.log("ERROR CARGANDO PROGRESO:", error);
    }
  }

  const sessions = stats.sessions || 0;
  const totalTime = stats.totalTime || 0;
  const level = stats.level || 1;
  const completedChallenges = stats.completedChallenges || [];

  const completed = CHALLENGES.filter((challenge) =>
    completedChallenges.includes(challenge.id)
  );

  const pending = CHALLENGES.filter(
    (challenge) => !completedChallenges.includes(challenge.id)
  );

  const totalChallenges = CHALLENGES.length;
  const challengePercent =
    totalChallenges > 0
      ? Math.round((completed.length / totalChallenges) * 100)
      : 0;

  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  function getChallengeProgress(challenge: any) {
    if (challenge.id.startsWith("sessions")) {
      return Math.min(sessions, challenge.target);
    }

    if (challenge.id.startsWith("time")) {
      return Math.min(totalTime, challenge.target);
    }

    return 0;
  }

  function getChallengeIcon(challengeId: string) {
    if (challengeId.startsWith("sessions")) return "checkmark-done-outline";
    if (challengeId.startsWith("time")) return "time-outline";
    return "trophy-outline";
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
            {t("progress")}
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <View
          style={[
            styles.levelCard,
            {
              backgroundColor: colors.hero,
              borderColor: colors.orangeBorder,
            },
          ]}
        >
          <View style={styles.circle}>
            <Text style={[styles.levelText, { color: colors.text }]}>
              {t("level")} {level}
            </Text>

            <Text style={styles.percentText}>{challengePercent}%</Text>
          </View>

          <Text style={[styles.levelInfo, { color: colors.muted }]}>
            {completed.length} {t("of")} {totalChallenges}{" "}
            {t("completedChallenges")}
          </Text>

          <View style={[styles.progressBar, { backgroundColor: colors.progressBg }]}>
            <View style={[styles.progressFill, { width: `${challengePercent}%` }]} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.blueBorder },
            ]}
          >
            <Ionicons name="checkmark-done-outline" size={28} color="#4DA3FF" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {sessions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {t("sessions")}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.orangeBorder },
            ]}
          >
            <Ionicons name="time-outline" size={28} color="#FF7A00" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {hours}h {minutes}m
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {t("time")}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.blueBorder },
            ]}
          >
            <Ionicons name="trophy-outline" size={28} color="#4DA3FF" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {completed.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {t("challenges")}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.lastCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.softBorder,
            },
          ]}
        >
          <View style={styles.lastHeader}>
            <Ionicons name="flame-outline" size={24} color="#FF7A00" />
            <Text style={[styles.lastTitle, { color: colors.text }]}>
              {t("lastWorkout")}
            </Text>
          </View>

          {stats.lastWorkoutTitle ? (
            <>
              <Text style={[styles.lastWorkout, { color: colors.text }]}>
                {stats.lastWorkoutTitle}
              </Text>
              <Text style={[styles.lastInfo, { color: colors.muted }]}>
                {stats.lastWorkoutRounds || 0} {t("rounds")} ·{" "}
                {stats.lastWorkoutMinutes || 0} min
              </Text>
            </>
          ) : (
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {t("noCompletedWorkout")}
            </Text>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("completedChallengesTitle")}
        </Text>

        {completed.length === 0 ? (
          <View
            style={[
              styles.emptyChallengeCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.orangeBorder,
              },
            ]}
          >
            <Ionicons name="trophy-outline" size={26} color="#FF7A00" />
            <Text style={[styles.emptyChallengeText, { color: colors.muted }]}>
              {t("noChallengesCompleted")}
            </Text>
          </View>
        ) : (
          completed.map((challenge) => (
            <View
              key={challenge.id}
              style={[
                styles.completedChallengeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.orangeBorder,
                },
              ]}
            >
              <View style={styles.challengeIconOrange}>
                <Ionicons
                  name={getChallengeIcon(challenge.id) as any}
                  size={22}
                  color="white"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.challengeTitle, { color: colors.text }]}>
                  {challenge.title}
                </Text>
                <Text style={[styles.challengeText, { color: colors.muted }]}>
                  {challenge.description}
                </Text>
              </View>

              <Ionicons name="checkmark-circle" size={24} color="#FF7A00" />
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("pendingChallengesTitle")}
        </Text>

        {pending.map((challenge) => {
          const current = getChallengeProgress(challenge);
          const percent = Math.round((current / challenge.target) * 100);

          return (
            <View
              key={challenge.id}
              style={[
                styles.pendingChallengeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.blueBorder,
                },
              ]}
            >
              <View style={styles.challengeIconBlue}>
                <Ionicons
                  name={getChallengeIcon(challenge.id) as any}
                  size={22}
                  color="white"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.challengeTitle, { color: colors.text }]}>
                  {challenge.title}
                </Text>
                <Text style={[styles.challengeText, { color: colors.muted }]}>
                  {challenge.description}
                </Text>

                <View
                  style={[
                    styles.smallProgressBar,
                    { backgroundColor: colors.progressBg },
                  ]}
                >
                  <View
                    style={[
                      styles.smallProgressFill,
                      { width: `${percent}%` },
                    ]}
                  />
                </View>

                <Text style={[styles.challengeProgress, { color: colors.muted }]}>
                  {current} / {challenge.target}
                </Text>
              </View>
            </View>
          );
        })}

        <Pressable
          style={styles.trainBtn}
          onPress={() => router.push({ pathname: "/(tabs)/train" } as any)}
        >
          <Ionicons name="play" size={20} color="white" />
          <Text style={styles.trainBtnText}>{t("newSession")}</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 20, paddingTop: 54, paddingBottom: 32 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "900" },
  levelCard: { borderRadius: 24, padding: 22, alignItems: "center", borderWidth: 2, marginBottom: 22 },
  circle: { width: 150, height: 150, borderRadius: 75, borderWidth: 8, borderColor: "#4DA3FF", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  levelText: { fontSize: 24, fontWeight: "900" },
  percentText: { color: "#FF7A00", fontSize: 18, fontWeight: "800", marginTop: 4 },
  levelInfo: { fontSize: 14, marginBottom: 12, textAlign: "center" },
  progressBar: { width: "100%", height: 12, borderRadius: 10, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 10, backgroundColor: "#FF7A00" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  statCard: { width: "31%", padding: 14, borderRadius: 18, alignItems: "center", borderWidth: 1.5 },
  statValue: { fontSize: 18, fontWeight: "900", marginTop: 8, textAlign: "center" },
  statLabel: { fontSize: 12, marginTop: 4 },
  lastCard: { borderRadius: 22, padding: 20, borderWidth: 1.5, marginBottom: 22 },
  lastHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  lastTitle: { fontSize: 18, fontWeight: "900", marginLeft: 8 },
  lastWorkout: { fontSize: 20, fontWeight: "900", marginBottom: 6 },
  lastInfo: { fontSize: 14 },
  emptyText: { lineHeight: 20 },
  sectionTitle: { fontSize: 19, fontWeight: "900", marginBottom: 12, marginTop: 4 },
  emptyChallengeCard: { borderRadius: 18, padding: 16, borderWidth: 1.5, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 12 },
  emptyChallengeText: { flex: 1, lineHeight: 20 },
  completedChallengeCard: { borderRadius: 18, padding: 16, borderWidth: 1.5, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  pendingChallengeCard: { borderRadius: 18, padding: 16, borderWidth: 1.5, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  challengeIconOrange: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FF7A00", alignItems: "center", justifyContent: "center" },
  challengeIconBlue: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#2E8BFF", alignItems: "center", justifyContent: "center" },
  challengeTitle: { fontSize: 16, fontWeight: "900", marginBottom: 4 },
  challengeText: { fontSize: 13, lineHeight: 18 },
  smallProgressBar: { height: 8, borderRadius: 8, marginTop: 10, overflow: "hidden" },
  smallProgressFill: { height: "100%", borderRadius: 8, backgroundColor: "#2E8BFF" },
  challengeProgress: { fontSize: 12, marginTop: 6, fontWeight: "700" },
  trainBtn: { height: 58, borderRadius: 18, backgroundColor: "#FF7A00", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 },
  trainBtnText: { color: "white", fontSize: 17, fontWeight: "900" },
});