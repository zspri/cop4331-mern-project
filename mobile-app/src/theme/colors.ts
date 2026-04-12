export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  bg: string;
  card: string;
  tileHover: string;
  tilePress: string;
  text: string;
  mutetext: string;
  accent: string;
  accentSoft: string;
  warning: string;
  border: string;
  coachBorder: string;
  toggleBg: string;
  toggleBorder: string;
  toggleText: string;
};

export const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    bg: "#F4F7F9",
    card: "#FFFFFF",
    tileHover: "#F0FDFA",
    tilePress: "#CCFBF1",
    text: "#1B1F24",
    mutetext: "#5E6A75",
    accent: "#0D9488",
    accentSoft: "#CCFBF1",
    warning: "#F59E0B",
    border: "#E4E7EB",
    coachBorder: "#99F6E4",
    toggleBg: "#FFFFFF",
    toggleBorder: "#D1D5DB",
    toggleText: "#111827"
  },
  dark: {
    bg: "#09080F",
    card: "#171322",
    tileHover: "#241B36",
    tilePress: "#2E2145",
    text: "#F3EEFF",
    mutetext: "#B6AACC",
    accent: "#A855F7",
    accentSoft: "#2A1A3F",
    warning: "#F59E0B",
    border: "#3A2A52",
    coachBorder: "#5B3A82",
    toggleBg: "#0B0713",
    toggleBorder: "#A855F7",
    toggleText: "#F5F3FF"
  }
};

export const colors = themeColors.light;
