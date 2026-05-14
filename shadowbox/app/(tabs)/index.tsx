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

type UserData = {
  name?: string;
  email?: string;
  level?: number;
  photo?: string | null;
};

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);

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
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          {userData?.photo ? (
            <Image source={{ uri: userData.photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person" size={34} color="#FFFFFF" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {userData?.name || userData?.email || "Usuario"}
            </Text>
            <Text style={styles.level}>Nivel {userData?.level || 1}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Qué es ShadowBox?</Text>

          <Text style={styles.infoText}>
            ShadowBox es una aplicación móvil diseñada para entrenar boxeo en casa
            de forma estructurada, accesible y motivadora.
          </Text>

          <Text style={styles.infoText}>
            Puedes seguir entrenamientos, crear tus propias rutinas, guardar tus
            favoritos, descargar sesiones y consultar tu progreso personal.
          </Text>

          <Text style={styles.infoText}>
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
          style={styles.generateButton}
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

        <View style={styles.motivationCard}>
          <Ionicons name="flash-outline" size={22} color="#FF7A00" />
          <Text style={styles.motivationText}>
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
    backgroundColor: "#070A0F",
  },

  container: {
    padding: 20,
    paddingTop: 58,
    paddingBottom: 36,
  },

  profileCard: {
    backgroundColor: "rgba(0,0,0,0.72)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.55)",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 16,
  },

  avatarImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  name: {
    color: "#FFFFFF",
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
    backgroundColor: "rgba(0,0,0,0.68)",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: "rgba(46,139,255,0.4)",
    marginBottom: 20,
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },

  infoText: {
    color: "rgba(255,255,255,0.78)",
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
    backgroundColor: "rgba(255,122,0,0.32)",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.65)",
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
    backgroundColor: "rgba(0,0,0,0.62)",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.35)",
  },

  motivationText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
});