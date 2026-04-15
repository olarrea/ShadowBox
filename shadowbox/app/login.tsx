import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "../theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function onLogin() {
    setError("");
    if (!email.trim() || !pass.trim()) {
      setError("Introduce correo y contraseña.");
      return;
    }
    router.replace("/(tabs)");
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.4 }}   
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoShadow}>SHADOW</Text>
            <Text style={styles.logoBox}>BOX</Text>
          </View>

          <Text style={styles.subtitle}>ENTRENA COMO UN CAMPEÓN</Text>

          <View style={styles.form}>
            <View style={[styles.inputWrap, styles.glowBlue]}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.blue} style={styles.leftIcon} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrap, styles.glowOrange]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.orange} style={styles.leftIcon} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                value={pass}
                onChangeText={setPass}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable style={styles.loginBtn} onPress={onLogin}>
              <Text style={styles.loginBtnText}>INICIAR SESIÓN</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/register")} style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta? <Text style={styles.linkText}>Regístrate</Text></Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg },
  container: { flex: 1, justifyContent: "center", padding: 25 },
  content: { width: "100%" },
  logoWrap: { flexDirection: "row", justifyContent: "center", marginBottom: 5 },
  logoShadow: { color: "#FFF", fontSize: 48, fontWeight: "900", letterSpacing: -1 },
  logoBox: { color: theme.colors.blue, fontSize: 48, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: "#FFF", textAlign: "center", fontSize: 12, letterSpacing: 4, marginBottom: 40, opacity: 0.7 },
  
  form: { gap: 20 },
  inputWrap: {
    height: 60,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1.5,
  },
  glowBlue: {
    borderColor: theme.colors.blue,
    shadowColor: theme.colors.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  glowOrange: {
    borderColor: theme.colors.orange,
    shadowColor: theme.colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  leftIcon: { marginRight: 12 },
  input: { flex: 1, color: "#FFF", fontSize: 16 },
  
  loginBtn: {
    height: 60,
    borderRadius: 15,
    backgroundColor: theme.colors.orange,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: theme.colors.orange,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  loginBtnText: { color: "#FFF", fontSize: 18, fontWeight: "bold", letterSpacing: 1 },
  errorText: { color: "#FF4444", textAlign: "center", fontWeight: "600" },
  footer: { marginTop: 20, alignItems: "center" },
  footerText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  linkText: { color: theme.colors.blue, fontWeight: "bold" },
});