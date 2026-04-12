import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

const BASE =
  Platform.OS === "android" ? "http://10.0.2.2:5001/api" : "http://localhost:5001/api";

const WORKOUT_GOAL = 3;
const PROTEIN_GOAL = 150;
const CALORIE_GOAL = 2500;
const EXERCISE_GOAL = 15;

type Props = {
  currentUser?: any;
  token?: string | null;
};

function authHeader(token: string | null | undefined) {
  return { Authorization: `Bearer ${token ?? ""}` };
}

function ProgressBar({ value, max, color, themeColors }: { value: number; max: number; color: string; themeColors: ThemeColors }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  return (
    <View style={[pbStyles.track, { backgroundColor: themeColors.border }]}>
      <View style={[pbStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const pbStyles = StyleSheet.create({
  track: { height: 8, borderRadius: 6, overflow: "hidden", marginTop: 6 },
  fill: { height: "100%", borderRadius: 6 },
});

export function DashboardScreen({ currentUser, token }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/workouts`, { headers: authHeader(token) }).then((r) => r.json()),
      fetch(`${BASE}/meals`, { headers: authHeader(token) }).then((r) => r.json()),
    ])
      .then(([w, m]) => {
        if (Array.isArray(w)) setWorkouts(w);
        if (Array.isArray(m)) setMeals(m);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const workoutsThisWeek = workouts.filter((w) => new Date(w.createdAt) >= startOfWeek).length;
  const exercisesThisWeek = workouts
    .filter((w) => new Date(w.createdAt) >= startOfWeek)
    .reduce((s, w) => s + (w.exercises?.length ?? 0), 0);
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((s, w) => s + (w.exercises?.length ?? 0), 0);
  const latestWorkout = workouts[0] ?? null;

  const todaysMeals = meals.filter((m) => m.date === todayStr);
  const calsToday = Math.round(todaysMeals.reduce((s, m) => s + (m.calories ?? 0), 0));
  const proteinToday = Math.round(todaysMeals.reduce((s, m) => s + (m.proteinG ?? 0), 0));
  const carbsToday = Math.round(todaysMeals.reduce((s, m) => s + (m.carbsG ?? 0), 0));
  const fatsToday = Math.round(todaysMeals.reduce((s, m) => s + (m.fatsG ?? 0), 0));
  const totalMeals = meals.length;
  const avgCals = totalMeals > 0
    ? Math.round(meals.reduce((s, m) => s + (m.calories ?? 0), 0) / totalMeals)
    : 0;

  const weekWorkoutPct = Math.round((workoutsThisWeek / WORKOUT_GOAL) * 100);

  const displayName = currentUser?.firstName ?? "Athlete";

  const getCoachTip = () => {
    if (workouts.length === 0 && meals.length === 0)
      return "Head to Workouts and Nutrition to start logging your progress. Your personalised insights will appear here.";
    if (workoutsThisWeek === 0)
      return "You haven't logged a workout yet this week. Time to get moving — even one session makes a difference!";
    if (workoutsThisWeek >= WORKOUT_GOAL && proteinToday < PROTEIN_GOAL)
      return `Great week of training! You've hit your ${WORKOUT_GOAL} workout goal. Focus on hitting your protein target today (${proteinToday}g/${PROTEIN_GOAL}g) to maximise recovery.`;
    if (proteinToday >= PROTEIN_GOAL && workoutsThisWeek < WORKOUT_GOAL)
      return `Nutrition is on point today — ${proteinToday}g protein! Try to squeeze in ${WORKOUT_GOAL - workoutsThisWeek} more workout${WORKOUT_GOAL - workoutsThisWeek !== 1 ? "s" : ""} before the week ends.`;
    if (workoutsThisWeek >= WORKOUT_GOAL && proteinToday >= PROTEIN_GOAL)
      return `You're crushing it this week — ${workoutsThisWeek} workouts and ${proteinToday}g protein today. Keep the momentum going!`;
    return `${workoutsThisWeek} of ${WORKOUT_GOAL} workouts done this week. Log your meals in the Nutrition tab to get more personalised advice.`;
  };

  function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
      </View>
    );
  }

  function SectionHeader({ title }: { title: string }) {
    return <Text style={styles.sectionLabel}>{title}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome back, {displayName}</Text>
        <Text style={styles.subheader}>Here's your daily summary</Text>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 32 }} />
        ) : (
          <>
            <View style={styles.weekCard}>
              <Text style={styles.weekCardTitle}>This Week's Progress</Text>
              <View style={styles.weekRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.weekMetric}>
                    {workoutsThisWeek} <Text style={styles.weekGoal}>/ {WORKOUT_GOAL} workouts</Text>
                  </Text>
                  <ProgressBar value={workoutsThisWeek} max={WORKOUT_GOAL} color={colors.accent} themeColors={colors} />
                </View>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekPct}>{weekWorkoutPct}%</Text>
                </View>
              </View>
              <View style={[styles.weekRow, { marginTop: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.weekMetric}>
                    {exercisesThisWeek} <Text style={styles.weekGoal}>/ {EXERCISE_GOAL} exercises</Text>
                  </Text>
                  <ProgressBar value={exercisesThisWeek} max={EXERCISE_GOAL} color={colors.warning} themeColors={colors} />
                </View>
              </View>
            </View>

            <SectionHeader title="Today's Nutrition" />

            {todaysMeals.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No meals logged today</Text>
                <Text style={styles.emptySub}>Head to the Nutrition tab to track your macros</Text>
              </View>
            ) : (
              <>
                <View style={styles.macroRow}>
                  <View style={[styles.macroBig, { flex: 2 }]}>
                    <Text style={styles.macroLabel}>Calories</Text>
                    <Text style={styles.macroBigVal}>{calsToday}</Text>
                    <Text style={styles.macroUnit}>/ {CALORIE_GOAL} kcal</Text>
                    <ProgressBar value={calsToday} max={CALORIE_GOAL} color={colors.accent} themeColors={colors} />
                  </View>
                  <View style={{ flex: 1, gap: 8 }}>
                    <View style={styles.macroSmall}>
                      <Text style={styles.macroLabel}>Protein</Text>
                      <Text style={styles.macroSmallVal}>{proteinToday}g</Text>
                      <ProgressBar value={proteinToday} max={PROTEIN_GOAL} color="#8B5CF6" themeColors={colors} />
                    </View>
                    <View style={styles.macroSmall}>
                      <Text style={styles.macroLabel}>Carbs</Text>
                      <Text style={styles.macroSmallVal}>{carbsToday}g</Text>
                    </View>
                    <View style={styles.macroSmall}>
                      <Text style={styles.macroLabel}>Fats</Text>
                      <Text style={styles.macroSmallVal}>{fatsToday}g</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.mealCount}>{todaysMeals.length} meal{todaysMeals.length !== 1 ? "s" : ""} logged today</Text>
              </>
            )}

            <SectionHeader title="Workout Stats" />

            <View style={styles.statsRow}>
              <StatBox label="Total" value={`${totalWorkouts}`} sub="workouts" />
              <StatBox label="This Week" value={`${workoutsThisWeek}`} sub="sessions" />
              <StatBox label="Exercises" value={`${totalExercises}`} sub="all time" />
            </View>

            {latestWorkout && (
              <>
                <SectionHeader title="Last Workout" />
                <View style={styles.lastCard}>
                  <Text style={styles.lastName}>{latestWorkout.name}</Text>
                  <Text style={styles.lastMeta}>
                    {latestWorkout.category} · {latestWorkout.exercises?.length ?? 0} exercise{(latestWorkout.exercises?.length ?? 0) !== 1 ? "s" : ""} · {new Date(latestWorkout.createdAt).toLocaleDateString()}
                  </Text>
                  {(latestWorkout.exercises?.length ?? 0) > 0 && (
                    <View style={styles.exerciseTags}>
                      {latestWorkout.exercises.slice(0, 3).map((ex: any, i: number) => (
                        <View key={i} style={styles.exerciseTag}>
                          <Text style={styles.exerciseTagText}>{ex.exerciseName}</Text>
                        </View>
                      ))}
                      {latestWorkout.exercises.length > 3 && (
                        <View style={styles.exerciseTag}>
                          <Text style={styles.exerciseTagText}>+{latestWorkout.exercises.length - 3} more</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </>
            )}

            <SectionHeader title="Nutrition Overview" />
            <View style={styles.statsRow}>
              <StatBox label="Meals Logged" value={`${totalMeals}`} />
              <StatBox label="Avg Calories" value={`${avgCals}`} sub="per meal" />
            </View>

            <View style={styles.coachCard}>
              <Text style={styles.coachTitle}>Coach Tip</Text>
              <Text style={styles.coachText}>{getCoachTip()}</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, backgroundColor: colors.bg },
    content: { width: "100%", maxWidth: 900, alignSelf: "center", gap: 12 },
    header: { marginTop: 8, fontSize: 24, fontWeight: "800", color: colors.text },
    subheader: { marginTop: -4, fontSize: 15, color: colors.mutetext },
    sectionLabel: { fontSize: 12, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 8 },
    weekCard: { backgroundColor: colors.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border },
    weekCardTitle: { fontSize: 15, fontWeight: "700", color: colors.text, marginBottom: 14 },
    weekRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    weekMetric: { fontSize: 18, fontWeight: "800", color: colors.text },
    weekGoal: { fontSize: 13, fontWeight: "500", color: colors.mutetext },
    weekBadge: { backgroundColor: colors.accentSoft, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: "center" },
    weekPct: { fontSize: 15, fontWeight: "800", color: colors.accent },
    emptyCard: { backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
    emptyText: { fontSize: 15, fontWeight: "700", color: colors.text },
    emptySub: { fontSize: 13, color: colors.mutetext, marginTop: 4, textAlign: "center" },
    macroRow: { flexDirection: "row", gap: 10 },
    macroBig: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
    macroSmall: { backgroundColor: colors.card, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.border },
    macroLabel: { fontSize: 11, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", letterSpacing: 0.3 },
    macroBigVal: { fontSize: 28, fontWeight: "800", color: colors.accent, marginTop: 2 },
    macroSmallVal: { fontSize: 16, fontWeight: "800", color: colors.text, marginTop: 2 },
    macroUnit: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
    mealCount: { fontSize: 12, color: colors.mutetext, marginTop: -4 },
    statsRow: { flexDirection: "row", gap: 10 },
    statBox: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
    statValue: { fontSize: 26, fontWeight: "800", color: colors.accent },
    statLabel: { fontSize: 12, color: colors.text, fontWeight: "600", marginTop: 2, textAlign: "center" },
    statSub: { fontSize: 11, color: colors.mutetext, marginTop: 1 },
    lastCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: colors.accent },
    lastName: { fontSize: 17, fontWeight: "800", color: colors.text },
    lastMeta: { fontSize: 13, color: colors.mutetext, marginTop: 4 },
    exerciseTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
    exerciseTag: { backgroundColor: colors.accentSoft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    exerciseTagText: { fontSize: 12, color: colors.accent, fontWeight: "600" },
    coachCard: { backgroundColor: colors.accentSoft, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.coachBorder || "#99F6E4" },
    coachTitle: { color: colors.accent, fontSize: 12, fontWeight: "700", textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.4 },
    coachText: { color: colors.text, fontSize: 15, lineHeight: 23 },
  });
}