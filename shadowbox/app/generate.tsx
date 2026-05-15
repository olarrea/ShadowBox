import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

type Level = "Principiante" | "Intermedio" | "Avanzado";
type Goal = "Resistencia" | "Técnica" | "Fuerza";

type Workout = {
  id: string;
  title: string;
  description?: string;
  level: string;
  estimatedMinutes: number;
  createdBy?: string;
  rounds?: any[];
};

const LEVELS: Level[] = ["Principiante", "Intermedio", "Avanzado"];

function normalizeLevel(level: Level) {
  if (level === "Principiante") return "basico";
  if (level === "Intermedio") return "intermedio";
  return "experto";
}

export default function GenerateScreen() {
  const [level, setLevel] = useState<Level>("Principiante");
  const [openLevel, setOpenLevel] = useState(false);
  const [goal, setGoal] = useState<Goal>("Resistencia");
  const [days, setDays] = useState(3);
  const [duration, setDuration] = useState(45);
  const [generating, setGenerating] = useState(false);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.92)",
    panel: isDark ? "rgba(10,12,16,0.9)" : "rgba(255,255,255,0.96)",
    inputBorder: isDark ? "rgba(46,139,255,0.55)" : "rgba(46,139,255,0.35)",
    softBorder: isDark ? "rgba(255,255,255,0.10)" : "rgba(7,17,31,0.12)",
    chipBg: isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.9)",
    chipActiveBg: isDark ? "rgba(255,122,0,0.20)" : "rgba(255,122,0,0.18)",
    iconBg: isDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.88)",
  };

  const durationLabel = useMemo(() => `${duration} ${t("minutes")}`, [duration, t]);

  function incDays() {
    setDays((d) => Math.min(7, d + 1));
  }

  function decDays() {
    setDays((d) => Math.max(1, d - 1));
  }

  function cycleDuration() {
    const options = [30, 45, 60, 75];
    const idx = options.indexOf(duration);
    setDuration(options[(idx + 1) % options.length]);
  }

  function translateLevel(value: Level) {
    if (value === "Principiante") return t("beginner");
    if (value === "Intermedio") return t("intermediate");
    return t("advanced");
  }

  function translateGoal(value: Goal) {
    if (value === "Resistencia") return t("endurance");
    if (value === "Técnica") return t("technique");
    return t("strength");
  }

  async function onGenerate() {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(t("error"), t("loginRequired"));
        return;
      }

      setGenerating(true);

      const snap = await getDocs(collection(db, "workouts"));

      const allWorkouts: Workout[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Workout, "id">),
      }));

      const selectedLevel = normalizeLevel(level);

      let matchingWorkouts = allWorkouts.filter(
        (w) => w.level === selectedLevel && w.estimatedMinutes <= duration
      );

      if (matchingWorkouts.length === 0) {
        matchingWorkouts = allWorkouts.filter((w) => w.level === selectedLevel);
      }

      if (matchingWorkouts.length === 0) {
        matchingWorkouts = allWorkouts;
      }

      if (matchingWorkouts.length === 0) {
        Alert.alert(t("error"), t("noWorkoutsAvailable"));
        return;
      }

      const planWorkouts = Array.from({ length: days }).map((_, index) => {
        const workout = matchingWorkouts[index % matchingWorkouts.length];

        return {
          day: index + 1,
          workoutId: workout.id,
          title: workout.title,
          description: workout.description || "",
          level: workout.level,
          estimatedMinutes: workout.estimatedMinutes,
          roundsCount: workout.rounds?.length || 0,
        };
      });

      await setDoc(doc(db, "users", user.uid, "plans", "generated"), {
        goal,
        level: selectedLevel,
        days,
        duration,
        workouts: planWorkouts,
        generatedAt: new Date().toISOString(),
      });

      router.push({ pathname: "/plan" } as any);
    } catch (error) {
      console.log("ERROR GENERANDO PLAN:", error);
      Alert.alert(t("error"), t("generatePlanError"));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.65 : 0.15 }}
    >
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View
            style={[
              styles.brandIcon,
              {
                backgroundColor: colors.iconBg,
                borderColor: isDark
                  ? "rgba(255,122,0,0.35)"
                  : "rgba(255,122,0,0.45)",
              },
            ]}
          >
            <Ionicons name="hand-left-outline" size={18} color="#FF7A00" />
          </View>

          <Text style={[styles.brandText, { color: colors.text }]}>
            <Text style={{ color: "#2E8BFF", fontWeight: "800" }}>Shado</Text>
            <Text style={{ color: "#FF7A00", fontWeight: "800" }}>wBox</Text>
            <Text style={[styles.brandSub, { color: colors.muted }]}>
              {" "}
              Boxing Training
            </Text>
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {t("generatePlan")}
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>
          {t("userLevel")}
        </Text>

        <Pressable
          style={[
            styles.dropdownBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.inputBorder,
            },
          ]}
          onPress={() => setOpenLevel((v) => !v)}
        >
          <Text style={[styles.dropdownText, { color: colors.text }]}>
            {translateLevel(level)}
          </Text>

          <Ionicons
            name={openLevel ? "chevron-up" : "chevron-down"}
            size={18}
            color="#2E8BFF"
          />
        </Pressable>

        {openLevel && (
          <View
            style={[
              styles.dropdownPanel,
              {
                backgroundColor: colors.panel,
                borderColor: colors.softBorder,
              },
            ]}
          >
            {LEVELS.map((l) => (
              <Pressable
                key={l}
                style={styles.dropdownItem}
                onPress={() => {
                  setLevel(l);
                  setOpenLevel(false);
                }}
              >
                <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                  {translateLevel(l)}
                </Text>

                <Ionicons name="checkmark" size={18} color="#2E8BFF" />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          {t("goal")}
        </Text>

        <View style={styles.chipsRow}>
          <Chip
            text={translateGoal("Resistencia")}
            icon="radio-button-on-outline"
            active={goal === "Resistencia"}
            onPress={() => setGoal("Resistencia")}
            colors={colors}
          />

          <Chip
            text={translateGoal("Técnica")}
            icon="aperture-outline"
            active={goal === "Técnica"}
            onPress={() => setGoal("Técnica")}
            colors={colors}
          />

          <Chip
            text={translateGoal("Fuerza")}
            icon="barbell-outline"
            active={goal === "Fuerza"}
            onPress={() => setGoal("Fuerza")}
            colors={colors}
          />
        </View>

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          {t("daysPerWeek")}
        </Text>

        <View
          style={[
            styles.controlCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.softBorder,
            },
          ]}
        >
          <Pressable style={styles.iconBtn} onPress={decDays}>
            <Ionicons name="remove" size={18} color="#2E8BFF" />
          </Pressable>

          <Text style={[styles.controlValue, { color: colors.text }]}>
            {days}
          </Text>

          <Pressable style={styles.iconBtn} onPress={incDays}>
            <Ionicons name="add" size={18} color="#2E8BFF" />
          </Pressable>

          <Ionicons name="calendar-outline" size={20} color="#2E8BFF" />
        </View>

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          {t("maxDuration")}
        </Text>

        <Pressable
          style={[
            styles.controlCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.softBorder,
            },
          ]}
          onPress={cycleDuration}
        >
          <Text style={[styles.controlValue, { color: colors.text }]}>
            {durationLabel}
          </Text>

          <Ionicons name="time-outline" size={20} color="#2E8BFF" />
        </Pressable>

        <Pressable
          style={[styles.generateBtn, generating && { opacity: 0.7 }]}
          onPress={onGenerate}
          disabled={generating}
        >
          <Ionicons name="hand-left" size={18} color="#FFFFFF" />

          <Text style={styles.generateText}>
            {generating ? t("generating") : t("generatePlan")}
          </Text>
        </Pressable>

        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.muted }]}>
            {t("back")}
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

