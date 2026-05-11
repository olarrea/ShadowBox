import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../themeContext";

export default function ThemeSettingsScreen() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={[styles.bg, { backgroundColor: isDark ? "#070A0F" : "#F3F6FB" }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.65 : 0.18 }}
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

          <Text style={[styles.title, { color: isDark ? "white" : "#07111F" }]}>
            Apariencia
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.9)",
              borderColor: isDark ? "rgba(255,122,0,0.45)" : "rgba(46,139,255,0.35)",
            },
          ]}
        >
          <Ionicons
            name={isDark ? "moon-outline" : "sunny-outline"}
            size={42}
            color={isDark ? "#FF7A00" : "#2E8BFF"}
          />

          <Text style={[styles.cardTitle, { color: isDark ? "white" : "#07111F" }]}>
            Modo de visualización
          </Text>

          <Text
            style={[
              styles.cardText,
              { color: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.72)" },
            ]}
          >
            Cambia entre modo oscuro y modo claro para adaptar ShadowBox a tus
            preferencias y mejorar la comodidad visual.
          </Text>

          <Pressable
            style={[
              styles.option,
              theme === "dark" && styles.optionActive,
            ]}
            onPress={() => setTheme("dark")}
          >
            <Ionicons name="moon-outline" size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Modo oscuro</Text>
            {theme === "dark" && (
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            )}
          </Pressable>

          <Pressable
            style={[
              styles.option,
              styles.lightOption,
              theme === "light" && styles.optionActiveBlue,
            ]}
            onPress={() => setTheme("light")}
          >
            <Ionicons name="sunny-outline" size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Modo claro</Text>
            {theme === "light" && (
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            )}
          </Pressable>
        </View>

        <Text
          style={[
            styles.note,
            { color: isDark ? "rgba(255,255,255,0.62)" : "rgba(7,17,31,0.62)" },
          ]}
        >
          De momento el cambio se aplica en las pantallas preparadas para tema.
          Después podemos extenderlo al resto de la app.
        </Text>
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
    marginBottom: 22,
  },

  option: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 12,
  },

  lightOption: {
    backgroundColor: "#2E8BFF",
  },

  optionActive: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  optionActiveBlue: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    flex: 1,
    marginLeft: 10,
  },

  note: {
    textAlign: "center",
    marginTop: 18,
    lineHeight: 20,
  },
});