import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors } from "../../theme/colors";

type Props = {
  isEdit: boolean;
  loading: boolean;
  formName: string;
  formCalories: string;
  formProtein: string;
  formCarbs: string;
  formFats: string;
  formDate: string;
  onChangeName: (v: string) => void;
  onChangeCalories: (v: string) => void;
  onChangeProtein: (v: string) => void;
  onChangeCarbs: (v: string) => void;
  onChangeFats: (v: string) => void;
  onChangeDate: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MealFormScreen({
  isEdit, loading,
  formName, formCalories, formProtein, formCarbs, formFats, formDate,
  onChangeName, onChangeCalories, onChangeProtein, onChangeCarbs, onChangeFats, onChangeDate,
  onSubmit, onBack,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Pressable onPress={onBack} style={({ hovered, pressed }: any) => [styles.backBtn, (hovered || pressed) && styles.backBtnInteractive]}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{isEdit ? "Edit Meal" : "Log Meal"}</Text>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Meal Name *</Text>
          <TextInput style={styles.input} placeholder="e.g. Chicken and Rice" placeholderTextColor={colors.mutetext} value={formName} onChangeText={onChangeName} />

          <Text style={styles.fieldLabel}>Date</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.mutetext} value={formDate} onChangeText={onChangeDate} />

          <View style={styles.macroInputRow}>
            <View style={styles.macroInputField}>
              <Text style={styles.fieldLabel}>Calories</Text>
              <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formCalories} onChangeText={onChangeCalories} />
            </View>
            <View style={styles.macroInputField}>
              <Text style={styles.fieldLabel}>Protein (g)</Text>
              <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formProtein} onChangeText={onChangeProtein} />
            </View>
          </View>

          <View style={styles.macroInputRow}>
            <View style={styles.macroInputField}>
              <Text style={styles.fieldLabel}>Carbs (g)</Text>
              <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formCarbs} onChangeText={onChangeCarbs} />
            </View>
            <View style={styles.macroInputField}>
              <Text style={styles.fieldLabel}>Fats (g)</Text>
              <TextInput style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.mutetext} value={formFats} onChangeText={onChangeFats} />
            </View>
          </View>
        </View>

        <Pressable style={({ hovered, pressed }: any) => [styles.submitBtn, hovered && styles.submitBtnHover, pressed && styles.submitBtnPressed, loading && styles.submitBtnDisabled]} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>{isEdit ? "Save Changes" : "Log Meal"}</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, flexGrow: 1 },
    content: { width: "100%", maxWidth: 900, alignSelf: "center", flex: 1 },
    backBtn: { marginBottom: 12 },
    backBtnInteractive: { opacity: 0.75 },
    backBtnText: { color: colors.accent, fontSize: 15, fontWeight: "700" },
    title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 16 },
    formCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
    fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.mutetext, marginBottom: 4, marginTop: 8 },
    input: { backgroundColor: colors.bg, borderRadius: 10, padding: 12, marginBottom: 4, borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 15 },
    macroInputRow: { flexDirection: "row", gap: 10 },
    macroInputField: { flex: 1 },
    submitBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
    submitBtnHover: { opacity: 0.92 },
    submitBtnPressed: { opacity: 0.82 },
    submitBtnDisabled: { opacity: 0.7 },
    submitBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  });
}
