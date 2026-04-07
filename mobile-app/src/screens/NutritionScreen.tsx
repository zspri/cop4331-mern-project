import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { meals } from "../data/seed";
import { colors } from "../theme/colors";

export function NutritionScreen() {
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

const styles = StyleSheet.create({
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
    borderLeftColor: colors.accent,
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
  },
  empty: {
    marginTop: 20,
    textAlign: "center",
    color: colors.mutetext,
    fontSize: 14
  }
});