import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../themeContext";
import { useTranslation } from "../../utils/useTranslation";

export default function TabsLayout() {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0B0F14" : "#FFFFFF",
          borderTopColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(7,17,31,0.10)",
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#2E8BFF",
        tabBarInactiveTintColor: isDark
          ? "rgba(255,255,255,0.35)"
          : "rgba(7,17,31,0.42)",
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="train"
        options={{
          title: t("train"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hand-left" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: t("community"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}