import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { theme } from "../theme";

export function SBButton({
  title,
  variant = "orange",
  onPress,
  style,
}: {
  title: string;
  variant?: "orange" | "blue";
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const bg = variant === "orange" ? theme.colors.orange : theme.colors.blue;

  return (
    <Pressable style={[styles.btn, { backgroundColor: bg }, style]} onPress={onPress}>
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: theme.radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
