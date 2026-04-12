import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { StatCard } from "../components/StatCard";
import { meals, recovery, user, workouts } from "../data/seed";
import { buildCoachTip, getReadinessScore } from "../features/recommendations";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type Props = {
  onLogout: () => void;
};

export function DashboardScreen({ onLogout }: Props) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isWideLayout = isLandscape && width >= 900;

  const horizontalPadding = isWideLayout ? 26 : isLandscape ? 22 : 16;
  const contentMaxWidth = isWideLayout ? 1360 : isLandscape ? 980 : 760;
  const contentWidth = Math.min(width - horizontalPadding * 2, contentMaxWidth);

  const boardGap = isWideLayout ? 14 : 12;
  const sideTileWidth = isWideLayout
    ? Math.max(170, (contentWidth - boardGap * 2) / 4)
    : Math.max(136, Math.min(200, (contentWidth - boardGap) / 2));
  const sideTileHeight = isWideLayout ? sideTileWidth * 0.62 : sideTileWidth;

  const centerTileWidth = sideTileWidth * 2;
  const centerTileHeight = sideTileHeight * 2 + boardGap;

  const styles = useMemo(
    () =>
      createStyles(colors, {
        horizontalPadding,
        contentMaxWidth,
        boardGap,
        sideTileWidth,
        sideTileHeight,
        centerTileWidth,
        centerTileHeight,
        isWideLayout,
        isLandscape
      }),
    [
      colors,
      horizontalPadding,
      contentMaxWidth,
      boardGap,
      sideTileWidth,
      sideTileHeight,
      centerTileWidth,
      centerTileHeight,
      isWideLayout,
      isLandscape
    ]
  );

  const today = "2026-03-26";
  const todaysWorkouts = workouts.filter((w) => w.date === today);
  const todaysMeals = meals.filter((m) => m.date === today);
  const todayRecovery = recovery.find((r) => r.date === today);

  const readiness = getReadinessScore(todayRecovery);
  const proteinToday = todaysMeals.reduce((sum, meal) => sum + meal.proteinG, 0);
  const coachTip = buildCoachTip(todaysWorkouts, todaysMeals, readiness);

  const activitySeries = useMemo(() => buildActivitySeries(today), [today]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Welcome back, {user.name}</Text>
          <Pressable
            style={({ hovered, pressed }) => [
              styles.logoutTile,
              (hovered || pressed) && styles.logoutTileInteractive
            ]}
            onPress={onLogout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
          >
            {({ hovered, pressed }) => (
              <Text style={[styles.logoutText, (hovered || pressed) && styles.logoutTextInteractive]}>
                Logout
              </Text>
            )}
          </Pressable>
        </View>
        <Text style={styles.subheader}>Daily Snapshot</Text>

        {isWideLayout ? (
          <View style={styles.wideBoard}>
            <View style={styles.sideColumn}>
              <View style={styles.sideTile}>
                <StatCard
                  square
                  label="Readiness"
                  value={`${readiness}/100`}
                  hint="Sleep + soreness + stress"
                />
              </View>

              <View style={styles.sideTile}>
                <StatCard
                  square
                  label="Workouts"
                  value={`${todaysWorkouts.length}`}
                  hint="Sessions completed today"
                />
              </View>
            </View>

            <InteractiveTile style={styles.centerTile}>
              <ActivityTile
                title="Activity"
                totalMinutes={activitySeries.totalMinutes}
                trend={activitySeries.trend}
                labels={activitySeries.labels}
                isCompact={false}
              />
            </InteractiveTile>

            <View style={styles.sideColumn}>
              <View style={styles.sideTile}>
                <StatCard
                  square
                  label="Protein"
                  value={`${proteinToday}g`}
                  hint={`Goal ${user.targetProteinG}g`}
                />
              </View>

              <InteractiveTile style={[styles.sideTile, styles.coachCard]}>
                <Text style={styles.coachTitle}>AI Coach Tip</Text>
                <Text style={styles.coachText} numberOfLines={7}>
                  {coachTip}
                </Text>
              </InteractiveTile>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              <View style={styles.tile}>
                <StatCard
                  square
                  label="Readiness"
                  value={`${readiness}/100`}
                  hint="Sleep + soreness + stress"
                />
              </View>

              <View style={styles.tile}>
                <StatCard
                  square
                  label="Workouts"
                  value={`${todaysWorkouts.length}`}
                  hint="Sessions completed today"
                />
              </View>

              <View style={styles.tile}>
                <StatCard
                  square
                  label="Protein"
                  value={`${proteinToday}g`}
                  hint={`Goal ${user.targetProteinG}g`}
                />
              </View>

              <InteractiveTile style={[styles.tile, styles.coachCard]}>
                <Text style={styles.coachTitle}>AI Coach Tip</Text>
                <Text style={styles.coachText} numberOfLines={5}>
                  {coachTip}
                </Text>
              </InteractiveTile>
            </View>

            <InteractiveTile style={styles.activityTileCompact}>
              <ActivityTile
                title="Activity"
                totalMinutes={activitySeries.totalMinutes}
                trend={activitySeries.trend}
                labels={activitySeries.labels}
                isCompact
              />
            </InteractiveTile>
          </>
        )}
      </View>
    </ScrollView>
  );
}

type InteractiveTileProps = {
  style: any;
  children: React.ReactNode;
};

function InteractiveTile({ style, children }: InteractiveTileProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createInteractiveStyles(colors), [colors]);
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [style, (hovered || pressed) && styles.active]}
    >
      {children}
    </Pressable>
  );
}

