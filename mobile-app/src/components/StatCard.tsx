import React, { useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

type Props = {
  label: string;
  value: string;
  hint?: string;
  square?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function StatCard({ label, value, hint, square = false, containerStyle }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.card, square && styles.cardSquare, containerStyle]}>
      <Text style={[styles.label, square && styles.labelSquare]}>{label}</Text>
      <Text style={[styles.value, square && styles.valueSquare]}>{value}</Text>
      {hint ? <Text style={[styles.hint, square && styles.hintSquare]}>{hint}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6
    },
    cardSquare: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 18,
      paddingHorizontal: 16
    },
    label: {
      color: colors.mutetext,
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.6
    },
    labelSquare: {
      fontSize: 13
    },
    value: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "800",
      lineHeight: 28
    },
    valueSquare: {
      fontSize: 30,
      lineHeight: 34
    },
    hint: {
      color: colors.mutetext,
      fontSize: 13,
      lineHeight: 18
    },
    hintSquare: {
      fontSize: 14,
      lineHeight: 19
    }
  });
}