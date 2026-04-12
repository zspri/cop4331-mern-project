import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ResetPasswordScreen } from "./src/screens/ResetPasswordScreen";
import { WorkoutsScreen } from "./src/screens/WorkoutsScreen";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import type { ThemeColors } from "./src/theme/colors";

type Tab = "dashboard" | "workouts" | "nutrition";
type AuthScreen = "login" | "register" | "forgot" | "reset";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { colors, mode, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return;
    }

    const styleId = "mm-themed-scrollbar";
    const existing = document.getElementById(styleId);

    const track = colors.bg;
    const thumb = mode === "dark" ? colors.accent : colors.border;

    const css = `
      html, body {
        scrollbar-width: thin;
        scrollbar-color: ${thumb} ${track};
      }

      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      ::-webkit-scrollbar-track {
        background: ${track};
      }

      ::-webkit-scrollbar-thumb {
        background: ${thumb};
        border-radius: 999px;
        border: 3px solid ${track};
      }
    `;

    if (existing) {
      existing.textContent = css;
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }, [colors.bg, colors.border, colors.accent, mode]);

  const [tab, setTab] = useState<Tab>("dashboard");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const screen = useMemo(() => {
    if (tab === "workouts") return <WorkoutsScreen />;
    if (tab === "nutrition") return <NutritionScreen />;
    return <DashboardScreen onLogout={() => setIsAuthenticated(false)} />;
  }, [tab]);

  const authFlowScreen = useMemo(() => {
    if (authScreen === "login") {
      return (
        <LoginScreen
          onNavigate={setAuthScreen}
          onLoginSuccess={() => setIsAuthenticated(true)}
        />
      );
    }

    if (authScreen === "register") {
      return (
        <RegisterScreen
          onNavigate={setAuthScreen}
          onRegisterSuccess={() => setIsAuthenticated(true)}
        />
      );
    }

    if (authScreen === "forgot") {
      return <ForgotPasswordScreen onNavigate={setAuthScreen} />;
    }

    return <ResetPasswordScreen onNavigate={setAuthScreen} />;
  }, [authScreen]);

  const toggleIcon = mode === "light" ? "☀" : "☾";
  const toggleIconColor = mode === "light" ? "#6B7280" : "#A855F7";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        {isAuthenticated ? (
          <>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.brand}>MuscleMeter+</Text>
                <Text style={styles.tagline}>Train smarter. Recover better.</Text>
              </View>
            </View>

            <View style={styles.body}>{screen}</View>

            <View style={styles.nav}>
              <View style={styles.navContent}>
                <TouchableOpacity
                  onPress={() => setTab("dashboard")}
                  style={[styles.tabBtn, tab === "dashboard" && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabLabel, tab === "dashboard" && styles.tabLabelActive]}>
                    Home
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTab("workouts")}
                  style={[styles.tabBtn, tab === "workouts" && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabLabel, tab === "workouts" && styles.tabLabelActive]}>
                    Workouts
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTab("nutrition")}
                  style={[styles.tabBtn, tab === "nutrition" && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabLabel, tab === "nutrition" && styles.tabLabelActive]}>
                    Nutrition
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          authFlowScreen
        )}

        <Pressable
          style={({ hovered, pressed }) => [
            styles.themeToggle,
            isAuthenticated && styles.themeToggleAboveNav,
            (hovered || pressed) && styles.themeToggleInteractive
          ]}
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {({ hovered, pressed }) => (
            <Text
              style={[
                styles.themeToggleIcon,
                { color: hovered || pressed ? colors.accent : toggleIconColor }
              ]}
            >
              {toggleIcon}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg
    },
    appShell: {
      flex: 1,
      backgroundColor: colors.bg
    },
    header: {
      paddingTop: 14,
      paddingBottom: 10
    },
    headerContent: {
      width: "100%",
      maxWidth: 760,
      alignSelf: "center",
      alignItems: "center",
      paddingHorizontal: 0
    },
    brand: {
      color: colors.accent,
      fontSize: 28,
      fontWeight: "800",
      letterSpacing: -0.5
    },
    tagline: {
      marginTop: 4,
      color: colors.mutetext,
      fontSize: 14,
      fontWeight: "500"
    },
    body: {
      flex: 1,
      paddingBottom: 8
    },
    nav: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 10,
      paddingBottom: 14
    },
    navContent: {
      width: "100%",
      maxWidth: 760,
      alignSelf: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 8
    },
    tabBtn: {
      flex: 1,
      marginHorizontal: 6,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center"
    },
    tabBtnActive: {
      backgroundColor: colors.accentSoft
    },
    tabLabel: {
      color: colors.mutetext,
      fontSize: 15,
      fontWeight: "600"
    },
    tabLabelActive: {
      color: colors.accent,
      fontWeight: "700"
    },
    themeToggle: {
      position: "absolute",
      right: 16,
      bottom: 22,
      backgroundColor: colors.toggleBg,
      borderRadius: 999,
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.toggleBorder,
      zIndex: 5,
      elevation: 4
    },
    themeToggleAboveNav: {
      bottom: 92
    },
    themeToggleInteractive: {
      backgroundColor: colors.tileHover,
      borderColor: colors.accent
    },
    themeToggleIcon: {
      color: colors.toggleText,
      fontWeight: "800",
      fontSize: 20,
      lineHeight: 20
    }
  });
}
