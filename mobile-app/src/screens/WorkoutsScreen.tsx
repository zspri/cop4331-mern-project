import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { workouts } from "../data/seed";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

export function WorkoutsScreen() {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isWideLayout = isLandscape && width >= 900;

  const styles = useMemo(
    () =>
      createStyles(colors, {
        horizontalPadding: isWideLayout ? 26 : isLandscape ? 22 : 16,
        contentMaxWidth: isWideLayout ? 1360 : isLandscape ? 980 : 760,
        isWideLayout,
        isLandscape
      }),
    [colors, isWideLayout, isLandscape]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>Today’s training plan</Text>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={({ hovered, pressed }) => [
                styles.itemCard,
                (hovered || pressed) && styles.itemCardInteractive
              ]}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.type.toUpperCase()} • {item.durationMin} min
              </Text>
              <Text style={styles.metaSecondary}>
                Effort {item.perceivedEffort}/5
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

type LayoutConfig = {
  horizontalPadding: number;
  contentMaxWidth: number;
  isWideLayout: boolean;
  isLandscape: boolean;
};

function createStyles(colors: ThemeColors, layout: LayoutConfig) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: layout.horizontalPadding,
      paddingTop: layout.isLandscape ? 14 : 8,
      paddingBottom: 24
    },
    content: {
      width: "100%",
      maxWidth: layout.contentMaxWidth,
      alignSelf: "center"
    },
    title: {
      fontSize: layout.isWideLayout ? 32 : layout.isLandscape ? 28 : 24,
      fontWeight: "800",
      color: colors.text
    },
    subtitle: {
      marginTop: 4,
      marginBottom: 16,
      fontSize: layout.isWideLayout ? 18 : layout.isLandscape ? 16 : 15,
      color: colors.mutetext
    },
    list: {
      gap: layout.isWideLayout ? 16 : 14
    },
    itemCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingVertical: layout.isWideLayout ? 18 : 16,
      paddingHorizontal: layout.isWideLayout ? 20 : 18,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent
    },
    itemCardInteractive: {
      backgroundColor: colors.tileHover,
      borderColor: colors.accent
    },
    itemTitle: {
      fontSize: layout.isWideLayout ? 20 : 18,
      color: colors.text,
      fontWeight: "800"
    },
    meta: {
      fontSize: 13,
      color: colors.mutetext,
      marginTop: 8,
      lineHeight: 18
    },
    metaSecondary: {
      fontSize: 12,
      color: colors.mutetext,
      marginTop: 2
    }
  });
}