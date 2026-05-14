import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useTheme } from "../../themeContext";

type UserData = {
  name?: string;
  email?: string;
  level?: number;
  photo?: string | null;
};

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.78)" : "rgba(7,17,31,0.72)",
    card: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.92)",
    cardSoft: isDark ? "rgba(0,0,0,0.62)" : "rgba(255,255,255,0.88)",
    orangeBorder: isDark ? "rgba(255,122,0,0.55)" : "rgba(255,122,0,0.42)",
    blueBorder: isDark ? "rgba(46,139,255,0.4)" : "rgba(46,139,255,0.35)",
    avatarBg: isDark ? "rgba(255,255,255,0.12)" : "rgba(7,17,31,0.08)",
    avatarBorder: isDark ? "#FFFFFF" : "#2E8BFF",
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  async function loadUserData() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
      }
    } catch (error) {
      console.log("ERROR CARGANDO HOME:", error);
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.65 : 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.orangeBorder,
            },
          ]}
        >
          {userData?.photo ? (
            <Image
              source={{ uri: userData.photo }}
              style={[
                styles.avatarImage,
                {
                  borderColor: colors.avatarBorder,
                  backgroundColor: colors.avatarBg,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.avatarBg,
                  borderColor: colors.avatarBorder,
                },
              ]}
            >
              <Ionicons
                name="person"
                size={34}
                color={isDark ? "#FFFFFF" : "#07111F"}
              />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {userData?.name || userData?.email || "Usuario"}
            </Text>
            <Text style={styles.level}>Nivel {userData?.level || 1}</Text>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.blueBorder,
            },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            ¿Qué es ShadowBox?
          </Text>

          <Text style={[styles.infoText, { color: colors.muted }]}>
            ShadowBox es una aplicación móvil diseñada para entrenar boxeo en casa
            de forma estructurada, accesible y motivadora.
          </Text>

          <Text style={[styles.infoText, { color: colors.muted }]}>
            Puedes seguir entrenamientos, crear tus propias rutinas, guardar tus
            favoritos, descargar sesiones y consultar tu progreso personal.
          </Text>

          <Text style={[styles.infoText, { color: colors.muted }]}>
            Su objetivo es ayudarte a mejorar técnica, resistencia y constancia
            mediante planes claros y entrenamientos adaptados a tu nivel.
          </Text>
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => router.push({ pathname: "/create-workout" } as any)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Crear entrenamiento</Text>
        </Pressable>

        <Pressable
          style={[
            styles.generateButton,
            {
              backgroundColor: isDark
                ? "rgba(255,122,0,0.32)"
                : "rgba(255,122,0,0.85)",
              borderColor: isDark
                ? "rgba(255,122,0,0.65)"
                : "rgba(255,122,0,0.9)",
            },
          ]}
          onPress={() => router.push({ pathname: "/generate" } as any)}
        >
          <Ionicons name="navigate-outline" size={22} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Generar plan</Text>
        </Pressable>

        <Pressable
          style={styles.progressButton}
          onPress={() => router.push({ pathname: "/progress" } as any)}
        >
          <Ionicons name="bar-chart-outline" size={22} color="#FFFFFF" />
          <Text style={styles.progressButtonText}>Ver progreso</Text>
        </Pressable>

        <View
          style={[
            styles.motivationCard,
            {
              backgroundColor: colors.cardSoft,
              borderColor: isDark
                ? "rgba(255,122,0,0.35)"
                : "rgba(255,122,0,0.45)",
            },
          ]}
        >
          <Ionicons name="flash-outline" size={22} color="#FF7A00" />
          <Text style={[styles.motivationText, { color: colors.text }]}>
            “El campeón se construye ronda a ronda.”
          </Text>
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
    paddingTop: 58,
    paddingBottom: 36,
  },

  profileCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginRight: 16,
  },

  avatarImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    marginRight: 16,
  },

  name: {
    fontSize: 24,
    fontWeight: "900",
  },

  level: {
    color: "#FF7A00",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  infoCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    marginBottom: 20,
  },

  infoTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },

  infoText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  createButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  generateButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  progressButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(46,139,255,0.85)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 18,
  },

  progressButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  motivationCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
  },

  motivationText: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
});