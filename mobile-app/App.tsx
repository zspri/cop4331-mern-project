import React, { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ResetPasswordScreen } from "./src/screens/ResetPasswordScreen";
import { WorkoutsScreen } from "./src/screens/WorkoutsScreen";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import type { ThemeColors, ThemeMode } from "./src/theme/colors";

type Tab = "dashboard" | "workouts" | "nutrition";
type AuthScreen = "login" | "register" | "forgot" | "reset";

const SESSION_STATE_KEY = "mm_session_state";

type SessionState = {
  tab: Tab;
  authScreen: AuthScreen;
  isAuthenticated: boolean;
  currentUser: any;
  token: string | null;
};

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
  const isLandscape = width > height;
  const sideGutter = isLandscape ? 96 : 16;
  const contentMaxWidth = isLandscape ? Math.max(1200, width - sideGutter * 2) : 900;
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

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus {
        -webkit-text-fill-color: ${colors.text} !important;
        caret-color: ${colors.text};
        -webkit-box-shadow: 0 0 0 1000px ${colors.bg} inset !important;
        box-shadow: 0 0 0 1000px ${colors.bg} inset !important;
        border: 1px solid ${colors.border} !important;
        transition: background-color 9999s ease-out 0s;
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
  }, [colors.bg, colors.border, colors.accent, colors.text, mode]);

  const [tab, setTab] = useState<Tab>("dashboard");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionHydrated, setSessionHydrated] = useState(false);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_STATE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as Partial<SessionState>;
        if (parsed.tab === "dashboard" || parsed.tab === "workouts" || parsed.tab === "nutrition") {
          setTab(parsed.tab);
        }
        if (parsed.authScreen === "login" || parsed.authScreen === "register" || parsed.authScreen === "forgot" || parsed.authScreen === "reset") {
          setAuthScreen(parsed.authScreen);
        }
        if (typeof parsed.isAuthenticated === "boolean") {
          setIsAuthenticated(parsed.isAuthenticated);
        }
        if (typeof parsed.token === "string" || parsed.token === null) {
          setToken(parsed.token ?? null);
        }
        if (parsed.currentUser !== undefined) {
          setCurrentUser(parsed.currentUser ?? null);
        }
      } catch {
        // Ignore malformed or unavailable persisted state.
      } finally {
        setSessionHydrated(true);
      }
    };

    hydrateSession();
  }, []);

  useEffect(() => {
    if (!sessionHydrated) return;

    const snapshot: SessionState = {
      tab,
      authScreen,
      isAuthenticated,
      currentUser,
      token,
    };

    AsyncStorage.setItem(SESSION_STATE_KEY, JSON.stringify(snapshot)).catch(() => {
      // Ignore persistence write failures.
    });
  }, [tab, authScreen, isAuthenticated, currentUser, token, sessionHydrated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken(null);
    setTab("dashboard");
    setAuthScreen("login");
    AsyncStorage.removeItem(SESSION_STATE_KEY).catch(() => {
      // Ignore storage removal failures.
    });
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const screen = useMemo(() => {
    if (tab === "workouts") {
      return <WorkoutsScreen currentUser={currentUser} token={token} mode={mode as ThemeMode} onToggleTheme={handleToggleTheme} />;
    }
    if (tab === "nutrition") {
      return <NutritionScreen currentUser={currentUser} token={token} mode={mode as ThemeMode} onToggleTheme={handleToggleTheme} />;
    }
    return <DashboardScreen currentUser={currentUser} token={token} onLogout={handleLogout} mode={mode as ThemeMode} onToggleTheme={handleToggleTheme} />;
  }, [tab, currentUser, token, mode]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {!sessionHydrated ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
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
                <Pressable
                  onPress={() => setTab("dashboard")}
                  style={({ hovered, pressed }: any) => [
                    styles.tabBtn,
                    (hovered || pressed) && styles.tabBtnInteractive,
                    tab === "dashboard" && styles.tabBtnActive,
                  ]}
                >
                  {({ hovered, pressed }: any) => (
                    <Text style={[styles.tabLabel, tab === "dashboard" && styles.tabLabelActive, (hovered || pressed) && tab !== "dashboard" && styles.tabLabelInteractive]}>
                      Home
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setTab("workouts")}
                  style={({ hovered, pressed }: any) => [
                    styles.tabBtn,
                    (hovered || pressed) && styles.tabBtnInteractive,
                    tab === "workouts" && styles.tabBtnActive,
                  ]}
                >
                  {({ hovered, pressed }: any) => (
                    <Text style={[styles.tabLabel, tab === "workouts" && styles.tabLabelActive, (hovered || pressed) && tab !== "workouts" && styles.tabLabelInteractive]}>
                      Workouts
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setTab("nutrition")}
                  style={({ hovered, pressed }: any) => [
                    styles.tabBtn,
                    (hovered || pressed) && styles.tabBtnInteractive,
                    tab === "nutrition" && styles.tabBtnActive,
                  ]}
                >
                  {({ hovered, pressed }: any) => (
                    <Text style={[styles.tabLabel, tab === "nutrition" && styles.tabLabelActive, (hovered || pressed) && tab !== "nutrition" && styles.tabLabelInteractive]}>
                      Nutrition
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          authFlowScreen
        )}

        {!isAuthenticated && (
          <Pressable
            style={({ hovered, pressed }: any) => [
              styles.authThemeToggle,
              (hovered || pressed) && styles.authThemeToggleInteractive,
            ]}
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            <Ionicons
              name={mode === "light" ? "sunny-outline" : "moon-outline"}
              size={22}
              color={colors.accent}
            />
          </Pressable>
        )}

      </View>
      )}
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
    loadingWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
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
    tabBtnInteractive: {
      backgroundColor: colors.tileHover,
      borderWidth: 1,
      borderColor: colors.accent + "55"
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
    tabLabelInteractive: {
      color: colors.accent
    },
    authThemeToggle: {
      position: "absolute",
      right: 16,
      bottom: 22,
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.accent + "40",
      width: 46,
      height: 46,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
      elevation: 10,
    },
    authThemeToggleInteractive: {
      backgroundColor: colors.tileHover,
      borderColor: colors.accent + "55",
    },
  });
}