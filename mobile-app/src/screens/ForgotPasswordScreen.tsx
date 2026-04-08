import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";

type Props = {
    onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
};

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001/api/auth' : 'http://localhost:5001/api/auth';

export function ForgotPasswordScreen({onNavigate}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link");
      }

      Alert.alert("PIN Sent", "Check your email for a 6-digit reset PIN.", [
        { text: "OK", onPress: () => onNavigate("reset") }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
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
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.description}>
            Enter your email and we’ll send you a 6-digit reset PIN.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleForgot}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset PIN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onNavigate("login")}
            activeOpacity={0.7}
          >       
            <Text style={styles.link}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  linkButton: {
    marginTop: 12
  },
  link: {
    color: colors.accent,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.85
  }
});