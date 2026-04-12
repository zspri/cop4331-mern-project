import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { workouts } from "../data/seed";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

export function WorkoutsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
            <TouchableOpacity style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.type.toUpperCase()} • {item.durationMin} min
              </Text>
              <Text style={styles.metaSecondary}>
                Effort {item.perceivedEffort}/5
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24
    },
    content: {
      width: "100%",
      maxWidth: 760,
      alignSelf: "center"
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text
    },
    subtitle: {
      marginTop: 4,
      marginBottom: 16,
      fontSize: 15,
      color: colors.mutetext
    },
    list: {
      gap: 14
    },
    itemCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent
    },
    itemTitle: {
      fontSize: 18,
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