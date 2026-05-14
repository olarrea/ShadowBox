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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../themeContext";

type WorkoutRound = {
  title: string;
  description: string;
  duration: string;
  image: string;
};

export default function CreateWorkoutScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"basico" | "intermedio" | "experto">(
    "basico"
  );
  const [saving, setSaving] = useState(false);

  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.72)" : "rgba(7,17,31,0.68)",
    card: isDark ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.94)",
    roundCard: isDark ? "rgba(255,255,255,0.05)" : "rgba(7,17,31,0.04)",
    inputBg: isDark ? "rgba(0,0,0,0.62)" : "rgba(255,255,255,0.92)",
    inputBorder: isDark ? "rgba(46,139,255,0.45)" : "rgba(46,139,255,0.35)",
    orangeBorder: isDark
      ? "rgba(255,122,0,0.4)"
      : "rgba(255,122,0,0.35)",
    softBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(7,17,31,0.12)",
    levelBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(7,17,31,0.06)",
    placeholderBg: isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(7,17,31,0.06)",
  };

  const [rounds, setRounds] = useState<WorkoutRound[]>([
    {
      title: "",
      description: "",
      duration: "",
      image: "",
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

  async function pickRoundImage(index: number) {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permiso necesario", "Debes permitir acceso a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        updateRound(index, "image", result.assets[0].uri);
      }
    } catch (error) {
      console.log("ERROR SELECCIONANDO IMAGEN DE RONDA:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  }

  function addRound() {
    setRounds([
      ...rounds,
      {
        title: "",
        description: "",
        duration: "",
        image: "",
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

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;

      const createdByName =
        userData?.name || user.displayName || user.email || "Usuario";

      const createdByPhoto = userData?.photo || null;

      if (!title.trim() || !description.trim()) {
        Alert.alert("Error", "Completa el nombre y la descripción.");
        return;
      }

      for (const round of rounds) {
        if (
          !round.title.trim() ||
          !round.description.trim() ||
          !round.duration.trim()
        ) {
          Alert.alert("Error", "Completa todos los campos de cada ronda.");
          return;
        }

        const durationNumber = Number(round.duration);

        if (Number.isNaN(durationNumber) || durationNumber <= 0) {
          Alert.alert(
            "Error",
            "La duración de cada ronda debe ser un número válido."
          );
          return;
        }
      }

      setSaving(true);

      const parsedRounds = rounds.map((round) => ({
        title: round.title.trim(),
        description: round.description.trim(),
        duration: Number(round.duration),
        image: round.image || "",
      }));

      await addDoc(collection(db, "workouts"), {
        title: title.trim(),
        description: description.trim(),
        level,
        estimatedMinutes: calculateEstimatedMinutes(),
        createdBy: user.uid,
        createdByName,
        createdByPhoto,
        rounds: parsedRounds,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Entrenamiento creado",
        "Tu rutina se ha guardado correctamente.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
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
      style={[styles.bg, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.65 : 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={26}
              color={isDark ? "white" : "#07111F"}
            />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            Crear entreno
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.orangeBorder,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Datos generales
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>
            Nombre del entrenamiento
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Rutina de velocidad"
            placeholderTextColor={
              isDark ? "rgba(255,255,255,0.45)" : "rgba(7,17,31,0.42)"
            }
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Descripción general
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Explica el objetivo del entrenamiento"
            placeholderTextColor={
              isDark ? "rgba(255,255,255,0.45)" : "rgba(7,17,31,0.42)"
            }
            multiline
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Dificultad
          </Text>
          <View style={styles.levelRow}>
            {(["basico", "intermedio", "experto"] as const).map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.levelBtn,
                  {
                    backgroundColor: colors.levelBg,
                    borderColor: colors.softBorder,
                  },
                  level === item && styles.levelBtnActive,
                ]}
                onPress={() => setLevel(item)}
              >
                <Text
                  style={[
                    styles.levelText,
                    {
                      color: isDark
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(7,17,31,0.72)",
                    },
                    level === item && styles.levelTextActive,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.orangeBorder,
            },
          ]}
        >
          <View style={styles.roundsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Rondas
            </Text>
            <Text style={styles.estimatedText}>
              {calculateEstimatedMinutes()} min aprox.
            </Text>
          </View>

          {rounds.map((round, index) => (
            <View
              key={index}
              style={[
                styles.roundCard,
                {
                  backgroundColor: colors.roundCard,
                  borderColor: colors.softBorder,
                },
              ]}
            >
              <View style={styles.roundTop}>
                <Text style={styles.roundTitle}>Ronda {index + 1}</Text>

                <Pressable onPress={() => removeRound(index)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#FF6B6B"
                  />
                </Pressable>
              </View>

              <Text style={[styles.label, { color: colors.text }]}>
                Nombre de la ronda
              </Text>
              <TextInput
                value={round.title}
                onChangeText={(value) =>
                  updateRound(index, "title", value)
                }
                placeholder="Ej: Jab + Cross"
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.45)" : "rgba(7,17,31,0.42)"
                }
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
              />

              <Text style={[styles.label, { color: colors.text }]}>
                Descripción
              </Text>
              <TextInput
                value={round.description}
                onChangeText={(value) =>
                  updateRound(index, "description", value)
                }
                placeholder="Explica cómo hacer el ejercicio"
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.45)" : "rgba(7,17,31,0.42)"
                }
                multiline
                style={[
                  styles.input,
                  styles.roundTextArea,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
              />

              <Text style={[styles.label, { color: colors.text }]}>
                Duración en segundos
              </Text>
              <TextInput
                value={round.duration}
                onChangeText={(value) =>
                  updateRound(index, "duration", value)
                }
                placeholder="Ej: 180"
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.45)" : "rgba(7,17,31,0.42)"
                }
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
              />

              <Text style={[styles.label, { color: colors.text }]}>
                Imagen de referencia
              </Text>

              {round.image ? (
                <Image
                  source={{ uri: round.image }}
                  style={styles.roundImagePreview}
                />
              ) : (
                <View
                  style={[
                    styles.imagePlaceholder,
                    {
                      backgroundColor: colors.placeholderBg,
                      borderColor: colors.softBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color="#FF7A00"
                  />
                  <Text
                    style={[
                      styles.imagePlaceholderText,
                      { color: colors.muted },
                    ]}
                  >
                    Sin imagen seleccionada
                  </Text>
                </View>
              )}

              <Pressable
                style={styles.imageButton}
                onPress={() => pickRoundImage(index)}
              >
                <Ionicons name="image-outline" size={18} color="#FFFFFF" />
                <Text style={styles.imageButtonText}>
                  Seleccionar imagen
                </Text>
              </Pressable>
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
    fontSize: 24,
    fontWeight: "800",
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  label: {
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1.5,
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
    borderWidth: 1,
  },
  levelBtnActive: {
    backgroundColor: "rgba(255,122,0,0.3)",
    borderColor: "#FF7A00",
  },
  levelText: {
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
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
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
  roundImagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontWeight: "700",
  },
  imageButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "#2E8BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },
  imageButtonText: {
    color: "white",
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