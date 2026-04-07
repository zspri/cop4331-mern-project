import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

type Props = {
    onNavigate: (screen: "login" | "register" | "forgot" | "reset") => void;
};

export function RegisterScreen({onNavigate}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>MuscleMeter+</Text>
        <Text style={styles.tagline}>Train smarter. Recover better.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Create your account</Text>

          <TextInput
            placeholder="First name"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
          />

          <TextInput
            placeholder="Last name"
            placeholderTextColor={colors.mutetext}
            style={styles.input}
          />

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

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onNavigate("login")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Already have an account? Login</Text>
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
    fontSize: 13
  }
});