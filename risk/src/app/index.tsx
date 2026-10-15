import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { colors } from "../theme/colors";

export default function WelcomeScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) router.replace("/shop");
  }, [loading, router, session]);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.topline}>
          <Text style={styles.toplineText}>RISK IT</Text>
          <Text style={styles.toplineText}>INDEPENDENT LABEL</Text>
        </View>
        <View style={styles.brand}>
          <Text style={styles.eyebrow}>DRESS LIKE YOU MEAN IT</Text>
          <Text style={styles.wordmark}>RISK IT</Text>
          <View style={styles.signature}>
            <View style={styles.rule} />
            <Text style={styles.signatureMark}>R / I</Text>
            <View style={styles.rule} />
          </View>
          <Text style={styles.tagline}>THE COURAGE TO BE DIFFERENT.</Text>
        </View>
        <View style={styles.actions}>
          <Text style={styles.intro}>Considered essentials. Made to be remembered.</Text>
          <Button label="DISCOVER THE COLLECTION" onPress={() => router.push("/signup")} />
          <Button
            label="SIGN IN"
            variant="outline"
            onPress={() => router.push("/login")}
          />
          <Text style={styles.footer}>BUILT FOR THE BOLD. WORN YOUR WAY.</Text>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 22,
  },
  topline: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: 14,
  },
  toplineText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1.6,
  },
  brand: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 36,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 3.2,
  },
  wordmark: {
    color: colors.text,
    fontSize: 62,
    fontWeight: "700",
    letterSpacing: 3,
    marginTop: 22,
    marginBottom: 25,
  },
  signature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  rule: {
    width: 34,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.accent,
  },
  signatureMark: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  tagline: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 2.3,
    marginTop: 22,
  },
  actions: {
    gap: 11,
  },
  intro: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 13,
    letterSpacing: 0.3,
  },
  footer: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: "500",
    letterSpacing: 1.7,
    textAlign: "center",
    marginTop: 10,
  },
});
