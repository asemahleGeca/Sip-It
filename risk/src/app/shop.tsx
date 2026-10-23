import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, PageTitle } from "../components/shop-ui";
import { ScreenBackground } from "../components/screen-background";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../models/product";
import { colors } from "../theme/colors";

const price = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export default function ShopScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const { itemCount, addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      let active = true;
      setLoading(true);
      setError("");
      const loadProducts = async () => {
        try {
          const { data, error: queryError } = await supabase
            .from("products")
            .select("id, name, slug, description, price, image_url, category, sizes, stock")
            .eq("active", true)
            .order("created_at", { ascending: false });
          if (!active) return;
          if (queryError) setError(queryError.message);
          else setProducts(data ?? []);
        } catch (loadError) {
          if (active) {
            setError(loadError instanceof Error ? loadError.message : "Could not load products.");
          }
        } finally {
          if (active) setLoading(false);
        }
      };
      void loadProducts();
      return () => {
        active = false;
      };
    }, [session]),
  );

  if (!session) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.centered}>
          <PageTitle eyebrow="MEMBERS ONLY" title="Sign in to shop." />
          <Button label="CREATE ACCOUNT" onPress={() => router.replace("/signup")} />
          <Button label="SIGN IN" variant="outline" onPress={() => router.replace("/login")} />
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>RISK IT</Text>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" onPress={() => router.push("/track-order")}>
              <Text style={styles.headerLink}>TRACK ORDER</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.push("/cart")}>
              <Text style={styles.headerLink}>BAG ({itemCount})</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void signOut()
                  .then(() => router.replace("/"))
                  .catch((signOutError: unknown) => {
                    setError(
                      signOutError instanceof Error ? signOutError.message : "Could not sign out.",
                    );
                  });
              }}
            >
              <Text style={styles.signOut}>SIGN OUT</Text>
            </Pressable>
          </View>
        </View>

        <FlatList
          data={products}
          keyExtractor={(product) => product.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <PageTitle eyebrow="RISK IT / NEW SEASON" title="The collection." />
              <Text style={styles.caption}>BUILT FOR THE ONES WHO MAKE THEIR OWN MOVES.</Text>
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              {loading ? <ActivityIndicator color={colors.accent} /> : null}
            </View>
          }
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>
                  {error ? "Collection unavailable" : "Coming soon."}
                </Text>
                <Text style={styles.emptyCopy}>
                  {error
                    ? "Check your Supabase connection and products table, then try again."
                    : "The collection is being prepared. Check back soon."}
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const selectedSize = selectedSizes[item.id] ?? item.sizes[0] ?? "";
            return (
              <View style={styles.product}>
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.productImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderMark}>R/</Text>
                    <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <View style={styles.productTitleRow}>
                    <View style={styles.productNameBlock}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <Text style={styles.price}>{price(item.price)}</Text>
                  </View>
                  <Text style={styles.sizeLabel}>SELECT SIZE</Text>
                  <View style={styles.sizes}>
                    {item.sizes.map((size) => (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: selectedSize === size }}
                        key={size}
                        onPress={() => setSelectedSizes((current) => ({ ...current, [item.id]: size }))}
                        style={[styles.size, selectedSize === size && styles.sizeSelected]}
                      >
                        <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>
                          {size}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Button
                    label={item.stock > 0 ? "ADD TO BAG" : "SOLD OUT"}
                    disabled={item.stock <= 0 || !selectedSize}
                    onPress={() => addItem(item, selectedSize)}
                  />
                </View>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  centered: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "transparent",
  },
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wordmark: { color: colors.accent, fontSize: 17, fontWeight: "900", letterSpacing: 1.6 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 18 },
  headerLink: { color: colors.text, fontSize: 11, fontWeight: "800", letterSpacing: 0.7 },
  signOut: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 0.7 },
  listContent: { paddingBottom: 38 },
  listHeader: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 12, gap: 9 },
  caption: { color: colors.muted, fontSize: 9, letterSpacing: 1.5 },
  error: { color: colors.danger, fontSize: 13 },
  empty: { alignItems: "center", paddingHorizontal: 32, paddingVertical: 44, gap: 10 },
  emptyTitle: { color: colors.text, fontSize: 19, fontWeight: "700" },
  emptyCopy: { color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: "center" },
  product: { marginHorizontal: 22, marginTop: 20, backgroundColor: colors.surface },
  productImage: { width: "100%", height: 220, backgroundColor: colors.surfaceRaised },
  imagePlaceholder: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
  },
  placeholderMark: { color: colors.accent, fontSize: 62, fontWeight: "900", letterSpacing: -6 },
  category: { color: colors.muted, fontSize: 9, letterSpacing: 2, marginTop: 4 },
  productInfo: { padding: 16, gap: 13 },
  productTitleRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  productNameBlock: { flex: 1, gap: 4 },
  productName: { color: colors.text, fontSize: 16, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  price: { color: colors.accent, fontSize: 14, fontWeight: "700" },
  sizeLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.4 },
  sizes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  size: {
    minWidth: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sizeSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  sizeText: { color: colors.text, fontSize: 11, fontWeight: "700" },
  sizeTextSelected: { color: colors.background },
});
