import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { AUTH_API_URL } from "../config/api";
import { apiRequest } from "../config/http";
import type { ThemeColors } from "../theme/colors";

type Props = {
  onNavigate: (screen: "login" | "register" | "verify" | "forgot-password" | "reset-password") => void;
  onLoginSuccess: (user: any, token: string) => void;
};

export function LoginScreen({ onNavigate, onLoginSuccess }: Props) {
  const { colors, mode } = useTheme();
  const { width, height } = useWindowDimensions();
  const isWideLayout = width >= 900;
  const isMobileLandscape = Platform.OS !== "web" && width > height;
  const isMobilePortrait = Platform.OS !== "web" && height >= width;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const styles = useMemo(
    () => createStyles(colors, isWideLayout, isMobileLandscape, isMobilePortrait),
    [colors, isWideLayout, isMobileLandscape, isMobilePortrait]
  );

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Invalid Email or Password");
      return;
    }

    setLoginError("");
    setLoading(true);
    try {
      const result = await apiRequest<{ user: any; token: string; error?: string }>(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!result.ok) {
        const errorMessage = result.error || "Login failed";
        if (result.status === 403 || errorMessage.toLowerCase().includes("verify")) {
          setUnverifiedEmail(email);
          throw new Error("Please verify your email before logging in.");
        }
        throw new Error(errorMessage);
      }

      Alert.alert("Success", "Logged in successfully!");
      onLoginSuccess(result.data!.user, result.data!.token);
    } catch (error: any) {
      setLoginError(error.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    try {
      const result = await apiRequest(`${AUTH_API_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail })
      });
      if (!result.ok) throw new Error(result.error || "Failed to resend verification email");
      Alert.alert("Sent", "A new verification email has been sent. Please check your inbox.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend the verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isWideLayout ? (
          <View style={styles.heroPane}>
            <Text style={styles.heroBrand}>MuscleMeter+</Text>
            <Text style={styles.heroTagline}>Train smarter. Recover better.</Text>
          </View>
        ) : (
          <View style={styles.heroCompact}>
            <Text style={styles.brand}>MuscleMeter+</Text>
            <Text style={styles.tagline}>Train smarter. Recover better.</Text>
          </View>
        )}

        <View style={styles.formPane}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.mutetext}
              style={styles.input}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (loginError) setLoginError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.mutetext}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (loginError) setLoginError("");
              }}
            />

            <Pressable
              style={({ hovered, pressed }: any) => [
                styles.button,
                (hovered || pressed) && styles.buttonInteractive,
                loading && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {({ hovered, pressed }: any) => {
                const isInteractive = hovered || pressed;
                const useLightInvert = mode === "light" && isInteractive;
                return loading ? (
                  <ActivityIndicator color={useLightInvert ? colors.accent : "#fff"} />
                ) : (
                  <Text style={[styles.buttonText, useLightInvert && styles.buttonTextLightInteractive]}>Login</Text>
                );
              }}
            </Pressable>

            {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}
            {!!unverifiedEmail && (
              <Pressable
                style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
                onPress={handleResendVerification}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <ActivityIndicator color={colors.accent} size="small" />
                ) : (
                  <Text style={[styles.link, { fontWeight: "700" }]}>Resend Verification Email</Text>
                )}
              </Pressable>
            )}

            <Pressable
              style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
              onPress={() => onNavigate("forgot-password")}
            >
              <Text style={styles.link}>Forgot your password?</Text>
            </Pressable>

            <Pressable
              style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
              onPress={() => onNavigate("register")}
            >
              <Text style={styles.link}>Don't have an account? Register</Text>
            </Pressable>

            <Pressable
              style={({ hovered, pressed }: any) => [styles.linkButton, (hovered || pressed) && styles.linkButtonInteractive]}
              onPress={() => onNavigate("verify")}
            >
              <Text style={styles.link}>Have a verification token? Verify Email</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function createStyles(
  colors: ThemeColors,
  isWideLayout: boolean,
  isMobileLandscape: boolean,
  isMobilePortrait: boolean
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      justifyContent: "center",
      alignItems: "center"
    },
    content: {
      width: "100%",
      maxWidth: isWideLayout ? 1180 : 420,
      paddingHorizontal: 20,
      paddingVertical: isWideLayout ? 28 : 20,
      flexDirection: isWideLayout ? "row" : "column",
      alignItems: isWideLayout ? "stretch" : "center",
      columnGap: isWideLayout ? 28 : 0
    },
    heroPane: {
      flex: 1,
      justifyContent: "center",
      paddingRight: 14
    },
    heroCompact: {
      alignItems: "center"
    },
    formPane: {
      width: isWideLayout ? 430 : "100%",
      justifyContent: "center"
    },
    brand: {
      fontSize: isMobilePortrait ? 50 : 28,
      fontWeight: "800",
      color: colors.accent
    },
    heroBrand: {
      fontSize: isMobileLandscape ? 55 : 84,
      fontWeight: "900",
      color: colors.accent,
      letterSpacing: -0.7
    },
    heroTagline: {
      marginTop: 8,
      fontSize: isMobileLandscape ? 27 : 42,
      color: colors.mutetext
    },
    tagline: {
      fontSize: isMobilePortrait ? 25 : 14,
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
      marginTop: 8,
      color: "#DC2626",
      fontSize: 13,
      fontWeight: "600",
      textAlign: "center"
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
      fontSize: 13
    }
  });
}