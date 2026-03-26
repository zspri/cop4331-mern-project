import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { workouts } from "../data/seed";
import { colors } from "../theme/colors";

export function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workouts</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.meta}>
              {item.type.toUpperCase()} | {item.durationMin} min | Effort {item.perceivedEffort}/5
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10
  },
  list: {
    gap: 10
  },
  itemCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12
  },
  itemTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "700"
  },
  meta: {
    fontSize: 12,
    color: colors.mutetext,
    marginTop: 4
  }
});
