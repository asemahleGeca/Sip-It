import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, PageTitle } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useCart } from "../context/cart";
import { colors } from "../theme/colors";

const price = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export default function CartScreen() {
  const router = useRouter();
  const { items, subtotal, setQuantity, removeItem } = useCart();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>←  BACK TO SHOP</Text>
          </Pressable>
          <PageTitle eyebrow="YOUR PICKS" title="The bag." />
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Your bag is taking a breather.</Text>
              <Text style={styles.copy}>Find something that feels like you.</Text>
              <Button label="EXPLORE THE COLLECTION" onPress={() => router.replace("/shop")} />
            </View>
          ) : (
            <>
              <View style={styles.list}>
                {items.map(({ product, size, quantity }) => (
                  <View key={`${product.id}-${size}`} style={styles.line}>
                    <View style={styles.lineInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.meta}>SIZE {size} · {price(product.price)}</Text>
                      <View style={styles.quantityRow}>
                        <Pressable
                          accessibilityLabel={`Decrease ${product.name} quantity`}
                          onPress={() => setQuantity(product.id, size, quantity - 1)}
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityText}>−</Text>
                        </Pressable>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <Pressable
                          accessibilityLabel={`Increase ${product.name} quantity`}
                          disabled={quantity >= product.stock}
                          onPress={() => setQuantity(product.id, size, quantity + 1)}
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityText}>+</Text>
                        </Pressable>
                        <Pressable onPress={() => removeItem(product.id, size)}>
                          <Text style={styles.remove}>REMOVE</Text>
                        </Pressable>
                      </View>
                    </View>
                    <Text style={styles.lineTotal}>{price(product.price * quantity)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>SUBTOTAL</Text>
                  <Text style={styles.summaryValue}>{price(subtotal)}</Text>
                </View>
                <Text style={styles.shippingNote}>Shipping and taxes are calculated at checkout.</Text>
                <Button label="CONTINUE TO CHECKOUT" onPress={() => router.push("/checkout")} />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flexGrow: 1, padding: 22, paddingTop: 18 },
  back: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 28 },
  empty: { flex: 1, justifyContent: "center", gap: 14, paddingBottom: 80 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  list: { borderTopWidth: 1, borderTopColor: colors.border },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineInfo: { flex: 1, gap: 8 },
  productName: { color: colors.text, fontSize: 15, fontWeight: "700" },
  meta: { color: colors.muted, fontSize: 12 },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  quantityButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityText: { color: colors.text, fontSize: 17 },
  quantity: { minWidth: 14, color: colors.text, textAlign: "center" },
  remove: { color: colors.muted, fontSize: 9, fontWeight: "700", letterSpacing: 0.7 },
  lineTotal: { color: colors.text, fontSize: 13, fontWeight: "600" },
  summary: { gap: 15, paddingTop: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { color: colors.muted, fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  summaryValue: { color: colors.text, fontSize: 17, fontWeight: "700" },
  shippingNote: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});