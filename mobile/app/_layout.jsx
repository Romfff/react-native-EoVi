import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  // Khi fonts load xong thì ẩn splash
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Check auth và đánh dấu sẵn sàng
  useEffect(() => {
    (async () => {
      await checkAuth();
      setReady(true);
    })();
  }, []);

  // Điều hướng sau khi auth check xong
  useEffect(() => {
    if (!ready) return; // chỉ chạy khi đã check auth

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [ready, user, token, segments]);

  // Khi chưa ready thì giữ splash hoặc loading UI
  if (!ready || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
