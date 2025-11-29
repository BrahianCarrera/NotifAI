import { Colors } from "@/constants/colors";
import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

interface ThemeContextType {
  isDarkTheme: boolean;
  theme: typeof MD3DarkTheme | typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useMyThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useMyThemeContext must be used within a MyThemeProvider");
  }
  return context;
};

// Create custom themes using your color definitions
const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...Colors.light,
  },
};

const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...Colors.dark,
  },
};

export const MyThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  const theme = isDarkTheme ? CustomDarkTheme : CustomLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
