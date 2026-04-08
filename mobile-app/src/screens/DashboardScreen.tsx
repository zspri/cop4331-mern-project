import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Platform, ActivityIndicator } from "react-native";
import { StatCard } from "../components/StatCard";
import { meals, recovery, user as seedUser } from "../data/seed";
import { buildCoachTip, getReadinessScore } from "../features/recommendations";
import { colors } from "../theme/colors";

const WORKOUTS_API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001/api/workouts"
    : "http://localhost:5001/api/workouts";

type Props = {
  currentUser?: any;
  token?: string | null;
};

export function DashboardScreen({ currentUser, token }: Props) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  // Fetch real workouts from the API
  useEffect(() => {
    if (!token) return;
    setLoadingWorkouts(true);
    fetch(WORKOUTS_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setWorkouts(data);
      })
      .catch(() => {})
      .finally(() => setLoadingWorkouts(false));
  }, [token]);

  // Seed data for nutrition/recovery (until those APIs exist)
  const today = "2026-03-26";
  const todaysMeals = meals.filter((m) => m.date === today);
  const todayRecovery = recovery.find((r) => r.date === today);
  const readiness = getReadinessScore(todayRecovery);
  const proteinToday = todaysMeals.reduce((sum, meal) => sum + meal.proteinG, 0);

  // Real workout stats
  const totalWorkouts = workouts.length;

  // Workouts this week
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const workoutsThisWeek = workouts.filter(
    (w) => new Date(w.createdAt) >= startOfWeek
  ).length;

  // Total exercises ever logged
  const totalExercises = workouts.reduce(
    (sum, w) => sum + (w.exercises?.length ?? 0),
    0
  );

  // Most recent workout name
  const latestWorkout = workouts[0];

  const displayName = currentUser ? currentUser.firstName : seedUser.name;

  // AI tip uses real workout count
  const coachTip = workouts.length === 0
    ? "Log your first workout in the Workouts tab to start tracking your progress!"
    : buildCoachTip([], todaysMeals, readiness);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome back, {displayName}</Text>
        <Text style={styles.subheader}>Your Progress Snapshot</Text>

        {/* Live workout stats */}
        <Text style={styles.sectionLabel}>Workout Activity</Text>
        {loadingWorkouts ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 12 }} />
        ) : (
          <View style={styles.grid}>
            <StatCard
              label="Total Workouts"
              value={`${totalWorkouts}`}
              hint="All time"
            />
            <StatCard
              label="This Week"
              value={`${workoutsThisWeek}`}
              hint="Sessions logged"
            />
            <StatCard
              label="Exercises Logged"
              value={`${totalExercises}`}
              hint="Across all workouts"
            />
          </View>
        )}

        {/* Latest workout card */}
        {latestWorkout && (
          <View style={styles.latestCard}>
            <Text style={styles.latestLabel}>Last Workout</Text>
            <Text style={styles.latestName}>{latestWorkout.name}</Text>
            <Text style={styles.latestMeta}>
              {latestWorkout.category} •{" "}
              {latestWorkout.exercises?.length ?? 0} exercise
              {(latestWorkout.exercises?.length ?? 0) !== 1 ? "s" : ""} •{" "}
              {new Date(latestWorkout.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Nutrition & Recovery (seed data for now) */}
        <Text style={styles.sectionLabel}>Today's Nutrition</Text>
        <View style={styles.grid}>
          <StatCard
            label="Readiness"
            value={`${readiness}/100`}
            hint="Sleep + soreness + stress"
          />
          <StatCard
            label="Protein"
            value={`${proteinToday}g`}
            hint={`Goal ${seedUser.targetProteinG}g`}
          />
        </View>

        {/* AI coach tip */}
        <View style={styles.coachCard}>
          <Text style={styles.coachTitle}>AI Coach Tip</Text>
          <Text style={styles.coachText}>{coachTip}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: colors.bg,
  },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    gap: 14,
  },
  header: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  subheader: {
    marginTop: -4,
    fontSize: 15,
    color: colors.mutetext,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.mutetext,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 4,
    marginBottom: -4,
  },
  grid: {
    gap: 12,
  },
  latestCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  latestLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.mutetext,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  latestName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  latestMeta: {
    fontSize: 13,
    color: colors.mutetext,
    marginTop: 4,
  },
  coachCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#99F6E4",
    marginTop: 4,
  },
  coachTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  coachText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});