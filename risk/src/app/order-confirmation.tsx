import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton, Button } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { supabase } from "../lib/supabaseClient";
import type { OrderTracking } from "../models/order";
import { formatOrderNumber } from "../models/order";
import { colors } from "../theme/colors";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { session } = useAuth();
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !session) return;
    const currentOrderId = orderId;
    let active = true;

    async function loadOrder() {
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("id", currentOrderId)
        .maybeSingle();

      if (!active) return;
      if (queryError) setError(queryError.message);
      else if (data) setOrder(data);
      else setError("We couldn't find this order. Check your order history or try tracking it.");
    }

    void loadOrder().catch((loadError: unknown) => {
      if (active) {
        setError(loadError instanceof Error ? loadError.message : "Could not load your order.");
      }
    });
    return () => {
      active = false;
    };
  }, [orderId, session]);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <BackButton label="BACK TO SHOP" fallback="/shop" />
          <Text style={styles.eyebrow}>ORDER RECEIVED</Text>
          <Text style={styles.mark}>✓</Text>
          <Text style={styles.title}>That’s a good move.</Text>
          <Text style={styles.copy}>
            Your order has been recorded. Payment has not been collected; we’ll need to connect a
            payment provider before this shop can take payment.
          </Text>
          {order ? (
            <View style={styles.reference}>
              <Text style={styles.referenceLabel}>ORDER NUMBER</Text>
              <Text selectable style={styles.referenceValue}>
                {formatOrderNumber(order.order_number)}
              </Text>
              <Text style={styles.status}>STATUS · {order.status.replaceAll("_", " ").toUpperCase()}</Text>
            </View>
          ) : null}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {order ? (
            <Button
              label="TRACK THIS ORDER"
              variant="outline"
              onPress={() => router.push({
                pathname: "/track-order",
                params: { orderNumber: formatOrderNumber(order.order_number) },
              })}
            />
          ) : null}
          <Button label="BACK TO THE COLLECTION" onPress={() => router.replace("/shop")} />
          <Pressable onPress={() => router.replace("/")}>
            <Text style={styles.home}>BACK TO HOME</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: "center", backgroundColor: "transparent" },
  content: { gap: 18, padding: 28 },
  eyebrow: { color: colors.accent, fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  mark: { color: colors.accent, fontSize: 48, fontWeight: "300" },
  title: { color: colors.text, fontSize: 31, fontWeight: "800", letterSpacing: -1 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  reference: { gap: 7, borderWidth: 1, borderColor: colors.border, padding: 14 },
  referenceLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.4 },
  referenceValue: { color: colors.text, fontSize: 12 },
  status: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 0.7 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19 },
  home: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1, textAlign: "center" },
});