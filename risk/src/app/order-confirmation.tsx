import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { colors } from "../theme/colors";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>ORDER RECEIVED</Text>
          <Text style={styles.mark}>✓</Text>
          <Text style={styles.title}>That’s a good move.</Text>
          <Text style={styles.copy}>
            Your order has been recorded. Payment has not been collected; we’ll need to connect a
            payment provider before this shop can take payment.
          </Text>
          {orderId ? (
            <View style={styles.reference}>
              <Text style={styles.referenceLabel}>ORDER REFERENCE</Text>
              <Text selectable style={styles.referenceValue}>{orderId}</Text>
            </View>
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
  home: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1, textAlign: "center" },
});