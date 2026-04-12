import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";
import { Meal, PROTEIN_GOAL } from "./nutritionTypes";

type Props = {
  meals: Meal[];
  loading: boolean;
  onAdd: () => void;
  onView: (m: Meal) => void;
  onEdit: (m: Meal) => void;
  onProgress: () => void;
};

function MacroPill({ label, value, unit, styles }: { label: string; value: string; unit: string; styles: any }) {
  return (
    <View style={styles.macroPill}>
      <Text style={styles.macroPillLabel}>{label}</Text>
      <Text style={styles.macroPillValue}>{value} <Text style={styles.macroPillUnit}>{unit}</Text></Text>
    </View>
  );
}

export function MealListScreen({ meals, loading, onAdd, onView, onEdit, onProgress }: Props) {
  const { width, height } = useWindowDimensions();
  const isWebLandscape = Platform.OS === "web" && width > height;
  const sideGutter = isWebLandscape ? 96 : 16;
  const contentMaxWidth = isWebLandscape ? Math.max(1200, width - sideGutter * 2) : 900;

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, sideGutter, contentMaxWidth), [colors, sideGutter, contentMaxWidth]);

  const today = new Date().toISOString().split("T")[0];
  const todaysMeals = meals.filter((m) => m.date === today);
  const totalCals = todaysMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todaysMeals.reduce((s, m) => s + m.proteinG, 0);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Nutrition</Text>
            <Text style={styles.subtitle}>Meals and macros</Text>
          </View>
          <TouchableOpacity style={styles.graphBtn} onPress={onProgress}>
            <Text style={styles.graphBtnText}>Progress</Text>
          </TouchableOpacity>
        </View>

        {todaysMeals.length > 0 && (
          <View style={styles.todaySummary}>
            <Text style={styles.todayLabel}>Today</Text>
            <View style={styles.macroRow}>
              <MacroPill label="Calories" value={`${totalCals}`} unit="kcal" styles={styles} />
              <MacroPill label="Protein" value={`${totalProtein}g`} unit={`/ ${PROTEIN_GOAL}g`} styles={styles} />
            </View>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No meals logged yet</Text>
            <Text style={styles.emptySubtext}>Tap "+ Log Meal" to get started</Text>
          </View>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemCard} onPress={() => onView(item)}>
                <View style={styles.itemCardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.meta}>{item.calories} kcal</Text>
                    <Text style={styles.metaSecondary}>
                      P {item.proteinG}g · C {item.carbsG}g · F {item.fatsG}g
                    </Text>
                    <Text style={styles.metaDate}>{item.date}</Text>
                  </View>
                  <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={onAdd}>
          <Text style={styles.fabText}>+ Log Meal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, sideGutter: number, contentMaxWidth: number) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: sideGutter, paddingTop: 8, paddingBottom: 24 },
    content: { width: "100%", maxWidth: contentMaxWidth, alignSelf: "center", flex: 1 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    title: { fontSize: 24, fontWeight: "800", color: colors.text },
    subtitle: { marginTop: 4, fontSize: 15, color: colors.mutetext },
    graphBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.accent + "40" },
    graphBtnText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
    todaySummary: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
    todayLabel: { fontSize: 12, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 },
    macroRow: { flexDirection: "row", gap: 10 },
    macroPill: { flex: 1, backgroundColor: colors.accentSoft, borderRadius: 10, padding: 10, alignItems: "center" },
    macroPillLabel: { fontSize: 11, color: colors.mutetext, fontWeight: "600", textTransform: "uppercase" },
    macroPillValue: { fontSize: 16, fontWeight: "800", color: colors.accent, marginTop: 2 },
    macroPillUnit: { fontSize: 12, fontWeight: "400", color: colors.mutetext },
    emptyState: { alignItems: "center", marginTop: 60, gap: 8 },
    emptyText: { fontSize: 18, fontWeight: "700", color: colors.text },
    emptySubtext: { fontSize: 14, color: colors.mutetext, textAlign: "center" },
    list: { gap: 14, paddingBottom: 80 },
    itemCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 18, borderLeftWidth: 4, borderLeftColor: colors.accent },
    itemCardRow: { flexDirection: "row", alignItems: "center" },
    itemTitle: { fontSize: 18, color: colors.text, fontWeight: "800" },
    meta: { fontSize: 13, color: colors.mutetext, marginTop: 4 },
    metaSecondary: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
    metaDate: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
    editBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.accent + "40" },
    editBtnText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
    fab: { position: "absolute", bottom: 16, right: 0, left: 0, backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    fabText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  });
}
