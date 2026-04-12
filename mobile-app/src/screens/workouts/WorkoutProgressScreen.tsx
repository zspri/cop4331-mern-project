import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";
import { Workout, authHeaders } from "./workoutTypes";

const WORKOUTS_GOAL = 3;
const EXERCISES_GOAL = 15;
const BAR_MAX_HEIGHT = 120;

type WeekData = { label: string; workoutCount: number; exerciseCount: number };

type Props = {
  workouts: Workout[];
  onBack: () => void;
  token: string | null;
};

function getWeeks(allWorkouts: Workout[]): WeekData[] {
  const now = new Date();
  const weeks: WeekData[] = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekWorkouts = allWorkouts.filter((w) => {
      const d = new Date(w.createdAt);
      return d >= weekStart && d < weekEnd;
    });

    weeks.push({
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      workoutCount: weekWorkouts.length,
      exerciseCount: weekWorkouts.reduce((sum, w) => sum + (w.exercises?.length ?? 0), 0),
    });
  }
  return weeks;
}

function BarChart({
  weeks,
  valueKey,
  goal,
  title,
  styles,
  colors
}: {
  weeks: WeekData[];
  valueKey: "workoutCount" | "exerciseCount";
  goal: number;
  title: string;
  styles: any;
  colors: ThemeColors;
}) {
  const values = weeks.map((w) => w[valueKey]);
  const maxVal = Math.max(...values, goal, 1);

  return (
    <View style={styles.graphCard}>
      <Text style={styles.graphTitle}>{title}</Text>
      <View style={styles.goalLabelRow}>
        <View style={styles.goalDash} />
        <Text style={styles.goalLabelText}>Goal: {goal}/week</Text>
      </View>
      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          {[maxVal, Math.ceil(maxVal / 2), 0].map((v, i) => (
            <Text key={i} style={styles.yLabel}>{v}</Text>
          ))}
        </View>
        <View style={styles.barsArea}>
          <View
            style={[
              styles.goalLine,
              { bottom: (goal / maxVal) * BAR_MAX_HEIGHT + 24 },
            ]}
          />
          <View style={styles.barsRow}>
            {weeks.map((week, idx) => {
              const count = week[valueKey];
              const barHeight = (count / maxVal) * BAR_MAX_HEIGHT;
              const isGoalMet = count >= goal;
              return (
                <View key={idx} style={styles.barWrapper}>
                  <Text style={styles.barCount}>{count > 0 ? count : ""}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(barHeight, count > 0 ? 6 : 0),
                        backgroundColor: isGoalMet ? colors.accent : colors.warning,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{week.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Goal met</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Below goal</Text>
        </View>
      </View>
    </View>
  );
}

export function WorkoutProgressScreen({ workouts, onBack, token }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>(workouts);

  useEffect(() => {
    if (workouts.length === 0 && token) {
      const url =
        Platform.OS === "android"
          ? "http://10.0.2.2:5001/api/workouts"
          : "http://localhost:5001/api/workouts";
      fetch(url, { headers: authHeaders(token) })
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setAllWorkouts(data); })
        .catch(() => {});
    }
  }, []);

  const weeks = getWeeks(allWorkouts);
  const totalExercises = allWorkouts.reduce((sum, w) => sum + (w.exercises?.length ?? 0), 0);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const workoutsThisWeek = allWorkouts.filter((w) => new Date(w.createdAt) >= startOfWeek).length;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Your workout and exercise trends</Text>

        <BarChart weeks={weeks} valueKey="workoutCount" goal={WORKOUTS_GOAL} title="Workouts per Week" styles={styles} colors={colors} />
        <BarChart weeks={weeks} valueKey="exerciseCount" goal={EXERCISES_GOAL} title="Exercises per Week" styles={styles} colors={colors} />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{allWorkouts.length}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{workoutsThisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalExercises}</Text>
            <Text style={styles.statLabel}>Total Exercises</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, flexGrow: 1 },
    content: { width: "100%", maxWidth: 900, alignSelf: "center", flex: 1 },
    backBtn: { marginBottom: 12 },
    backBtnText: { color: colors.accent, fontSize: 15, fontWeight: "700" },
    title: { fontSize: 24, fontWeight: "800", color: colors.text },
    subtitle: { marginTop: 4, fontSize: 15, color: colors.mutetext, marginBottom: 16 },
    graphCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
    graphTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 8 },
    goalLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    goalDash: { width: 24, height: 2, backgroundColor: colors.warning },
    goalLabelText: { fontSize: 13, color: colors.mutetext, fontWeight: "600" },
    chartArea: { flexDirection: "row", height: 180, alignItems: "flex-end" },
    yAxis: { width: 28, height: 160, justifyContent: "space-between", alignItems: "flex-end", paddingRight: 4 },
    yLabel: { fontSize: 11, color: colors.mutetext },
    barsArea: { flex: 1, position: "relative", height: 160, justifyContent: "flex-end" },
    goalLine: { position: "absolute", left: 0, right: 0, height: 2, backgroundColor: colors.warning, opacity: 0.6, zIndex: 1 },
    barsRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: 160, zIndex: 2 },
    barWrapper: { alignItems: "center", flex: 1, gap: 4, justifyContent: "flex-end", paddingBottom: 24 },
    barCount: { fontSize: 11, fontWeight: "700", color: colors.text, marginBottom: 2 },
    bar: { width: 28, borderRadius: 6 },
    barLabel: { fontSize: 10, color: colors.mutetext, position: "absolute", bottom: 4 },
    legend: { flexDirection: "row", gap: 16, marginTop: 12 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: colors.mutetext },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
    statBox: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
    statValue: { fontSize: 28, fontWeight: "800", color: colors.accent },
    statLabel: { fontSize: 12, color: colors.mutetext, marginTop: 4, textAlign: "center", fontWeight: "600" },
  });
}
