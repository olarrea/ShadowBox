import { View, Text, StyleSheet, ImageBackground, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Oier</Text>
        <Text style={styles.level}>Nivel Intermedio</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flame-outline" size={24} color="#ff9f43" />
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#4da6ff" />
          <Text style={styles.statNumber}>12h</Text>
          <Text style={styles.statLabel}>Tiempo</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color="#4da6ff" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Nivel</Text>
        </View>
      </View>

      <View style={styles.options}>
        <Pressable style={styles.option}>
          <Ionicons name="person-outline" size={20} color="white" />
          <Text style={styles.optionText}>Editar perfil</Text>
        </Pressable>

        <Pressable style={styles.option}>
          <Ionicons name="settings-outline" size={20} color="white" />
          <Text style={styles.optionText}>Configuración</Text>
        </Pressable>

        <Pressable style={styles.option}>
          <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
          <Text style={[styles.optionText, { color: "#ff4d4d" }]}>
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  level: {
    color: "#aaa",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  statNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  statLabel: {
    color: "#aaa",
    fontSize: 12,
  },

  options: {
    marginTop: 20,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  optionText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});