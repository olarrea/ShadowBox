import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme";
import { SBCard } from "../../components/SBCard";

export default function ProfileScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>OL</Text>
            </View>
          </View>
          <Text style={styles.userName}>Oier Larrea</Text>
          <Text style={styles.userLevel}>Nivel 5 • Avanzado</Text>
        </View>

        <SBCard style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.5h</Text>
            <Text style={styles.statLabel}>Tiempo</Text>
          </View>
        </SBCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajustes de cuenta</Text>
          <MenuOption icon="person-outline" label="Editar Perfil" color={theme.colors.blue} />
          <MenuOption icon="notifications-outline" label="Notificaciones" color={theme.colors.blue} />
          <MenuOption icon="log-out-outline" label="Cerrar Sesión" color="#FF4444" isLast />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function MenuOption({ icon, label, color, isLast }: any) {
  return (
    <Pressable style={[styles.option, isLast && { borderBottomWidth: 0 }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.optionLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scrollContent: { padding: 25, paddingTop: 60 },
  header: { alignItems: "center", marginBottom: 30 },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.orange,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#FFF", fontSize: 30, fontWeight: "bold" },
  userName: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  userLevel: { color: theme.colors.muted, fontSize: 16, marginTop: 5 },
  statsCard: { flexDirection: "row", paddingVertical: 20, marginBottom: 30 },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  statLabel: { color: theme.colors.muted, fontSize: 12 },
  divider: { width: 1, height: "100%", backgroundColor: "rgba(255,255,255,0.1)" },
  section: { gap: 10 },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  optionLabel: { flex: 1, color: "#FFF", fontSize: 16, marginLeft: 15 },
});