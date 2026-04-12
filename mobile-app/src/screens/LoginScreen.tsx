import React, { useMemo } from "react";
import { Pressable, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { ThemeColors } from "../theme/colors";

type Props = {
    onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
    onLoginSuccess: () => void;
}

export function LoginScreen({ onNavigate, onLoginSuccess }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>MuscleMeter+</Text>
        <Text style={styles.tagline}>Train smarter. Recover better.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.mutetext}
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            style={({ hovered, pressed }) => [
              styles.button,
              (hovered || pressed) && styles.buttonInteractive
            ]}
            onPress={onLoginSuccess}
          >
            {({ hovered, pressed }) => (
              <Text style={[styles.buttonText, (hovered || pressed) && styles.buttonTextInteractive]}>
                Login
              </Text>
            )}
          </Pressable>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onNavigate("forgot")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onNavigate("register")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      justifyContent: "center",
      alignItems: "center"
    },
    content: {
      width: "100%",
      maxWidth: 420,
      padding: 20,
      alignItems: "center"
    },
    brand: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.accent
    },
    tagline: {
      fontSize: 14,
      color: colors.mutetext,
      marginBottom: 30
    },
    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 16
    },
    input: {
      backgroundColor: colors.bg,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text
    },
    button: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8
    },
    buttonInteractive: {
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.accent
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700"
    },
    buttonTextInteractive: {
      color: colors.accent
    },
    linkButton: {
      marginTop: 12
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      fontSize: 13
    }
  });
}