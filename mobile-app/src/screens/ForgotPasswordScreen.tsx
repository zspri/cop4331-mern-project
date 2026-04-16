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
import type { ThemeColors } from "../theme/colors";

type Props = {
  onNavigate: (screen: "login" | "register" | "verify" | "forgot-password" | "reset-password") => void;
};

export function ForgotPasswordScreen({ onNavigate }: Props) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset PIN");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
          <Text style={styles.title}>Forgot Password</Text>

          {sent ? (
            <>
              <View style={styles.successBox}>
                <Text style={styles.successIcon}>✉️</Text>
                <Text style={styles.successTitle}>Check your email</Text>
                <Text style={styles.successBody}>
                  If an account exists for{" "}
                  <Text style={{ fontWeight: "700" }}>{email.trim().toLowerCase()}</Text>
                  , a 6-digit PIN has been sent.{"\n"}The PIN expires in 15 minutes.
                </Text>
                <Text style={styles.devNote}>
                  💡 Dev tip: the preview URL is printed in the{"\n"}backend console (Ethereal Mail).
                </Text>
              </View>

              <Pressable
                style={({ hovered, pressed }: any) => [
                  styles.button,
                  (hovered || pressed) && styles.buttonInteractive
                ]}
                onPress={() => onNavigate("reset-password")}
              >
                {({ hovered, pressed }: any) => (
                  <Text
                    style={[
                      styles.buttonText,
                      mode === "light" && (hovered || pressed) && styles.buttonTextLightInteractive
                    ]}
                  >
                    Enter Reset PIN →
                  </Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Enter your account email and we'll send you a 6-digit PIN to reset your password.
              </Text>

              <TextInput
                placeholder="Email address"
                placeholderTextColor={colors.mutetext}
                style={styles.input}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (error) setError("");
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={({ hovered, pressed }: any) => [
                  styles.button,
                  (hovered || pressed) && styles.buttonInteractive,
                  loading && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {({ hovered, pressed }: any) => {
                  const isInteractive = hovered || pressed;
                  const useLightInvert = mode === "light" && isInteractive;
                  return loading ? (
                    <ActivityIndicator color={useLightInvert ? colors.accent : "#fff"} />
                  ) : (
                    <Text
                      style={[
                        styles.buttonText,
                        useLightInvert && styles.buttonTextLightInteractive
                      ]}
                    >
                      Send Reset PIN
                    </Text>
                  );
                }}
              </Pressable>
            </>
          )}

          <Pressable
            style={({ hovered, pressed }: any) => [
              styles.linkButton,
              (hovered || pressed) && styles.linkButtonInteractive
            ]}
            onPress={() => onNavigate("login")}
          >
            <Text style={styles.link}>← Back to login</Text>
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
      padding: 20,
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
    errorText: {
      color: "#DC2626",
      fontSize: 13,
      fontWeight: "600",
      marginTop: 4,
      marginBottom: 4,
      textAlign: "center"
    },
    linkButton: {
      marginTop: 14
    },
    linkButtonInteractive: {
      opacity: 0.75
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      fontSize: 13
    },
    successBox: {
      alignItems: "center",
      paddingVertical: 8,
      marginBottom: 4
    },
    successIcon: {
      fontSize: 40,
      marginBottom: 10
    },
    successTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8
    },
    successBody: {
      fontSize: 14,
      color: colors.mutetext,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 12
    },
    devNote: {
      fontSize: 12,
      color: colors.mutetext,
      textAlign: "center",
      lineHeight: 18,
      opacity: 0.7,
      fontStyle: "italic"
    }
  });
}
