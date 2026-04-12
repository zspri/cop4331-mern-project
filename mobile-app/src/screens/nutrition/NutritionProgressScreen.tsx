import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";
import { Meal, PROTEIN_GOAL, CALORIES_GOAL } from "./nutritionTypes";

const BAR_MAX_HEIGHT = 120;

type WeekData = { label: string; cals: number; protein: number };

type Props = {
  meals: Meal[];
  onBack: () => void;
};

function getWeeks(meals: Meal[]): WeekData[] {
  const now = new Date();
  const weeks: WeekData[] = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const weekMeals = meals.filter((m) => {
      const d = new Date(m.date);
      return d >= weekStart && d < weekEnd;
    });
    weeks.push({
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      cals: Math.round(weekMeals.reduce((s, m) => s + m.calories, 0) / 7),
      protein: Math.round(weekMeals.reduce((s, m) => s + m.proteinG, 0) / 7),
    });
  }
  return weeks;
}

function BarChart({
  weeks,
  valueKey,
  goal,
  max,
  title,
  styles,
  colors
}: {
  weeks: WeekData[];
  valueKey: "cals" | "protein";
  goal: number;
  max: number;
  title: string;
  styles: any;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.graphCard}>
      <Text style={styles.graphTitle}>{title}</Text>
      <View style={styles.goalLabelRow}>
        <View style={styles.goalDash} />
        <Text style={styles.goalLabelText}>Goal: {goal}/day</Text>
      </View>
      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          {[max, Math.ceil(max / 2), 0].map((v, i) => (
            <Text key={i} style={styles.yLabel}>{v}</Text>
          ))}
        </View>
        <View style={styles.barsArea}>
          <View style={[styles.goalLine, { bottom: (goal / max) * BAR_MAX_HEIGHT + 24 }]} />
          <View style={styles.barsRow}>
            {weeks.map((week, idx) => {
              const count = week[valueKey];
              const barHeight = (count / max) * BAR_MAX_HEIGHT;
              const isGoalMet = count >= goal;
              return (
                <View key={idx} style={styles.barWrapper}>
                  <Text style={styles.barCount}>{count > 0 ? count : ""}</Text>
                  <View style={[styles.bar, { height: Math.max(barHeight, count > 0 ? 6 : 0), backgroundColor: isGoalMet ? colors.accent : colors.warning }]} />
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

export function NutritionProgressScreen({ meals, onBack }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const weeks = getWeeks(meals);
  const maxCals = Math.max(...weeks.map((w) => w.cals), CALORIES_GOAL, 1);
  const maxProtein = Math.max(...weeks.map((w) => w.protein), PROTEIN_GOAL, 1);
  const totalMeals = meals.length;
  const avgProtein = totalMeals > 0 ? Math.round(meals.reduce((s, m) => s + m.proteinG, 0) / totalMeals) : 0;
  const avgCals = totalMeals > 0 ? Math.round(meals.reduce((s, m) => s + m.calories, 0) / totalMeals) : 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition Progress</Text>
        <Text style={styles.subtitle}>Daily averages per week</Text>

        <BarChart weeks={weeks} valueKey="cals" goal={CALORIES_GOAL} max={maxCals} title="Avg. Daily Calories" styles={styles} colors={colors} />
        <BarChart weeks={weeks} valueKey="protein" goal={PROTEIN_GOAL} max={maxProtein} title="Avg. Daily Protein (g)" styles={styles} colors={colors} />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalMeals}</Text>
            <Text style={styles.statLabel}>Meals Logged</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{avgCals}</Text>
            <Text style={styles.statLabel}>Avg Kcal/Meal</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{avgProtein}g</Text>
            <Text style={styles.statLabel}>Avg Protein</Text>
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
    chartArea: { flexDirection: "row", height: 170, alignItems: "flex-end" },
    yAxis: { width: 36, height: 150, justifyContent: "space-between", alignItems: "flex-end", paddingRight: 4 },
    yLabel: { fontSize: 10, color: colors.mutetext },
    barsArea: { flex: 1, position: "relative", height: 150, justifyContent: "flex-end" },
    goalLine: { position: "absolute", left: 0, right: 0, height: 2, backgroundColor: colors.warning, opacity: 0.6, zIndex: 1 },
    barsRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: 150, zIndex: 2 },
    barWrapper: { alignItems: "center", flex: 1, gap: 4, justifyContent: "flex-end", paddingBottom: 24 },
    barCount: { fontSize: 10, fontWeight: "700", color: colors.text, marginBottom: 2 },
    bar: { width: 26, borderRadius: 6 },
    barLabel: { fontSize: 9, color: colors.mutetext, position: "absolute", bottom: 4 },
    legend: { flexDirection: "row", gap: 16, marginTop: 12 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: colors.mutetext },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
    statBox: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
    statValue: { fontSize: 24, fontWeight: "800", color: colors.accent },
    statLabel: { fontSize: 11, color: colors.mutetext, marginTop: 4, textAlign: "center", fontWeight: "600" },
  });
}
