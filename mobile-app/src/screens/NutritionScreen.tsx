import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { meals } from "../data/seed";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

export function NutritionScreen() {
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
        <Text style={styles.title}>Nutrition</Text>
        <Text style={styles.subtitle}>Meals and macros for today</Text>

        {meals.length === 0 ? (
          <Text style={styles.empty}>No meals logged today</Text>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemCard}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.meta}>{item.calories} kcal</Text>
                <Text style={styles.metaSecondary}>
                  P {item.proteinG}g • C {item.carbsG}g • F {item.fatsG}g
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
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
    },
    empty: {
      marginTop: 20,
      textAlign: "center",
      color: colors.mutetext,
      fontSize: 14
    }
  });
}