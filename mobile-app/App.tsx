import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { ResetPasswordScreen } from "./src/screens/ResetPasswordScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { WorkoutsScreen } from "./src/screens/WorkoutsScreen";
import { colors } from "./src/theme/colors";

type Tab = "dashboard" | "workouts" | "nutrition";
type AuthScreen = "login" | "register" | "forgot" | "reset";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken(null);
  };

  const screen = useMemo(() => {
    if (tab === "workouts") return <WorkoutsScreen token={token} currentUser={currentUser} />;
    if (tab === "nutrition") return <NutritionScreen token={token} currentUser={currentUser} />;
    return <DashboardScreen currentUser={currentUser} token={token} />;
  }, [tab, currentUser, token]);

  if (!isAuthenticated) {
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
      return <RegisterScreen onNavigate={setAuthScreen} />;
    }

    if (authScreen === "forgot") {
      return <ForgotPasswordScreen onNavigate={setAuthScreen} />;
    }

    return <ResetPasswordScreen onNavigate={setAuthScreen} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.brand}>MuscleMeter+</Text>
              <Text style={styles.tagline}>Train smarter. Recover better.</Text>
            </View>
            
            {currentUser && (
              <View style={styles.profileBox}>
                 <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                   <Text style={styles.logoutText}>Logout</Text>
                 </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.body}>{screen}</View>

        <View style={styles.nav}>
          <View style={styles.navContent}>
            <TabButton label="Home" active={tab === "dashboard"} onPress={() => setTab("dashboard")} />
            <TabButton label="Workouts" active={tab === "workouts"} onPress={() => setTab("workouts")} />
            <TabButton label="Nutrition" active={tab === "nutrition"} onPress={() => setTab("nutrition")} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

type TabButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabButton({ label, active, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16
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
    marginTop: 4,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 12,
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
  }
});