import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
    </Stack>
  );
}