type ActivityTileProps = {
  title: string;
  totalMinutes: number;
  trend: string;
  labels: string[];
  isCompact: boolean;
};

function ActivityTile({ title, totalMinutes, trend, labels, isCompact }: ActivityTileProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createActivityStyles(colors, isCompact), [colors, isCompact]);

  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.kicker}>{title}</Text>
        <Text style={styles.value}>{totalMinutes} min</Text>
        <Text style={styles.subtext}>7-day trend</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.sparkline}>{trend}</Text>
        <View style={styles.labelsRow}>
          {labels.map((label, index) => (
            <Text key={`${label}-${index}`} style={styles.dayLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

type LayoutConfig = {
  horizontalPadding: number;
  contentMaxWidth: number;
  boardGap: number;
  sideTileWidth: number;
  sideTileHeight: number;
  centerTileWidth: number;
  centerTileHeight: number;
  isWideLayout: boolean;
  isLandscape: boolean;
};

function createStyles(colors: ThemeColors, layout: LayoutConfig) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: layout.horizontalPadding,
      paddingTop: layout.isLandscape ? 14 : 8,
      paddingBottom: 24,
      backgroundColor: colors.bg
    },
    content: {
      width: "100%",
      maxWidth: layout.contentMaxWidth,
      alignSelf: "center",
      gap: 12
    },
    header: {
      marginTop: 0,
      fontSize: layout.isWideLayout ? 32 : layout.isLandscape ? 28 : 24,
      fontWeight: "800",
      color: colors.text,
      flexShrink: 1,
      paddingRight: 12
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: layout.isLandscape ? 0 : 8
    },
    subheader: {
      marginTop: -4,
      fontSize: layout.isWideLayout ? 18 : layout.isLandscape ? 16 : 15,
      color: colors.mutetext
    },
    logoutTile: {
      width: layout.isWideLayout ? 78 : 70,
      height: layout.isWideLayout ? 39 : 35,
      borderRadius: 14,
      backgroundColor: colors.toggleBg,
      borderWidth: 1,
      borderColor: colors.toggleBorder,
      alignItems: "center",
      justifyContent: "center"
    },
    logoutTileInteractive: {
      backgroundColor: colors.tileHover,
      borderColor: colors.accent
    },
    logoutText: {
      color: colors.toggleBorder,
      fontWeight: "700",
      fontSize: layout.isWideLayout ? 14 : 13
    },
    logoutTextInteractive: {
      color: colors.toggleBorder
    },
    wideBoard: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
      columnGap: layout.boardGap,
      marginTop: 2
    },
    sideColumn: {
      rowGap: layout.boardGap
    },
    sideTile: {
      width: layout.sideTileWidth,
      height: layout.sideTileHeight
    },
    centerTile: {
      width: layout.centerTileWidth,
      height: layout.centerTileHeight,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 18
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      rowGap: layout.boardGap,
      columnGap: layout.boardGap
    },
    tile: {
      width: layout.sideTileWidth,
      aspectRatio: 1
    },
    activityTileCompact: {
      marginTop: 2,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 18,
      minHeight: 210
    },
    coachCard: {
      backgroundColor: colors.accentSoft,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.coachBorder,
      justifyContent: "space-between"
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
      fontSize: layout.isWideLayout ? 16 : 15,
      lineHeight: layout.isWideLayout ? 24 : 22
    }
  });
}

function createActivityStyles(colors: ThemeColors, isCompact: boolean) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      justifyContent: "space-between"
    },
    kicker: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5
    },
    value: {
      marginTop: 6,
      color: colors.text,
      fontSize: isCompact ? 30 : 40,
      fontWeight: "800"
    },
    subtext: {
      marginTop: 2,
      color: colors.mutetext,
      fontSize: isCompact ? 14 : 15
    },
    chartCard: {
      marginTop: 6,
      flex: 1,
      backgroundColor: colors.accentSoft,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.coachBorder,
      paddingVertical: isCompact ? 14 : 18,
      paddingHorizontal: isCompact ? 14 : 18,
      justifyContent: "space-between",
      gap: 10
    },
    sparkline: {
      color: colors.accent,
      fontSize: isCompact ? 34 : 46,
      letterSpacing: 3,
      textAlign: "center"
    },
    labelsRow: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    dayLabel: {
      color: colors.mutetext,
      fontSize: 12,
      fontWeight: "600"
    }
  });
}

function createInteractiveStyles(colors: ThemeColors) {
  return StyleSheet.create({
    active: {
      backgroundColor: colors.tileHover,
      borderColor: colors.accent
    }
  });
}

function buildActivitySeries(today: string) {
  const anchor = new Date(`${today}T12:00:00`);

  const values = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - (6 - index));
    const dayKey = d.toISOString().slice(0, 10);

    return workouts
      .filter((workout) => workout.date === dayKey)
      .reduce((sum, workout) => sum + workout.durationMin, 0);
  });

  const labels = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - (6 - index));
    return WEEKDAY_LABELS[d.getDay()];
  });

  return {
    values,
    labels,
    trend: toSparkline(values),
    totalMinutes: values.reduce((sum, v) => sum + v, 0)
  };
}

function toSparkline(values: number[]) {
  const ticks = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const max = Math.max(...values, 1);

  return values
    .map((value) => {
      const index = Math.min(ticks.length - 1, Math.floor((value / max) * (ticks.length - 1)));
      return ticks[index];
    })
    .join(" ");
}
