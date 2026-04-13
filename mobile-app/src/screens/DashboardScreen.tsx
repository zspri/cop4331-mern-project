import React, { useEffect, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors, ThemeMode } from "../theme/colors";
import { resolveApiEndpoint } from "src/config/api";

const WORKOUT_GOAL = 3;
const PROTEIN_GOAL = 150;
const CALORIE_GOAL = 2500;
const EXERCISE_GOAL = 15;

type Props = {
  currentUser?: any;
  token?: string | null;
  onLogout?: () => void;
  mode: ThemeMode;
  onToggleTheme: () => void;
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

export function DashboardScreen({ currentUser, token, onLogout, mode, onToggleTheme }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const sideGutter = isLandscape ? 96 : 16;
  const contentMaxWidth = isLandscape ? Math.max(1200, width - sideGutter * 2) : 900;

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, sideGutter, contentMaxWidth), [colors, sideGutter, contentMaxWidth]);

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetch(resolveApiEndpoint('/workouts'), { headers: authHeader(token) }).then((r) => r.json()),
      fetch(resolveApiEndpoint('/meals'), { headers: authHeader(token) }).then((r) => r.json()),
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
      <Pressable style={({ hovered, pressed }: any) => [styles.statBox, (hovered || pressed) && styles.infoTileInteractive]}>
        {({ hovered, pressed }: any) => {
          const invert = hovered || pressed;
          return (
            <>
              <Text style={[styles.statValue, invert && styles.infoValueInteractive]}>{value}</Text>
              <Text style={[styles.statLabel, invert && styles.infoTextInteractive]}>{label}</Text>
              {sub ? <Text style={[styles.statSub, invert && styles.infoTextInteractive]}>{sub}</Text> : null}
            </>
          );
        }}
      </Pressable>
    );
  }

  function SectionHeader({ title }: { title: string }) {
    return <Text style={styles.sectionLabel}>{title}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.header}>Welcome back, {displayName}</Text>
            <Text style={styles.subheader}>Here's your daily summary</Text>
          </View>
          <View style={styles.headerActionsRow}>
            <Pressable style={({ hovered, pressed }: any) => [styles.logoutButton, (hovered || pressed) && styles.logoutButtonInteractive]} onPress={onToggleTheme}>
              <Ionicons
                name={mode === "light" ? "sunny-outline" : "moon-outline"}
                size={20}
                color={colors.accent}
                style={styles.modeIcon}
              />
            </Pressable>
            {onLogout && (
              <Pressable style={({ hovered, pressed }: any) => [styles.logoutButton, (hovered || pressed) && styles.logoutButtonInteractive]} onPress={onLogout}>
                {({ hovered, pressed }: any) => (
                  <Text style={[styles.logoutText, (hovered || pressed) && styles.logoutTextInteractive]}>Logout</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 32 }} />
        ) : (
          <>
            <Pressable style={({ hovered, pressed }: any) => [styles.weekCard, (hovered || pressed) && styles.infoTileInteractive]}>
              {({ hovered, pressed }: any) => {
                const invert = hovered || pressed;
                return (
                  <>
                    <Text style={[styles.weekCardTitle, invert && styles.infoTextInteractive]}>This Week's Progress</Text>
                    <View style={styles.weekRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.weekMetric, invert && styles.infoTextInteractive]}>
                          {workoutsThisWeek} <Text style={[styles.weekGoal, invert && styles.infoTextInteractive]}>/ {WORKOUT_GOAL} workouts</Text>
                        </Text>
                        <ProgressBar value={workoutsThisWeek} max={WORKOUT_GOAL} color={colors.accent} themeColors={colors} />
                      </View>
                      <View style={[styles.weekBadge, invert && styles.infoBadgeInteractive]}>
                        <Text style={[styles.weekPct, invert && styles.infoValueInteractive]}>{weekWorkoutPct}%</Text>
                      </View>
                    </View>
                    <View style={[styles.weekRow, { marginTop: 12 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.weekMetric, invert && styles.infoTextInteractive]}>
                          {exercisesThisWeek} <Text style={[styles.weekGoal, invert && styles.infoTextInteractive]}>/ {EXERCISE_GOAL} exercises</Text>
                        </Text>
                        <ProgressBar value={exercisesThisWeek} max={EXERCISE_GOAL} color={colors.warning} themeColors={colors} />
                      </View>
                    </View>
                  </>
                );
              }}
            </Pressable>

            <SectionHeader title="Today's Nutrition" />

            {todaysMeals.length === 0 ? (
              <Pressable style={({ hovered, pressed }: any) => [styles.emptyCard, (hovered || pressed) && styles.infoTileInteractive]}>
                {({ hovered, pressed }: any) => {
                  const invert = hovered || pressed;
                  return (
                    <>
                      <Text style={[styles.emptyText, invert && styles.infoTextInteractive]}>No meals logged today</Text>
                      <Text style={[styles.emptySub, invert && styles.infoTextInteractive]}>Head to the Nutrition tab to track your macros</Text>
                    </>
                  );
                }}
              </Pressable>
            ) : (
              <>
                <View style={styles.macroRow}>
                  <Pressable style={({ hovered, pressed }: any) => [styles.macroBig, { flex: 2 }, (hovered || pressed) && styles.infoTileInteractive]}>
                    {({ hovered, pressed }: any) => {
                      const invert = hovered || pressed;
                      return (
                        <>
                          <Text style={[styles.macroLabel, invert && styles.infoTextInteractive]}>Calories</Text>
                          <Text style={[styles.macroBigVal, invert && styles.infoValueInteractive]}>{calsToday}</Text>
                          <Text style={[styles.macroUnit, invert && styles.infoTextInteractive]}>/ {CALORIE_GOAL} kcal</Text>
                          <ProgressBar value={calsToday} max={CALORIE_GOAL} color={invert ? "#fff" : colors.accent} themeColors={colors} />
                        </>
                      );
                    }}
                  </Pressable>
                  <View style={{ flex: 1, gap: 8 }}>
                    <Pressable style={({ hovered, pressed }: any) => [styles.macroSmall, (hovered || pressed) && styles.infoTileInteractive]}>
                      {({ hovered, pressed }: any) => {
                        const invert = hovered || pressed;
                        return (
                          <>
                            <Text style={[styles.macroLabel, invert && styles.infoTextInteractive]}>Protein</Text>
                            <Text style={[styles.macroSmallVal, invert && styles.infoValueInteractive]}>{proteinToday}g</Text>
                            <ProgressBar value={proteinToday} max={PROTEIN_GOAL} color={invert ? "#fff" : "#8B5CF6"} themeColors={colors} />
                          </>
                        );
                      }}
                    </Pressable>
                    <Pressable style={({ hovered, pressed }: any) => [styles.macroSmall, (hovered || pressed) && styles.infoTileInteractive]}>
                      {({ hovered, pressed }: any) => {
                        const invert = hovered || pressed;
                        return (
                          <>
                            <Text style={[styles.macroLabel, invert && styles.infoTextInteractive]}>Carbs</Text>
                            <Text style={[styles.macroSmallVal, invert && styles.infoValueInteractive]}>{carbsToday}g</Text>
                          </>
                        );
                      }}
                    </Pressable>
                    <Pressable style={({ hovered, pressed }: any) => [styles.macroSmall, (hovered || pressed) && styles.infoTileInteractive]}>
                      {({ hovered, pressed }: any) => {
                        const invert = hovered || pressed;
                        return (
                          <>
                            <Text style={[styles.macroLabel, invert && styles.infoTextInteractive]}>Fats</Text>
                            <Text style={[styles.macroSmallVal, invert && styles.infoValueInteractive]}>{fatsToday}g</Text>
                          </>
                        );
                      }}
                    </Pressable>
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
                <Pressable style={({ hovered, pressed }: any) => [styles.lastCard, (hovered || pressed) && styles.infoTileInteractive]}>
                  {({ hovered, pressed }: any) => {
                    const invert = hovered || pressed;
                    return (
                      <>
                        <Text style={[styles.lastName, invert && styles.infoTextInteractive]}>{latestWorkout.name}</Text>
                        <Text style={[styles.lastMeta, invert && styles.infoTextInteractive]}>
                          {latestWorkout.category} · {latestWorkout.exercises?.length ?? 0} exercise{(latestWorkout.exercises?.length ?? 0) !== 1 ? "s" : ""} · {new Date(latestWorkout.createdAt).toLocaleDateString()}
                        </Text>
                        {(latestWorkout.exercises?.length ?? 0) > 0 && (
                          <View style={styles.exerciseTags}>
                            {latestWorkout.exercises.slice(0, 3).map((ex: any, i: number) => (
                              <View key={i} style={[styles.exerciseTag, invert && styles.infoBadgeInteractive]}>
                                <Text style={[styles.exerciseTagText, invert && styles.infoValueInteractive]}>{ex.exerciseName}</Text>
                              </View>
                            ))}
                            {latestWorkout.exercises.length > 3 && (
                              <View style={[styles.exerciseTag, invert && styles.infoBadgeInteractive]}>
                                <Text style={[styles.exerciseTagText, invert && styles.infoValueInteractive]}>+{latestWorkout.exercises.length - 3} more</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </>
                    );
                  }}
                </Pressable>
              </>
            )}

            <SectionHeader title="Nutrition Overview" />
            <View style={styles.statsRow}>
              <StatBox label="Meals Logged" value={`${totalMeals}`} />
              <StatBox label="Avg Calories" value={`${avgCals}`} sub="per meal" />
            </View>

            <Pressable style={({ hovered, pressed }: any) => [styles.coachCard, (hovered || pressed) && styles.infoTileInteractive]}>
              {({ hovered, pressed }: any) => {
                const invert = hovered || pressed;
                return (
                  <>
                    <Text style={[styles.coachTitle, invert && styles.infoTextInteractive]}>Coach Tip</Text>
                    <Text style={[styles.coachText, invert && styles.infoTextInteractive]}>{getCoachTip()}</Text>
                  </>
                );
              }}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors, sideGutter: number, contentMaxWidth: number) {
  return StyleSheet.create({
    container: { paddingHorizontal: sideGutter, paddingTop: 8, paddingBottom: 32, backgroundColor: colors.bg },
    content: { width: "100%", maxWidth: contentMaxWidth, alignSelf: "center", gap: 12 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    headerActionsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    header: { fontSize: 24, fontWeight: "800", color: colors.text },
    subheader: { marginTop: 4, fontSize: 15, color: colors.mutetext },
    logoutButton: { backgroundColor: colors.accentSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.accent + "40" },
    logoutButtonInteractive: { backgroundColor: colors.tileHover, borderColor: colors.accent + "55" },
    logoutText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
    logoutTextInteractive: { color: colors.accent },
    modeIcon: { lineHeight: 20 },
    infoTileInteractive: { backgroundColor: colors.tileHover, borderColor: colors.accent + "55" },
    infoTextInteractive: { color: colors.text },
    infoValueInteractive: { color: colors.accent },
    infoBadgeInteractive: { backgroundColor: colors.accentSoft, borderColor: colors.accent + "40", borderWidth: 1 },
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