import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatCard } from "../components/StatCard";
import { meals, recovery, user, workouts } from "../data/seed";
import { buildCoachTip, getReadinessScore } from "../features/recommendations";
import { colors } from "../theme/colors";

export function DashboardScreen() {
  const today = "2026-03-26";
  const todaysWorkouts = workouts.filter((w) => w.date === today);
  const todaysMeals = meals.filter((m) => m.date === today);
  const todayRecovery = recovery.find((r) => r.date === today);

  const readiness = getReadinessScore(todayRecovery);
  const proteinToday = todaysMeals.reduce((sum, meal) => sum + meal.proteinG, 0);
  const coachTip = buildCoachTip(todaysWorkouts, todaysMeals, readiness);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    backgroundColor: colors.bg
  },
  header: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text
  },
  subheader: {
    fontSize: 14,
    color: colors.mutetext
  },
  grid: {
    gap: 10
  },
  coachCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#99F6E4"
  },
  coachTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8
  },
  coachText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20
  }
});
