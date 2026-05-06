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

type WorkoutRound = {
  title: string;
  description: string;
  duration: string;
  image: string;
};

export default function CreateWorkoutScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"basico" | "intermedio" | "experto">("basico");
  const [saving, setSaving] = useState(false);

  const [rounds, setRounds] = useState<WorkoutRound[]>([
    {
      title: "",
      description: "",
      duration: "",
      image: "custom",
    },
  ]);

  function updateRound(index: number, field: keyof WorkoutRound, value: string) {
    const updatedRounds = [...rounds];
    updatedRounds[index] = {
      ...updatedRounds[index],
      [field]: value,
    };
    setRounds(updatedRounds);
  }

  function addRound() {
    setRounds([
      ...rounds,
      {
        title: "",
        description: "",
        duration: "",
        image: "custom",
      },
    ]);
  }

  function removeRound(index: number) {
    if (rounds.length === 1) {
      Alert.alert("Aviso", "El entrenamiento debe tener al menos una ronda.");
      return;
    }

    setRounds(rounds.filter((_, i) => i !== index));
  }

  function calculateEstimatedMinutes() {
    const totalSeconds = rounds.reduce((total, round) => {
      const seconds = Number(round.duration);
      return total + (Number.isNaN(seconds) ? 0 : seconds);
    }, 0);

    return Math.max(1, Math.ceil(totalSeconds / 60));
  }

  async function saveWorkout() {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión.");
        return;
      }

      if (!title.trim() || !description.trim()) {
        Alert.alert("Error", "Completa el nombre y la descripción.");
        return;
      }

      for (const round of rounds) {
        if (!round.title.trim() || !round.description.trim() || !round.duration.trim()) {
          Alert.alert("Error", "Completa todos los campos de cada ronda.");
          return;
        }

        const durationNumber = Number(round.duration);

        if (Number.isNaN(durationNumber) || durationNumber <= 0) {
          Alert.alert("Error", "La duración de cada ronda debe ser un número válido.");
          return;
        }
      }

      setSaving(true);

      const parsedRounds = rounds.map((round) => ({
        title: round.title.trim(),
        description: round.description.trim(),
        duration: Number(round.duration),
        image: round.image.trim() || "custom",
      }));

      await addDoc(collection(db, "workouts"), {
        title: title.trim(),
        description: description.trim(),
        level,
        estimatedMinutes: calculateEstimatedMinutes(),
        createdBy: user.uid,
        rounds: parsedRounds,
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
          <Text style={styles.sectionTitle}>Datos generales</Text>

          <Text style={styles.label}>Nombre del entrenamiento</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Rutina de velocidad"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
          />

          <Text style={styles.label}>Descripción general</Text>
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
        </View>

        <View style={styles.card}>
          <View style={styles.roundsHeader}>
            <Text style={styles.sectionTitle}>Rondas</Text>
            <Text style={styles.estimatedText}>
              {calculateEstimatedMinutes()} min aprox.
            </Text>
          </View>

          {rounds.map((round, index) => (
            <View key={index} style={styles.roundCard}>
              <View style={styles.roundTop}>
                <Text style={styles.roundTitle}>Ronda {index + 1}</Text>

                <Pressable onPress={() => removeRound(index)}>
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </Pressable>
              </View>

              <Text style={styles.label}>Nombre de la ronda</Text>
              <TextInput
                value={round.title}
                onChangeText={(value) => updateRound(index, "title", value)}
                placeholder="Ej: Jab + Cross"
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.input}
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                value={round.description}
                onChangeText={(value) => updateRound(index, "description", value)}
                placeholder="Explica cómo hacer el ejercicio"
                placeholderTextColor="rgba(255,255,255,0.45)"
                multiline
                style={[styles.input, styles.roundTextArea]}
              />

              <Text style={styles.label}>Duración en segundos</Text>
              <TextInput
                value={round.duration}
                onChangeText={(value) => updateRound(index, "duration", value)}
                placeholder="Ej: 180"
                placeholderTextColor="rgba(255,255,255,0.45)"
                keyboardType="numeric"
                style={styles.input}
              />

              <Text style={styles.label}>Imagen / referencia visual</Text>
              <TextInput
                value={round.image}
                onChangeText={(value) => updateRound(index, "image", value)}
                placeholder="Ej: shadowboxing"
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.input}
              />
            </View>
          ))}

          <Pressable style={styles.addRoundBtn} onPress={addRound}>
            <Ionicons name="add-circle-outline" size={20} color="#2E8BFF" />
            <Text style={styles.addRoundText}>Añadir ronda</Text>
          </Pressable>
        </View>

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
    paddingBottom: 34,
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
    marginBottom: 18,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
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
  roundTextArea: {
    minHeight: 92,
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
  roundsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  estimatedText: {
    color: "#2E8BFF",
    fontWeight: "800",
  },
  roundCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  roundTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roundTitle: {
    color: "#FF7A00",
    fontSize: 17,
    fontWeight: "900",
  },
  addRoundBtn: {
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(46,139,255,0.5)",
    backgroundColor: "rgba(46,139,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addRoundText: {
    color: "#2E8BFF",
    fontSize: 16,
    fontWeight: "800",
  },
  saveBtn: {
    height: 58,
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
});