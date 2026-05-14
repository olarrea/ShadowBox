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
              email: user.email || "Usuario",
              name: user.email || "Usuario",
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
    }, [])
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
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 0.38 }}
    >
      <View style={styles.header}>
        {userData?.photo ? (
          <Image source={{ uri: userData.photo }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons name="person" size={48} color="white" />
          </View>
        )}

        <Text style={styles.name}>
          {userData?.name || userData?.email || "Usuario"}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flame-outline" size={24} color="#ff9f43" />
          <Text style={styles.statNumber}>{userData?.sessions ?? 0}</Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#4da6ff" />
          <Text style={styles.statNumber}>{userData?.totalTime ?? 0} min</Text>
          <Text style={styles.statLabel}>Tiempo</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color="#4da6ff" />
          <Text style={styles.statNumber}>{userData?.level ?? 1}</Text>
          <Text style={styles.statLabel}>Nivel</Text>
        </View>
      </View>

      <View style={styles.options}>
        <Pressable
          style={styles.option}
          onPress={() => router.push({ pathname: "/edit-profile" } as any)}
        >
          <Ionicons name="person-outline" size={20} color="white" />
          <Text style={styles.optionText}>Editar perfil</Text>
        </Pressable>

        <Pressable
          style={styles.option}
          onPress={() => router.push({ pathname: "/settings" } as any)}
        >
          <Ionicons name="settings-outline" size={20} color="white" />
          <Text style={styles.optionText}>Configuración</Text>
        </Pressable>

        <Pressable style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
          <Text style={[styles.optionText, { color: "#ff4d4d" }]}>
            Cerrar sesión
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
    backgroundColor: "#070A0F",
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
  },

  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  name: {
    color: "white",
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
    backgroundColor: "rgba(0,0,0,0.6)",
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  statNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  statLabel: {
    color: "#aaa",
    fontSize: 12,
  },

  options: {
    marginTop: 20,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  optionText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});