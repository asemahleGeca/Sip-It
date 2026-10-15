import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field, PageTitle } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { supabase } from "../lib/supabaseClient";
import { colors } from "../theme/colors";

const price = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export default function CheckoutScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const metadataName = session.user.user_metadata.full_name;
    setFullName(typeof metadataName === "string" ? metadataName : "");
    setEmail(session.user.email ?? "");
  }, [session]);

  async function placeOrder() {
    setError("");
    if (!session) {
      setError("Sign in to place your order.");
      return;
    }
    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() ||
      !region.trim() || !postalCode.trim() || !country.trim()) {
      setError("Complete every delivery detail before placing your order.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: orderError } = await supabase.rpc("place_order", {
        p_items: items.map(({ product, size, quantity }) => ({
          product_id: product.id,
          size,
          quantity,
        })),
        p_shipping_address: {
          full_name: fullName.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          region: region.trim(),
          postal_code: postalCode.trim(),
          country: country.trim(),
        },
      });
      if (orderError) throw orderError;
      if (typeof data !== "string") {
        throw new Error("The order was submitted but no order reference was returned.");
      }
      clearCart();
      router.replace({ pathname: "/order-confirmation", params: { orderId: data } });
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : "Could not place your order.");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gate}>
            <PageTitle eyebrow="CHECKOUT" title="Sign in to continue." />
            <Text style={styles.copy}>Your bag is saved while you sign in.</Text>
            <Link href="/login" style={styles.link}>Sign in to your account</Link>
            <Link href="/signup" style={styles.link}>Create an account</Link>
          </View>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  if (items.length === 0) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gate}>
            <PageTitle eyebrow="CHECKOUT" title="Your bag is empty." />
            <Button label="BACK TO THE COLLECTION" onPress={() => router.replace("/shop")} />
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
            <Text style={styles.back} onPress={() => router.back()}>←  BACK TO BAG</Text>
            <PageTitle eyebrow="STEP 03 / DELIVERY" title="Make it yours." />
            <Text style={styles.copy}>Where should we send your RISK IT gear?</Text>
            <View style={styles.form}>
              <Field label="FULL NAME" value={fullName} onChangeText={setFullName} autoComplete="name" />
              <Field
                label="EMAIL"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <Field
                label="STREET ADDRESS"
                value={address}
                onChangeText={setAddress}
                autoComplete="street-address"
              />
              <Field label="CITY" value={city} onChangeText={setCity} />
              <View style={styles.split}>
                <View style={styles.half}>
                  <Field label="STATE / REGION" value={region} onChangeText={setRegion} />
                </View>
                <View style={styles.half}>
                  <Field
                    label="POSTAL CODE"
                    value={postalCode}
                    onChangeText={setPostalCode}
                    autoComplete="postal-code"
                  />
                </View>
              </View>
              <Field label="COUNTRY" value={country} onChangeText={setCountry} autoComplete="country" />
            </View>
            <View style={styles.orderSummary}>
              <Text style={styles.summaryLabel}>ORDER TOTAL</Text>
              <Text style={styles.total}>{price(subtotal)}</Text>
              <Text style={styles.smallPrint}>
                Shipping and applicable taxes are not included. Payment is not collected in this checkout.
              </Text>
            </View>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Button
              label="PLACE ORDER"
              onPress={() => void placeOrder()}
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flexGrow: 1, padding: 22, paddingTop: 18, paddingBottom: 34 },
  gate: { flex: 1, justifyContent: "center", gap: 15, padding: 24 },
  back: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 28 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 20 },
  form: { gap: 15 },
  split: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  orderSummary: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 24, paddingTop: 18, gap: 8 },
  summaryLabel: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1.3 },
  total: { color: colors.text, fontSize: 23, fontWeight: "800" },
  smallPrint: { color: colors.muted, fontSize: 11, lineHeight: 17 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19, marginVertical: 14 },
  link: { color: colors.accent, fontSize: 14, fontWeight: "700" },
});