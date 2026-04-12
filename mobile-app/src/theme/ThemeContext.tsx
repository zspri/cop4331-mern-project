import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { themeColors, type ThemeColors, type ThemeMode } from "./colors";

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
