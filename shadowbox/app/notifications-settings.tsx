import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "../themeContext";
import { useTranslation } from "../utils/useTranslation";

export default function NotificationsSettingsScreen() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark
      ? "rgba(255,255,255,0.76)"
      : "rgba(7,17,31,0.72)",
    card: isDark
      ? "rgba(0,0,0,0.7)"
      : "rgba(255,255,255,0.92)",
    border: isDark
      ? "rgba(255,122,0,0.45)"
      : "rgba(46,139,255,0.35)",
    secondaryBtn: isDark
      ? "rgba(255,255,255,0.12)"
      : "rgba(7,17,31,0.06)",
  };

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setEnabled(!!data.notificationsEnabled);
      }
    } catch (error) {
      console.log("ERROR CARGANDO NOTIFICACIONES:", error);
    }
  }

  async function enableNotifications() {
    try {
      setLoading(true);

      const permission = await Notifications.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t("permissionRequired"),
          t("notificationPermissionRequired")
        );
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: t("trainingTime"),
          body: t("dailyTrainingReminder"),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
        } as any,
      });

      const user = auth.currentUser;

      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          notificationsEnabled: true,
          notificationHour: 20,
          notificationMinute: 0,
        });
      }

      setEnabled(true);

      Alert.alert(
        t("remindersEnabled"),
        t("dailyReminderEnabled")
      );
    } catch (error) {
      console.log("ERROR ACTIVANDO NOTIFICACIONES:", error);

      Alert.alert(
        t("genericError"),
        t("notificationsEnableError")
      );
    } finally {
      setLoading(false);
    }
  }

  async function disableNotifications() {
    try {
      setLoading(true);

      await Notifications.cancelAllScheduledNotificationsAsync();

      const user = auth.currentUser;

      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          notificationsEnabled: false,
        });
      }

      setEnabled(false);

      Alert.alert(
        t("remindersDisabled"),
        t("dailyReminderDisabled")
      );
    } catch (error) {
      console.log("ERROR DESACTIVANDO NOTIFICACIONES:", error);

      Alert.alert(
        t("genericError"),
        t("notificationsDisableError")
      );
    } finally {
      setLoading(false);
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
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={26}
              color={isDark ? "white" : "#07111F"}
            />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            {t("notifications")}
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={42}
            color="#FF7A00"
          />

          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t("smartReminders")}
          </Text>

          <Text style={[styles.cardText, { color: colors.muted }]}>
            {t("smartRemindersDescription")}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: enabled ? "#32D74B" : "#FF453A",
                },
              ]}
            />

            <Text style={[styles.statusText, { color: colors.text }]}>
              {enabled ? t("enabled") : t("disabled")}
            </Text>
          </View>

          <Text style={styles.timeText}>
            {t("configuredTime")}: 20:00
          </Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#FF7A00"
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <Pressable
                style={styles.enableBtn}
                onPress={enableNotifications}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="white"
                />

                <Text style={styles.btnText}>
                  {t("enableReminder")}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.disableBtn,
                  { backgroundColor: colors.secondaryBtn },
                ]}
                onPress={disableNotifications}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color={isDark ? "white" : "#07111F"}
                />

                <Text
                  style={[
                    styles.disableText,
                    { color: colors.text },
                  ]}
                >
                  {t("disableReminder")}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 54,
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

  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },

  cardText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 18,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: {
    fontSize: 15,
    fontWeight: "800",
  },

  timeText: {
    color: "#2E8BFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 22,
  },

  enableBtn: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  disableBtn: {
    width: "100%",
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },

  disableText: {
    fontSize: 16,
    fontWeight: "900",
  },

  note: {
    textAlign: "center",
    marginTop: 18,
    lineHeight: 20,
  },
});