function Chip({
  text,
  icon,
  active,
  onPress,
  colors,
}: {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.chipActiveBg : colors.chipBg,
          borderColor: "rgba(255,122,0,0.65)",
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={16}
        color="#FF7A00"
        style={{ marginRight: 8 }}
      />

      <Text style={[styles.chipText, { color: colors.text }]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  brandIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  brandText: {
    fontSize: 16,
  },

  brandSub: {
    fontSize: 12,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 14,
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
  },

  dropdownBtn: {
    height: 54,
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    fontSize: 18,
    fontWeight: "700",
  },

  dropdownPanel: {
    marginTop: 10,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownItemText: {
    fontSize: 16,
    fontWeight: "600",
  },

  chipsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
  },

  chipText: {
    fontSize: 14,
    fontWeight: "700",
  },

  controlCard: {
    height: 54,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  controlValue: {
    fontSize: 20,
    fontWeight: "900",
  },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(46,139,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  generateBtn: {
    marginTop: 26,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#FF7A00",
    shadowOpacity: Platform.OS === "android" ? 0.35 : 0.4,
    shadowRadius: 16,
    elevation: 10,
  },

  generateText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  backLink: {
    marginTop: 12,
    alignItems: "center",
  },

  backText: {
    fontWeight: "700",
  },
});