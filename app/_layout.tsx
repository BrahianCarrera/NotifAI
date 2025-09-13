import { Colors } from "@/constants/colors";
import merge from "deepmerge";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

const customDarkTheme = { ...MD3DarkTheme, Colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, Colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "NotifIA",
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
