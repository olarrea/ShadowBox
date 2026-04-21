import React, { useState, useEffect } from "react";
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";

// GOOGLE
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // 🔥 CONFIG GOOGLE
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "727871873170-cvjfqodka6k0h5e6iepndqeit9fp7b78.apps.googleusercontent.com",
  });

  // 🔥 RESPUESTA GOOGLE
  useEffect(() => {
    if (response?.type === "success") {
      const id_token = (response.authentication as any).idToken;

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          router.replace("/(tabs)");
        })
        .catch(() => {
          setError("Error al iniciar con Google");
        });
    }
  }, [response]);

  async function onLogin() {
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

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError("Correo o contraseña incorrectos.");
    }
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
          <Text style={styles.logoShadow}>Shadow</Text>
          <Text style={styles.logoBox}>Box</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapOrange}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#FF7A00"
              style={styles.leftIcon}
            />
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
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#FF7A00"
              style={styles.leftIcon}
            />
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

          <Pressable style={styles.btn} onPress={onLogin}>
            <Text style={styles.btnText}>Iniciar sesión</Text>
          </Pressable>

          {/* 🔥 BOTÓN GOOGLE */}
          <Pressable style={styles.googleBtn} onPress={() => promptAsync()}>
            <Text style={styles.googleText}>Continuar con Google</Text>
          </Pressable>

          <Link href={{ pathname: "/register" } as any} asChild>
            <Pressable>
              <Text style={styles.link}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.linkStrong}>Regístrate</Text>
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
  },
  logoBox: {
    color: "#2E8BFF",
    fontSize: 44,
    fontWeight: "800",
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
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  // 🔥 GOOGLE BUTTON
  googleBtn: {
    marginTop: 10,
    height: 54,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  googleText: {
    color: "#FFFFFF",
    fontWeight: "700",
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
  },
});