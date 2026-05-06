import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function CreateWorkoutScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"basico" | "intermedio" | "experto">("basico");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveWorkout() {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión.");
        return;
      }

      if (!title.trim() || !description.trim() || !duration.trim()) {
        Alert.alert("Error", "Completa todos los campos.");
        return;
      }

      const minutes = Number(duration);

      if (Number.isNaN(minutes) || minutes <= 0) {
        Alert.alert("Error", "La duración debe ser un número válido.");
        return;
      }

      setSaving(true);

      await addDoc(collection(db, "workouts"), {
        title: title.trim(),
        description: description.trim(),
        level,
        estimatedMinutes: minutes,
        createdBy: user.uid,
        rounds: [
          {
            title: "Ronda principal",
            description: description.trim(),
            duration: minutes * 60,
            image: "custom",
          },
        ],
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Entrenamiento creado", "Tu rutina se ha guardado correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("ERROR CREANDO ENTRENAMIENTO:", error);
      Alert.alert("Error", "No se pudo crear el entrenamiento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>

          <Text style={styles.title}>Crear entreno</Text>

          <View style={{ width: 26 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre del entrenamiento</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Rutina de velocidad"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Explica el objetivo del entrenamiento"
            placeholderTextColor="rgba(255,255,255,0.45)"
            multiline
            style={[styles.input, styles.textArea]}
          />

          <Text style={styles.label}>Dificultad</Text>
          <View style={styles.levelRow}>
            {(["basico", "intermedio", "experto"] as const).map((item) => (
              <Pressable
                key={item}
                style={[styles.levelBtn, level === item && styles.levelBtnActive]}
                onPress={() => setLevel(item)}
              >
                <Text
                  style={[
                    styles.levelText,
                    level === item && styles.levelTextActive,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Duración estimada en minutos</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="Ej: 20"
            placeholderTextColor="rgba(255,255,255,0.45)"
            keyboardType="numeric"
            style={styles.input}
          />

          <Pressable
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={saveWorkout}
            disabled={saving}
          >
            <Ionicons name="save-outline" size={20} color="white" />
            <Text style={styles.saveBtnText}>
              {saving ? "Guardando..." : "Guardar entrenamiento"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          De momento se crea una ronda principal automática. Más adelante
          añadiremos edición avanzada de rondas.
        </Text>
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
    paddingTop: 54,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.68)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,122,0,0.4)",
  },
  label: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.62)",
    borderWidth: 1.5,
    borderColor: "rgba(46,139,255,0.45)",
    color: "white",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  levelRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  levelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  levelBtnActive: {
    backgroundColor: "rgba(255,122,0,0.3)",
    borderColor: "#FF7A00",
  },
  levelText: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    fontSize: 12,
  },
  levelTextActive: {
    color: "white",
  },
  saveBtn: {
    marginTop: 24,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  saveBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },
  note: {
    color: "rgba(255,255,255,0.68)",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 20,
  },
});