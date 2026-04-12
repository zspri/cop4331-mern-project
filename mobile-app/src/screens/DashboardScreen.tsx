import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatCard } from "../components/StatCard";
import { meals, recovery, user, workouts } from "../data/seed";
import { buildCoachTip, getReadinessScore } from "../features/recommendations";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

export function DashboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const today = "2026-03-26";
  const todaysWorkouts = workouts.filter((w) => w.date === today);
  const todaysMeals = meals.filter((m) => m.date === today);
  const todayRecovery = recovery.find((r) => r.date === today);

  const readiness = getReadinessScore(todayRecovery);
  const proteinToday = todaysMeals.reduce((sum, meal) => sum + meal.proteinG, 0);
  const coachTip = buildCoachTip(todaysWorkouts, todaysMeals, readiness);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome back, {user.name}</Text>
        <Text style={styles.subheader}>Daily Snapshot</Text>

        <View style={styles.grid}>
          <StatCard label="Readiness" value={`${readiness}/100`} hint="Sleep + soreness + stress" />
          <StatCard label="Workouts" value={`${todaysWorkouts.length}`} hint="Sessions completed today" />
          <StatCard label="Protein" value={`${proteinToday}g`} hint={`Goal ${user.targetProteinG}g`} />
        </View>

        <View style={styles.coachCard}>
          <Text style={styles.coachTitle}>AI Coach Tip</Text>
          <Text style={styles.coachText}>{coachTip}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
      backgroundColor: colors.bg
    },
    content: {
      width: "100%",
      maxWidth: 760,
      alignSelf: "center",
      gap: 14
    },
    header: {
      marginTop: 8,
      fontSize: 24,
      fontWeight: "800",
      color: colors.text
    },
    subheader: {
      marginTop: -4,
      fontSize: 15,
      color: colors.mutetext
    },
    grid: {
      gap: 12
    },
    coachCard: {
      backgroundColor: colors.accentSoft,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.coachBorder,
      marginTop: 4
    },
    coachTitle: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: 10,
      letterSpacing: 0.4
    },
    coachText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22
    }
  });
}