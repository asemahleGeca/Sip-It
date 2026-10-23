import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field, PageTitle } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { supabase } from "../lib/supabaseClient";
import type { OrderTracking } from "../models/order";
import { formatOrderNumber, parseOrderNumber } from "../models/order";
import { colors } from "../theme/colors";

export default function TrackOrderScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { orderNumber: initialOrderNumber } = useLocalSearchParams<{ orderNumber?: string }>();
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber ?? "");
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialOrderNumber) return;
    setOrderNumber(initialOrderNumber);
    void trackOrder(initialOrderNumber);
  }, [initialOrderNumber]);

  const formattedInput = useMemo(() => orderNumber.trim(), [orderNumber]);

  async function trackOrder(value: string) {
    if (!session) {
      setError("Sign in to track your orders.");
      return;
    }

    const parsedOrderNumber = parseOrderNumber(value);
    if (!parsedOrderNumber) {
      setError("Enter a valid order number, for example RI-000123.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("user_id", session.user.id)
        .eq("order_number", parsedOrderNumber)
        .maybeSingle();

      if (queryError) throw queryError;
      if (!data) {
        setTracking(null);
        setError("We couldn't find that order on your account.");
        return;
      }

      setTracking(data);
    } catch (trackError) {
      setTracking(null);
      setError(trackError instanceof Error ? trackError.message : "Could not find your order.");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gate}>
            <PageTitle eyebrow="TRACK ORDER" title="Sign in to continue." />
            <Text style={styles.copy}>Use your order number to check the status of a recent purchase.</Text>
            <Button label="GO TO LOGIN" onPress={() => router.replace("/login")} />
            <Button label="CREATE ACCOUNT" variant="outline" onPress={() => router.replace("/signup")} />
          </View>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.back} onPress={() => router.back()}>←  BACK</Text>
            <PageTitle eyebrow="TRACK ORDER" title="Follow your delivery." />
            <Text style={styles.copy}>Enter your order number to see its current status.</Text>
            <Field
              label="ORDER NUMBER"
              value={orderNumber}
              onChangeText={setOrderNumber}
              autoCapitalize="characters"
              placeholder="RI-000123"
            />
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Button
              label="CHECK STATUS"
              loading={loading}
              onPress={() => void trackOrder(formattedInput)}
            />
            {tracking ? (
              <View style={styles.result}>
                <Text style={styles.resultLabel}>ORDER NUMBER</Text>
                <Text style={styles.resultValue}>{formatOrderNumber(tracking.order_number)}</Text>
                <Text style={styles.resultLabel}>STATUS</Text>
                <Text style={styles.resultStatus}>{tracking.status.replaceAll("_", " ").toUpperCase()}</Text>
                <Text style={styles.resultLabel}>TOTAL</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tracking.total)}
                </Text>
                <Text style={styles.resultLabel}>PLACED</Text>
                <Text style={styles.resultValue}>
                  {new Date(tracking.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flexGrow: 1, padding: 22, paddingTop: 18, paddingBottom: 40 },
  gate: { flex: 1, justifyContent: "center", gap: 16, padding: 24 },
  back: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 20 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 20 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19, marginVertical: 12 },
  result: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
  },
  resultLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.3 },
  resultValue: { color: colors.text, fontSize: 16, fontWeight: "700" },
  resultStatus: { color: colors.accent, fontSize: 16, fontWeight: "800", letterSpacing: 0.8 },
});
