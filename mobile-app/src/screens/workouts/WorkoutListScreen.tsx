import React, { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Workout, WorkoutSubView } from "./workoutTypes";
import { useTheme } from "../../theme/ThemeContext";
import type { ThemeColors, ThemeMode } from "../../theme/colors";

type Props = {
  workouts: Workout[];
  loading: boolean;
  onAdd: () => void;
  onView: (w: Workout) => void;
  onEdit: (w: Workout) => void;
  onProgress: () => void;
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export function WorkoutListScreen({ workouts, loading, onAdd, onView, onEdit, onProgress, mode, onToggleTheme }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isMobileLandscape = Platform.OS !== "web" && isLandscape;
  const sideGutter = isLandscape ? 96 : 16;
  const contentMaxWidth = isLandscape ? Math.max(1200, width - sideGutter * 2) : 900;
  const fabBottom = isMobileLandscape ? 4 : 16;

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, sideGutter, contentMaxWidth, fabBottom), [colors, sideGutter, contentMaxWidth, fabBottom]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Workouts</Text>
            <Text style={styles.subtitle}>Your training sessions</Text>
          </View>
          <View style={styles.headerActionsRow}>
            <Pressable style={({ hovered, pressed }: any) => [styles.graphBtn, hovered && styles.graphBtnHover, pressed && styles.graphBtnPressed]} onPress={onToggleTheme}>
              <Ionicons
                name={mode === "light" ? "sunny-outline" : "moon-outline"}
                size={18}
                color={colors.accent}
                style={styles.modeIcon}
              />
            </Pressable>
            <Pressable style={({ hovered, pressed }: any) => [styles.graphBtn, hovered && styles.graphBtnHover, pressed && styles.graphBtnPressed]} onPress={onProgress}>
              {({ hovered, pressed }: any) => (
                <Text style={[styles.graphBtnText, (hovered || pressed) && styles.graphBtnTextInteractive]}>Progress</Text>
              )}
            </Pressable>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Tap "+ Add Workout" to get started</Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
               <Pressable style={({ hovered, pressed }: any) => [styles.itemCard, hovered && styles.itemCardHover, pressed && styles.itemCardPressed]} onPress={() => onView(item)}>
                {({ hovered, pressed }: any) => {
                  const invert = hovered || pressed;
                  return (
                    <View style={styles.itemCardRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.meta}>
                          {item.category} • {item.exercises.length} exercise
                          {item.exercises.length !== 1 ? "s" : ""}
                        </Text>
                        <Text style={styles.metaDate}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Pressable style={({ hovered, pressed }: any) => [styles.editBtn, hovered && styles.editBtnHover, pressed && styles.editBtnPressed]} onPress={() => onEdit(item)}>
                        {({ hovered, pressed }: any) => (
                          <Text style={[styles.editBtnText, (hovered || pressed) && styles.editBtnTextInteractive]}>Edit</Text>
                        )}
                      </Pressable>
                    </View>
                  );
                }}
              </Pressable>
            )}
          />
        )}

        <Pressable style={({ hovered, pressed }: any) => [styles.fab, hovered && styles.fabHover, pressed && styles.fabPressed, (hovered || pressed) && styles.fabInverted]} onPress={onAdd}>
          {({ hovered, pressed }: any) => (
            <Text style={[styles.fabText, (hovered || pressed) && styles.fabTextInverted]}>+ Add Workout</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, sideGutter: number, contentMaxWidth: number, fabBottom: number) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: sideGutter, paddingTop: 8, paddingBottom: 24 },
    content: { width: "100%", maxWidth: contentMaxWidth, alignSelf: "center", flex: 1 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    headerActionsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    title: { fontSize: 24, fontWeight: "800", color: colors.text },
    subtitle: { marginTop: 4, fontSize: 15, color: colors.mutetext },
    graphBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.accent + "40" },
    graphBtnHover: { backgroundColor: colors.tileHover, borderColor: colors.accent + "55" },
    graphBtnPressed: { backgroundColor: colors.tilePress, borderColor: colors.accent + "70" },
    graphBtnText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
    graphBtnTextInteractive: { color: colors.accent },
    modeIcon: { lineHeight: 18 },
    emptyState: { alignItems: "center", marginTop: 60, gap: 8 },
    emptyText: { fontSize: 18, fontWeight: "700", color: colors.text },
    emptySubtext: { fontSize: 14, color: colors.mutetext, textAlign: "center" },
    list: { gap: 14, paddingBottom: 80 },
    itemCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 18, borderLeftWidth: 4, borderLeftColor: colors.accent },
    itemCardHover: { backgroundColor: colors.tileHover, borderColor: colors.accent + "44" },
    itemCardPressed: { backgroundColor: colors.tilePress, borderColor: colors.accent + "66" },
    itemCardRow: { flexDirection: "row", alignItems: "center" },
    itemTitle: { fontSize: 18, color: colors.text, fontWeight: "800" },
    meta: { fontSize: 13, color: colors.mutetext, marginTop: 4 },
    metaDate: { fontSize: 12, color: colors.mutetext, marginTop: 2 },
    editBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.accent + "40" },
    editBtnHover: { backgroundColor: colors.tileHover, borderColor: colors.accent + "55" },
    editBtnPressed: { backgroundColor: colors.tilePress, borderColor: colors.accent + "70" },
    editBtnText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
    editBtnTextInteractive: { color: colors.accent },
    fab: { position: "absolute", bottom: fabBottom, right: 0, left: 0, backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    fabHover: { opacity: 0.96 },
    fabPressed: { opacity: 0.92 },
    fabInverted: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent },
    fabText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    fabTextInverted: { color: colors.accent },
  });
}
