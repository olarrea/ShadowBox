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

export default function SettingsScreen() {
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
            Configuración
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark
                ? "rgba(0,0,0,0.72)"
                : "rgba(255,255,255,0.92)",
              borderColor: isDark
                ? "rgba(255,122,0,0.45)"
                : "rgba(46,139,255,0.35)",
            },
          ]}
        >
          <View style={styles.settingHeader}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={30}
              color={isDark ? "#FF7A00" : "#2E8BFF"}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: isDark ? "white" : "#07111F" },
                ]}
              >
                Apariencia
              </Text>

              <Text
                style={[
                  styles.settingText,
                  {
                    color: isDark
                      ? "rgba(255,255,255,0.68)"
                      : "rgba(7,17,31,0.65)",
                  },
                ]}
              >
                Cambia entre modo oscuro y claro.
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.themeOption,
              theme === "dark" && styles.themeOptionActiveOrange,
            ]}
            onPress={() => setTheme("dark")}
          >
            <Ionicons name="moon-outline" size={22} color="white" />

            <Text style={styles.themeOptionText}>Modo oscuro</Text>

            {theme === "dark" && (
              <Ionicons name="checkmark-circle" size={22} color="white" />
            )}
          </Pressable>

          <Pressable
            style={[
              styles.themeOption,
              styles.themeOptionBlue,
              theme === "light" && styles.themeOptionActiveBlue,
            ]}
            onPress={() => setTheme("light")}
          >
            <Ionicons name="sunny-outline" size={22} color="white" />

            <Text style={styles.themeOptionText}>Modo claro</Text>

            {theme === "light" && (
              <Ionicons name="checkmark-circle" size={22} color="white" />
            )}
          </Pressable>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark
                ? "rgba(0,0,0,0.62)"
                : "rgba(255,255,255,0.88)",
              borderColor: isDark
                ? "rgba(255,122,0,0.28)"
                : "rgba(255,122,0,0.28)",
            },
          ]}
        >
          <Pressable
            style={styles.settingHeader}
            onPress={() =>
              router.push({ pathname: "/notifications-settings" } as any)
            }
          >
            <Ionicons
              name="notifications-outline"
              size={30}
              color="#FF7A00"
            />

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: isDark ? "white" : "#07111F" },
                ]}
              >
                Notificaciones
              </Text>

              <Text
                style={[
                  styles.settingText,
                  {
                    color: isDark
                      ? "rgba(255,255,255,0.68)"
                      : "rgba(7,17,31,0.65)",
                  },
                ]}
              >
                Activa recordatorios diarios para entrenar.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={isDark ? "white" : "#07111F"}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark
                ? "rgba(0,0,0,0.62)"
                : "rgba(255,255,255,0.88)",
              borderColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(7,17,31,0.12)",
            },
          ]}
        >
          <View style={styles.settingHeader}>
            <Ionicons name="language-outline" size={30} color="#2E8BFF" />

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: isDark ? "white" : "#07111F" },
                ]}
              >
                Idioma
              </Text>

              <Text
                style={[
                  styles.settingText,
                  {
                    color: isDark
                      ? "rgba(255,255,255,0.68)"
                      : "rgba(7,17,31,0.65)",
                  },
                ]}
              >
                Español · Próximamente configurable.
              </Text>
            </View>
          </View>
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
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    marginBottom: 18,
  },

  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  settingTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 4,
  },

  settingText: {
    fontSize: 14,
    lineHeight: 20,
  },

  themeOption: {
    height: 54,
    borderRadius: 17,
    backgroundColor: "rgba(255,122,0,0.45)",
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 18,
  },

  themeOptionBlue: {
    backgroundColor: "rgba(46,139,255,0.7)",
    borderColor: "rgba(46,139,255,0.8)",
  },

  themeOptionActiveOrange: {
    backgroundColor: "#FF7A00",
  },

  themeOptionActiveBlue: {
    backgroundColor: "#2E8BFF",
  },

  themeOptionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    flex: 1,
    marginLeft: 10,
  },
});