import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeColors, type ThemeColors, type ThemeMode } from "./colors";

const THEME_MODE_KEY = "mm_theme_mode";

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isThemeHydrated, setIsThemeHydrated] = useState(false);

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (savedMode === "light" || savedMode === "dark") {
          setMode(savedMode);
        }
      } catch {
        // Fall back to default mode when persistence fails.
      } finally {
        setIsThemeHydrated(true);
      }
    };

    loadThemeMode();
  }, []);

  useEffect(() => {
    if (!isThemeHydrated) return;

    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch(() => {
      // Ignore storage write failures to avoid blocking UI.
    });
  }, [mode, isThemeHydrated]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: themeColors[mode],
      toggleTheme: () => setMode((prev) => (prev === "light" ? "dark" : "light"))
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
