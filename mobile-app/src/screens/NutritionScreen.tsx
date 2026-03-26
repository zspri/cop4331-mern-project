import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { meals } from "../data/seed";
import { colors } from "../theme/colors";

export function NutritionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.calories} kcal | P {item.proteinG}g | C {item.carbsG}g | F {item.fatsG}g
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
