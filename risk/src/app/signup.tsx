import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field, PageTitle } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { colors } from "../theme/colors";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Complete each field to create your account.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const signedIn = await signUp(fullName, email.trim(), password);
      if (signedIn) {
        router.replace("/shop");
      } else {
        setNeedsEmailConfirmation(true);
      }
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Could not create account.");
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
            <PageTitle eyebrow="STEP 01 / YOUR ACCOUNT" title="Join the movement." />
            {needsEmailConfirmation ? (
              <View style={styles.notice}>
                <Text style={styles.noticeTitle}>Check your inbox</Text>
                <Text style={styles.copy}>
                  Confirm your email address, then sign in to continue to the collection.
                </Text>
                <Button label="CONTINUE TO SIGN IN" onPress={() => router.replace("/login")} />
              </View>
            ) : (
              <>
                <Text style={styles.copy}>
                  Create your account to shop the RISK IT collection.
                </Text>
                {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
                <View style={styles.form}>
                <Field
                  label="FULL NAME"
                  value={fullName}
                  onChangeText={setFullName}
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                />
                <Field
                  label="EMAIL"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                />
                <Field
                  label="PASSWORD (8+ CHARACTERS)"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  secureTextEntry
                  textContentType="newPassword"
                  returnKeyType="done"
                />
                <Field
                  label="CONFIRM PASSWORD"
                  value={confirmation}
                  onChangeText={setConfirmation}
                  autoCapitalize="none"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (password === confirmation) void handleSignup();
                    else setError("Passwords do not match.");
                  }}
                />
                {confirmation && password !== confirmation ? (
                  <Text style={styles.error}>Passwords do not match.</Text>
                ) : null}
                <Button
                  label="CREATE ACCOUNT"
                  onPress={() => {
                    if (password !== confirmation) {
                      setError("Passwords do not match.");
                      return;
                    }
                    void handleSignup();
                  }}
                  loading={loading}
                />
                </View>
                <Text style={styles.footer}>
                  Already a member?{" "}
                  <Link href="/login" style={styles.link}>Sign in</Link>
                </Text>
              </>
            )}
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
  error: { color: colors.danger, fontSize: 13, lineHeight: 19 },
  notice: { gap: 14, padding: 18, backgroundColor: colors.surface },
  noticeTitle: { color: colors.text, fontSize: 19, fontWeight: "700" },
  footer: { color: colors.muted, textAlign: "center", marginTop: 26 },
  link: { color: colors.accent, fontWeight: "700" },
});
