import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../theme/colors";
import { Meal } from "./nutritionTypes";

type Props = {
  meal: Meal;
  onBack: () => void;
  onEdit: (m: Meal) => void;
  onDelete: (m: Meal) => void;
};

function MacroCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroCardLabel}>{label}</Text>
      <Text style={styles.macroCardValue}>{value}</Text>
      {!!unit && <Text style={styles.macroCardUnit}>{unit}</Text>}
    </View>
  );
}

export function MealDetailScreen({ meal, onBack, onEdit, onDelete }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.metaDate}>{meal.date}</Text>

        <View style={styles.macroGrid}>
          <MacroCard label="Calories" value={`${meal.calories}`} unit="kcal" />
          <MacroCard label="Protein" value={`${meal.proteinG}g`} unit="" />
          <MacroCard label="Carbs" value={`${meal.carbsG}g`} unit="" />
          <MacroCard label="Fats" value={`${meal.fatsG}g`} unit="" />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editActionBtn} onPress={() => onEdit(meal)}>
            <Text style={styles.editActionText}>Edit Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteActionBtn} onPress={() => onDelete(meal)}>
            <Text style={styles.deleteActionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  content: { width: "100%", maxWidth: 760, alignSelf: "center" },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: colors.accent, fontSize: 15, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  metaDate: { fontSize: 13, color: colors.mutetext, marginTop: 4, marginBottom: 4 },
  macroGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16, marginBottom: 8 },
  macroCard: { width: "47%", backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  macroCardLabel: { fontSize: 12, fontWeight: "700", color: colors.mutetext, textTransform: "uppercase", letterSpacing: 0.4 },
  macroCardValue: { fontSize: 24, fontWeight: "800", color: colors.accent, marginTop: 4 },
  macroCardUnit: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  editActionBtn: { flex: 1, backgroundColor: colors.accentSoft, paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: colors.accent + "40" },
  editActionText: { color: colors.accent, fontWeight: "700", fontSize: 15 },
  deleteActionBtn: { backgroundColor: "#FFF1F2", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#FECDD3" },
  deleteActionText: { color: "#E11D48", fontWeight: "700", fontSize: 15 },
});
