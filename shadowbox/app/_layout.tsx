import { Stack } from "expo-router";
import { ThemeProvider } from "../themeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="generate" />
        <Stack.Screen name="plan" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="training-session" />
        <Stack.Screen name="workout-detail" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="offline-workouts" />
        <Stack.Screen name="workouts" />
        <Stack.Screen name="my-workouts" />
        <Stack.Screen name="create-workout" />
        <Stack.Screen name="notifications-settings" />
        <Stack.Screen name="theme-settings" />
      </Stack>
    </ThemeProvider>
  );
}