import React, { useState } from "react";
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

type CommunityPlan = {
  id: string;
  title: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  rating: number; 
  isFav: boolean;
  author: string; 
};

const MOCK_PLANS: CommunityPlan[] = [
  { id: "1", title: "Plan de Entrenamiento Intensivo", level: "Intermedio", rating: 4.5, isFav: true, author: "Luis" },
  { id: "2", title: "Plan de Entrenamiento Intensivo", level: "Intermedio", rating: 4.0, isFav: true, author: "Marco" },
  { id: "3", title: "Plan de Entrenamiento Intensivo", level: "Intermedio", rating: 4.5, isFav: true, author: "Jon" },
  { id: "4", title: "Plan de Entrenamiento Intensivo", level: "Intermedio", rating: 4.0, isFav: true, author: "Iker" },
];

export default function CommunityScreen() {
  const [plans, setPlans] = useState(MOCK_PLANS);

  function toggleFav(id: string) {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFav: !p.isFav } : p))
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Comunidad</Text>

          <View style={styles.headerIcon}>
            <Ionicons name="people" size={18} color="#FF7A00" />
          </View>
        </View>

        {/* Cards */}
        {plans.map((p) => (
          <View key={p.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatarRing}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {p.author.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{p.title}</Text>

                <View style={styles.badgeRow}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{p.level}</Text>
                  </View>

                  <Stars value={p.rating} />
                </View>
              </View>

              {/* Fav */}
              <Pressable onPress={() => toggleFav(p.id)} style={styles.favCol}>
                <Ionicons
                  name={p.isFav ? "heart" : "heart-outline"}
                  size={18}
                  color="#2E8BFF"
                />
                <Text style={styles.favText}>Favorito</Text>
              </Pressable>
            </View>

            {/* Button */}
            <Pressable
              style={styles.btn}
              onPress={() => router.push({ pathname: "/plan" } as any)}
            >
              <Text style={styles.btnText}>VER PLANES</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("star");
    else if (i === full && half) stars.push("star-half");
    else stars.push("star-outline");
  }

  return (
    <View style={styles.starsRow}>
      {stars.map((s, idx) => (
        <Ionicons key={idx} name={s as any} size={16} color="#FF7A00" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
  container: { padding: 16, paddingBottom: 28 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 4,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0.5,
    fontStyle: "italic",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.65)",
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.50)",
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.45)",
    padding: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  avatarWrap: { width: 58, alignItems: "center" },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 18 },

  cardTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  badgeRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 10 },

  levelBadge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(46,139,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },

  starsRow: { flexDirection: "row", alignItems: "center", gap: 2 },

  favCol: { width: 70, alignItems: "center", justifyContent: "center", gap: 6 },
  favText: { color: "rgba(255,255,255,0.75)", fontWeight: "700", fontSize: 12 },

  btn: {
    marginTop: 14,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#1E4E8C",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#FF7A00", fontWeight: "900", letterSpacing: 1, fontSize: 16 },
});
