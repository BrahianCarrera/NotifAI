import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
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

export const MyThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("isDarkTheme");
        if (storedTheme !== null) {
          setIsDarkTheme(JSON.parse(storedTheme));
        }
      } catch (e) {
        console.error("Failed to load theme from storage", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    try {
      await AsyncStorage.setItem("isDarkTheme", JSON.stringify(newTheme));
    } catch (e) {
      console.error("Failed to save theme to storage", e);
    }
  };

  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
