import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { AUTH_API_URL } from "../config/api";
import { apiRequest } from "../config/http";
import type { ThemeColors } from "../theme/colors";

type Props = {
  onNavigate: (screen: "login" | "register" | "verify") => void;
};

export function VerifyEmailScreen({ onNavigate }: Props) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      Alert.alert("Error", "Please enter the verification token.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest(`${AUTH_API_URL}/verify-email/${token}`, {
        method: "GET"
      });

      if (!result.ok) {
        throw new Error(result.error || "Failed to verify email");
      }

      Alert.alert("Success", "Email verified successfully! You can now log in.", [
        { text: "OK", onPress: () => onNavigate("login") }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>MuscleMeter+</Text>
        <Text style={styles.tagline}>Train smarter. Recover better.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.description}>Enter the verification token from your email.</Text>

          <TextInput
            placeholder="Verification Token"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={({ hovered, pressed }: any) => [
              styles.button,
              (hovered || pressed) && styles.buttonInteractive,
              loading && styles.buttonDisabled
            ]}
            onPress={handleVerify}
            disabled={loading}
          >
            {({ hovered, pressed }: any) => {
              const isInteractive = hovered || pressed;
              const useLightInvert = mode === "light" && isInteractive;
              return loading ? (
                <ActivityIndicator color={useLightInvert ? colors.accent : "#fff"} />
              ) : (
                <Text style={[styles.buttonText, useLightInvert && styles.buttonTextLightInteractive]}>Verify Account</Text>
              );
            }}
          </Pressable>

          <Pressable
            style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
            onPress={() => onNavigate("login")}
          >
            <Text style={styles.link}>Back to login</Text>
          </Pressable>
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
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8
    },
    description: {
      fontSize: 14,
      color: colors.mutetext,
      marginBottom: 16,
      lineHeight: 20
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
      marginTop: 12
    },
    buttonInteractive: {
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.accent
    },
    buttonDisabled: {
      opacity: 0.7
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700"
    },
    buttonTextLightInteractive: {
      color: colors.accent
    },
    linkButton: {
      marginTop: 12
    },
    linkButtonInteractive: {
      opacity: 0.75
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      fontSize: 13,
      opacity: 0.85
    }
  });
}
