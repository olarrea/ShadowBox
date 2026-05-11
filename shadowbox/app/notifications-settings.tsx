import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function NotificationsSettingsScreen() {
  const [loading, setLoading] = useState(false);

  async function enableNotifications() {
    try {
      setLoading(true);

      const permission = await Notifications.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso necesario",
          "Debes permitir las notificaciones para activar los recordatorios."
        );
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora de entrenar 🥊",
          body: "Completa una sesión hoy y sigue sumando progreso en ShadowBox.",
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        } as any,
      });

      const user = auth.currentUser;

      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          notificationsEnabled: true,
          notificationHour: 20,
          notificationMinute: 0,
        });
      }

      Alert.alert(
        "Recordatorios activados",
        "Te avisaremos todos los días a las 20:00 para entrenar."
      );
    } catch (error) {
      console.log("ERROR ACTIVANDO NOTIFICACIONES:", error);
      Alert.alert("Error", "No se pudieron activar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }

  async function disableNotifications() {
    try {
      setLoading(true);

      await Notifications.cancelAllScheduledNotificationsAsync();

      const user = auth.currentUser;

      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          notificationsEnabled: false,
        });
      }

      Alert.alert("Recordatorios desactivados", "Ya no recibirás avisos diarios.");
    } catch (error) {
      console.log("ERROR DESACTIVANDO NOTIFICACIONES:", error);
      Alert.alert("Error", "No se pudieron desactivar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>

          <Text style={styles.title}>Notificaciones</Text>

          <View style={{ width: 26 }} />
        </View>

        <View style={styles.card}>
          <Ionicons name="notifications-outline" size={42} color="#FF7A00" />

          <Text style={styles.cardTitle}>Recordatorios inteligentes</Text>

          <Text style={styles.cardText}>
            ShadowBox puede enviarte un aviso diario para ayudarte a mantener la
            constancia y no saltarte tus entrenamientos.
          </Text>

          <Text style={styles.timeText}>Hora configurada: 20:00</Text>

          <Pressable
            style={[styles.enableBtn, loading && styles.disabled]}
            onPress={enableNotifications}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.btnText}>
              {loading ? "Procesando..." : "Activar recordatorio"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.disableBtn, loading && styles.disabled]}
            onPress={disableNotifications}
            disabled={loading}
          >
            <Ionicons name="close-circle-outline" size={20} color="white" />
            <Text style={styles.btnText}>Desactivar recordatorio</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Más adelante podrás elegir la hora exacta desde configuración.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#070A0F",
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
    color: "white",
    fontSize: 24,
    fontWeight: "900",
  },

  card: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.45)",
    alignItems: "center",
  },

  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },

  cardText: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 18,
  },

  timeText: {
    color: "#2E8BFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 22,
  },

  enableBtn: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  disableBtn: {
    width: "100%",
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  disabled: {
    opacity: 0.7,
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },

  note: {
    color: "rgba(255,255,255,0.62)",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 20,
  },
});