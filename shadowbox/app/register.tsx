import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [level, setLevel] = useState<"Principiante" | "Intermedio" | "Avanzado">(
    "Principiante"
  );
  const [openLevel, setOpenLevel] = useState(false);
  const [error, setError] = useState("");

  async function onRegister() {
  setError("");

  if (!email || !pass || !confirm) {
    setError("Completa todos los campos.");
    return;
  }
  if (!email.includes("@")) {
    setError("Correo no válido.");
    return;
  }
  if (pass.length < 6) {
    setError("La contraseña debe tener al menos 6 caracteres.");
    return;
  }
  if (pass !== confirm) {
    setError("Las contraseñas no coinciden.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: email.split("@")[0],
      email: email,
      photo: "",
      sessions: 0,
      totalTime: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    });

    router.replace("/(tabs)");
  } catch (err: any) {
    console.log("ERROR REGISTER:", JSON.stringify(err, null, 2));
    setError(err?.message || "Error al crear la cuenta.");
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
          <Ionicons
            name="hand-left-outline"
            size={28}
            color="#FF7A00"
            style={{ marginLeft: 6, marginTop: 10 }}
          />
        </View>

        <Text style={styles.title}>CREAR CUENTA</Text>

        <View style={styles.form}>
          <View style={styles.inputWrapBlue}>
            <Ionicons name="mail-outline" size={18} color="#4DA3FF" />
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

          <View style={styles.inputWrapBlue}>
            <Ionicons name="lock-closed-outline" size={18} color="#4DA3FF" />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={pass}
              onChangeText={setPass}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapBlue}>
            <Ionicons name="lock-closed-outline" size={18} color="#4DA3FF" />
            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable style={styles.btn} onPress={onRegister}>
            <Text style={styles.btnText}>CREAR CUENTA</Text>
          </Pressable>
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
    alignItems: "center",
    marginBottom: 10,
  },
  logoShadow: { color: "#2E8BFF", fontSize: 34, fontWeight: "800" },
  logoBox: { color: "#4DA3FF", fontSize: 34, fontWeight: "800" },
  title: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 18,
  },
  form: { gap: 14 },
  inputWrapBlue: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 2,
    borderColor: "rgba(77,163,255,0.65)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  input: { flex: 1, marginLeft: 10, color: "#FFFFFF" },
  btn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  error: { color: "#FF6B6B", textAlign: "center" },
});