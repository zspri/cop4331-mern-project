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
        <Text style={styles.brand}>MuscleMeter+</Text>
        <View style={styles.body}>{screen}</View>

        <View style={styles.nav}>
          <TabButton label="Home" active={tab === "dashboard"} onPress={() => setTab("dashboard")} />
          <TabButton label="Workouts" active={tab === "workouts"} onPress={() => setTab("workouts")} />
          <TabButton label="Nutrition" active={tab === "nutrition"} onPress={() => setTab("nutrition")} />
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
    flex: 1
  },
  brand: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    color: colors.accent,
    fontSize: 18,
    fontWeight: "800"
  },
  body: {
    flex: 1
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 8
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10
  },
  tabBtnActive: {
    backgroundColor: colors.accentSoft
  },
  tabLabel: {
    color: colors.mutetext,
    fontWeight: "600"
  },
  tabLabelActive: {
    color: colors.accent
  }
});
