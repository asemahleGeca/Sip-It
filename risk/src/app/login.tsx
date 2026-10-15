import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field, PageTitle } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { colors } from "../theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/shop");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.wordmark}>RISK IT</Text>
            <PageTitle eyebrow="WELCOME BACK" title="Good to see you." />
            <Text style={styles.copy}>Sign in to pick up where you left off.</Text>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <View style={styles.form}>
              <Field
                label="EMAIL"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <Field
                label="PASSWORD"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoComplete="current-password"
                secureTextEntry
                textContentType="password"
                onSubmitEditing={() => void handleLogin()}
              />
              <Button label="SIGN IN" onPress={() => void handleLogin()} loading={loading} />
            </View>
            <Text style={styles.footer}>
              New to RISK IT?{" "}
              <Link href="/signup" style={styles.link}>Create an account</Link>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36 },
  wordmark: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 38,
  },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 22 },
  form: { gap: 17 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19, marginBottom: 18 },
  footer: { color: colors.muted, textAlign: "center", marginTop: 26 },
  link: { color: colors.accent, fontWeight: "700" },
});
