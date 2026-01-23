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
import { Link, router } from "expo-router";


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
    if (!email.includes("@")) {
      setError("El correo no es válido.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.logoWrap}>
          <Text style={styles.logoShadow}>Shado</Text>
          <Text style={styles.logoBox}>wBox</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputWrapOrange}>
            <Ionicons name="mail-outline" size={18} color="#FF7A00" style={styles.leftIcon} />
            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapOrange}>
            <Ionicons name="lock-closed-outline" size={18} color="#FF7A00" style={styles.leftIcon} />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={pass}
              onChangeText={setPass}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          {/* Button */}
          <Pressable style={styles.btn} onPress={onLogin}>
            <Text style={styles.btnText}>Iniciar sesión</Text>
          </Pressable>

          {/* Link register */}
          <Link href={{ pathname: "/register" } as any} asChild>
            <Pressable>
                <Text style={styles.link}>
                ¿No tienes cuenta? <Text style={styles.linkStrong}>Regístrate</Text>
                </Text>
            </Pressable>
            </Link>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
  },

  logoWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 26,
  },
  logoShadow: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  logoBox: {
    color: "#2E8BFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  form: {
    gap: 14,
  },

  inputWrapOrange: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,

    shadowColor: "#FF7A00",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  leftIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },

  btn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,

    shadowColor: "#FF7A00",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  link: {
    textAlign: "center",
    color: "rgba(46,139,255,0.85)",
    marginTop: 10,
    fontSize: 14,
  },
  linkStrong: {
    fontWeight: "800",
    color: "#2E8BFF",
  },

  error: {
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 2,
    fontWeight: "600",
  },
});
