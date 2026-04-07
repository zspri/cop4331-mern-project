import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { WorkoutsScreen } from "./src/screens/WorkoutsScreen";
import { colors } from "./src/theme/colors";

type Tab = "dashboard" | "workouts" | "nutrition";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const screen = useMemo(() => {
    if (tab === "workouts") return <WorkoutsScreen />;
    if (tab === "nutrition") return <NutritionScreen />;
    return <DashboardScreen />;
  }, [tab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.brand}>MuscleMeter+</Text>
            <Text style={styles.tagline}>Train smarter. Recover better.</Text>
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
  }
});