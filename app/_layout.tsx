import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MyThemeProvider, useMyThemeContext } from "@/contexts/ThemeContext";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

// Adapt navigation themes using Paper's Material Design 3 themes
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: MD3LightTheme,
  materialDark: MD3DarkTheme,
});

function InitialLayout() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth group, redirect to home
      router.replace("/home");
    }
  }, [isAuthenticated, loading, inAuthGroup, segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <MyThemeProvider>
      <RootLayoutContent />
    </MyThemeProvider>
  );
}

function RootLayoutContent() {
  const { theme, isDarkTheme } = useMyThemeContext();

  // Use the adapted navigation theme based on dark mode
  const navigationTheme = isDarkTheme ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationThemeProvider value={navigationTheme}>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </NavigationThemeProvider>
    </PaperProvider>
  );
}
