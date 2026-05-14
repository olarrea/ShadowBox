import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../themeContext";

type UserData = {
  email?: string;
  name?: string;
  photo?: string | null;
};

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? "#070A0F" : "#F3F6FB",
    text: isDark ? "#FFFFFF" : "#07111F",
    muted: isDark ? "rgba(255,255,255,0.75)" : "rgba(7,17,31,0.65)",
    note: isDark ? "rgba(255,255,255,0.6)" : "rgba(7,17,31,0.55)",
    inputBg: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.92)",
    inputDisabled: isDark ? "rgba(255,255,255,0.08)" : "rgba(7,17,31,0.06)",
    inputBorder: isDark ? "rgba(77,163,255,0.7)" : "rgba(46,139,255,0.35)",
    softBorder: isDark ? "rgba(255,255,255,0.18)" : "rgba(7,17,31,0.12)",
    avatarBg: isDark ? "rgba(255,255,255,0.15)" : "rgba(7,17,31,0.08)",
    avatarBorder: isDark ? "#FFFFFF" : "#2E8BFF",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          setName(data.name || user.email || "");
          setEmail(data.email || user.email || "");
          setPhoto(data.photo || null);
        } else {
          setName(user.email || "");
          setEmail(user.email || "");
          setPhoto(null);
        }
      } catch (error) {
        console.log("Error al cargar datos del perfil:", error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permiso necesario", "Debes permitir acceso a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No hay usuario autenticado.");
        return;
      }

      if (!name.trim()) {
        Alert.alert("Error", "El nombre no puede estar vacío.");
        return;
      }

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        name: name.trim(),
        photo: photo || "",
      });

      Alert.alert("Perfil actualizado", "Los cambios se han guardado correctamente.");
      router.back();
    } catch (error) {
      console.log("Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={[styles.container, { backgroundColor: colors.bg }]}
      resizeMode="cover"
      imageStyle={{ opacity: isDark ? 0.38 : 0.15 }}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={26}
              color={isDark ? "white" : "#07111F"}
            />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            Editar perfil
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <View style={styles.content}>
          <Pressable style={styles.avatarWrap} onPress={pickImage}>
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={[
                  styles.avatar,
                  { borderColor: colors.avatarBorder },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.defaultAvatar,
                  {
                    backgroundColor: colors.avatarBg,
                    borderColor: colors.avatarBorder,
                  },
                ]}
              >
                <Ionicons
                  name="person"
                  size={52}
                  color={isDark ? "white" : "#07111F"}
                />
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </Pressable>

          <Text style={[styles.helper, { color: colors.muted }]}>
            Pulsa la imagen para cambiar la foto
          </Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.text }]}>
              Nombre usuario
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Introduce tu nombre"
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
              Correo electrónico
            </Text>

            <View
              style={[
                styles.disabledInput,
                {
                  backgroundColor: colors.inputDisabled,
                  borderColor: colors.softBorder,
                },
              ]}
            >
              <Text style={[styles.disabledText, { color: colors.muted }]}>
                {email}
              </Text>
            </View>

            <Text style={[styles.note, { color: colors.note }]}>
              El correo no se puede modificar.
            </Text>

            <Pressable
              style={[styles.saveButton, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  topBar: {
    marginTop: 55,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  avatarWrap: {
    alignSelf: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },

  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  helper: {
    textAlign: "center",
    marginBottom: 30,
  },

  form: {
    gap: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },

  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  disabledInput: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  disabledText: {
    fontSize: 15,
  },

  note: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 12,
  },

  saveButton: {
    marginTop: 14,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF7A00",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});