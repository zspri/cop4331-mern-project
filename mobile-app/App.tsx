import React, { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
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
  const { width, height } = useWindowDimensions();
  const isWebLandscape = Platform.OS === "web" && width > height;
  const sideGutter = isWebLandscape ? 96 : 16;
  const contentMaxWidth = isWebLandscape ? Math.max(1200, width - sideGutter * 2) : 900;
  const styles = useMemo(() => createStyles(colors, sideGutter, contentMaxWidth), [colors, sideGutter, contentMaxWidth]);

  useEffect(() => {
    const doc = (globalThis as any).document;
    if (Platform.OS !== "web" || !doc) {
      return;
    }

    const styleId = "mm-themed-scrollbar";
    const existing = doc.getElementById(styleId);

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

    const style = doc.createElement("style");
    style.id = styleId;
    style.textContent = css;
    doc.head.appendChild(style);
  }, [colors.bg, colors.border, colors.accent, mode]);

  const [tab, setTab] = useState<Tab>("dashboard");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken(null);
    setTab("dashboard");
    setAuthScreen("login");
  };

  const screen = useMemo(() => {
    if (tab === "workouts") return <WorkoutsScreen currentUser={currentUser} token={token} />;
    if (tab === "nutrition") return <NutritionScreen currentUser={currentUser} token={token} />;
    return <DashboardScreen currentUser={currentUser} token={token} onLogout={handleLogout} />;
  }, [tab, currentUser, token]);

  const authFlowScreen = useMemo(() => {
    if (authScreen === "login") {
      return (
        <LoginScreen
          onNavigate={setAuthScreen}
          onLoginSuccess={(user, tok) => {
            setCurrentUser(user);
            setToken(tok);
            setIsAuthenticated(true);
          }}
        />
      );
    }

    if (authScreen === "register") {
      return (
        <RegisterScreen
          onNavigate={setAuthScreen}
        />
      );
    }

    if (authScreen === "forgot") {
      return <ForgotPasswordScreen onNavigate={setAuthScreen} />;
    }

    return <ResetPasswordScreen onNavigate={setAuthScreen} />;
  }, [authScreen]);

  const toggleIconName = mode === "light" ? "sunny-outline" : "moon-outline";
  const toggleIconColor = mode === "light" ? "#6B7280" : "#A855F7";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        {isAuthenticated ? (
          <>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.brand}>MuscleMeter+</Text>
                  <Text style={styles.tagline}>Train smarter. Recover better.</Text>
                </View>

                {currentUser && (
                  <View style={styles.profileBox}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }} />
                  </View>
                )}
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
          style={({ hovered, pressed }: any) => [
            styles.themeToggle,
            isAuthenticated && styles.themeToggleAboveNav,
            (hovered || pressed) && styles.themeToggleInteractive
          ]}
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          <Ionicons
            name={toggleIconName}
            size={22}
            color={toggleIconColor}
            style={styles.themeToggleIcon}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, sideGutter: number, contentMaxWidth: number) {
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: sideGutter
    },
    profileBox: {
      alignItems: "flex-end",
    },
    profileName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 8,
    },
    logoutText: {
      fontSize: 18,
      color: colors.accent,
      fontWeight: "600"
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: sideGutter
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
      borderWidth: 1,
      borderColor: colors.toggleBorder,
      width: 48,
      height: 48,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
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
      lineHeight: 22
    }
  });
}