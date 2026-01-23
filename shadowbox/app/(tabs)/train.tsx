import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ROUND_SECONDS = 5 * 60; 
const TOTAL_ROUNDS = 5;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export default function TrainScreen() {
  const [round, setRound] = useState(1);
  const [isRest, setIsRest] = useState(true); 
  const [isRunning, setIsRunning] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsRunning(false);
    }
  }, [secondsLeft]);

  const mmss = useMemo(() => formatMMSS(secondsLeft), [secondsLeft]);
  const [mm, ss] = useMemo(() => mmss.split(":"), [mmss]);

  const progress = useMemo(() => {
    return secondsLeft / ROUND_SECONDS;
  }, [secondsLeft]);

  function togglePause() {
    setIsRunning((v) => !v);
  }

  function nextRound() {
    setSecondsLeft(ROUND_SECONDS);
    setIsRunning(true);
    setIsRest((r) => !r); 
    setRound((r) => (r >= TOTAL_ROUNDS ? 1 : r + 1));
  }

  function finish() {
    setIsRunning(false);
    setSecondsLeft(ROUND_SECONDS);
    setRound(1);
    setIsRest(true);
  }

  return (
    <ImageBackground
      source={require("../../assets/images/ring-bg.png")}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.65 }}
    >
      <View style={styles.container}>
        {/* Top bar (iconos) */}
        <View style={styles.topBar}>
          <Ionicons name="menu" size={22} color="rgba(255,255,255,0.8)" />
          <View style={styles.brandRow}>
            <Ionicons name="hand-left" size={22} color="#FF7A00" />
            <Text style={styles.brand}>
              <Text style={{ color: "#2E8BFF", fontWeight: "900" }}>Shado</Text>
              <Text style={{ color: "#FF7A00", fontWeight: "900" }}>wBox</Text>
            </Text>
          </View>
          <View style={{ width: 22 }} />
        </View>

        {/* Círculo con progreso + tiempo */}
        <View style={styles.centerWrap}>
          <ProgressRing progress={progress} />

          <View style={styles.timeOverlay}>
            <Text style={styles.timeText}>
              <Text style={styles.timeWhite}>{mm}</Text>
              <Text style={styles.timeColon}>:</Text>
              <Text style={styles.timeBlue}>{ss}</Text>
            </Text>
          </View>
        </View>

        {/* Ronda / estado */}
        <View style={styles.infoWrap}>
          <Text style={styles.roundText}>
            Ronda {round} de {TOTAL_ROUNDS}
          </Text>

          <View style={styles.restRow}>
            <Ionicons name="walk-outline" size={18} color="rgba(255,255,255,0.85)" />
            <Text style={styles.restText}>{isRest ? "Descanso" : "Trabajo"}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.bigTitle}>
          <Text style={{ color: "#FFFFFF" }}>Shadow</Text>
          <Text style={{ color: "#FF7A00" }}>boxing</Text> 🥊
        </Text>

        {/* Botones */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.bigBtn, styles.blueBtn]} onPress={togglePause}>
            <Ionicons name={isRunning ? "pause" : "play"} size={22} color="#FFFFFF" />
            <Text style={styles.blueBtnText}>
              {isRunning ? "Pausar" : "Continuar"}
              {"\n"}
              <Text style={{ fontWeight: "700" }}>/</Text>{" "}
              <Text style={{ fontWeight: "700" }}>
                {isRunning ? "Continuar" : "Pausar"}
              </Text>
            </Text>
          </Pressable>

          <Pressable style={[styles.midBtn, styles.orangeBtn]} onPress={finish}>
            <View style={styles.stopSquare} />
            <Text style={styles.orangeBtnText}>Finalizar</Text>
          </Pressable>

          <Pressable style={[styles.bigBtn, styles.whiteBtn]} onPress={nextRound}>
            <Ionicons name="repeat" size={22} color="#2E8BFF" />
            <Text style={styles.whiteBtnText}>Cambiar{"\n"}ronda</Text>
          </Pressable>
        </View>

        {/* Mini barra inferior visual (sin cambiar tus tabs) */}
        <View style={styles.fakeBottomRow}>
          <Ionicons name="home" size={22} color="#FFFFFF" style={{ opacity: 0.95 }} />
          <Ionicons name="person" size={22} color="#FFFFFF" style={{ opacity: 0.6 }} />
          <Ionicons name="refresh" size={22} color="#FFFFFF" style={{ opacity: 0.6 }} />
        </View>
      </View>
    </ImageBackground>
  );
}


function ProgressRing({ progress }: { progress: number }) {
  
  const orangeOpacity = Math.max(0.25, 1 - progress);

  return (
    <View style={styles.ringWrap}>
      {/* Anillo azul */}
      <View style={styles.ringBlue} />

      {/* Anillo naranja encima (solo efecto visual) */}
      <View style={[styles.ringOrange, { opacity: orangeOpacity }]} />

      {/* Centro oscuro */}
      <View style={styles.ringCenter} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 14 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brand: { color: "#FFFFFF", fontSize: 22, letterSpacing: 0.5 },

  centerWrap: { alignItems: "center", marginTop: 10, marginBottom: 16 },
  timeOverlay: {
    position: "absolute",
    top: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: { fontSize: 54, fontWeight: "900" },
  timeWhite: { color: "#FFFFFF" },
  timeBlue: { color: "#2E8BFF" },
  timeColon: { color: "rgba(255,255,255,0.85)" },

  ringWrap: {
    width: 210,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
  },
  ringBlue: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 10,
    borderColor: "#2E8BFF",
    shadowColor: "#2E8BFF",
    shadowOpacity: Platform.OS === "android" ? 0.25 : 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  ringOrange: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 10,
    borderColor: "#FF7A00",
  },
  ringCenter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  infoWrap: { alignItems: "center", gap: 6, marginBottom: 8 },
  roundText: { color: "rgba(255,255,255,0.85)", fontSize: 18, fontWeight: "700" },
  restRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  restText: { color: "rgba(255,255,255,0.75)", fontSize: 18, fontWeight: "700" },

  bigTitle: {
    textAlign: "center",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 18,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },

  bigBtn: {
    width: 118,
    height: 106,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  blueBtn: {
    backgroundColor: "#2E8BFF",
  },
  blueBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 18,
  },

  midBtn: {
    width: 118,
    height: 106,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "rgba(255,122,0,0.35)",
    backgroundColor: "rgba(255,122,0,0.20)",
  },
  orangeBtn: {},
  stopSquare: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#FF7A00",
  },
  orangeBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },

  whiteBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(46,139,255,0.5)",
  },
  whiteBtnText: {
    color: "#2E8BFF",
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 18,
  },

  fakeBottomRow: {
    marginTop: "auto",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    paddingBottom: 10,
  },
});
