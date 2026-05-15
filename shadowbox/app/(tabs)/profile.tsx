import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../themeContext";
import { useTranslation } from "../../utils/useTranslation";

type UserData = {
  email?: string;
  name?: string;
  photo?: string | null;
  sessions?: number;
  totalTime?: number;
  level?: number;
};

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.68)" : "rgba(7,17,31,0.65)",
    card: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.92)",
    avatarBg: isDark ? "rgba(255,255,255,0.15)" : "rgba(7,17,31,0.08)",
    border: isDark ? "rgba(255,255,255,0.14)" : "rgba(46,139,255,0.22)",
    avatarBorder: isDark ? "#FFFFFF" : "#2E8BFF",
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const user = auth.currentUser;

          if (!user) return;

          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data() as UserData);
          } else {
            setUserData({
              email: user.email || t("user"),
              name: user.email || t("user"),
              photo: null,
              sessions: 0,
              totalTime: 0,
              level: 1,
            });
          }
        } catch (error) {
          console.log("Error al cargar perfil:", error);
        }
      };

      fetchUserData();
    }, [t])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={[styles.container, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.38 : 0.15 }}
    >
      <View style={styles.header}>
        {userData?.photo ? (
          <Image
            source={{ uri: userData.photo }}
            style={[styles.avatar, { borderColor: colors.avatarBorder }]}
          />
        ) : (
          <View
            style={[
              styles.defaultAvatar,
              {
                backgroundColor: colors.avatarBg,
                borderColor: colors.avatarBorder,
              },
            ]}
          >
            <Ionicons
              name="person"
              size={48}
              color={isDark ? "white" : "#07111F"}
            />
          </View>
        )}

        <Text style={[styles.name, { color: colors.text }]}>
          {userData?.name || userData?.email || t("user")}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="flame-outline" size={24} color="#ff9f43" />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {userData?.sessions ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            {t("sessions")}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="time-outline" size={24} color="#4da6ff" />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {userData?.totalTime ?? 0} {t("minutes")}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            {t("time")}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="trophy-outline" size={24} color="#4da6ff" />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {userData?.level ?? 1}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            {t("level")}
          </Text>
        </View>
      </View>

      <View style={styles.options}>
        <Pressable
          style={[
            styles.option,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push({ pathname: "/edit-profile" } as any)}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={isDark ? "white" : "#07111F"}
          />
          <Text style={[styles.optionText, { color: colors.text }]}>
            {t("editProfile")}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push({ pathname: "/settings" } as any)}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={isDark ? "white" : "#07111F"}
          />
          <Text style={[styles.optionText, { color: colors.text }]}>
            {t("settings")}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
          <Text style={[styles.optionText, { color: "#ff4d4d" }]}>
            {t("logout")}
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 2,
  },

  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1.2,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  statLabel: {
    fontSize: 12,
  },

  options: {
    marginTop: 20,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.2,
  },

  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});