import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productsByCategory, Product } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const products = productsByCategory[category] ?? [];
  const { addItem, totalItems, totalPrice } = useCart();

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>R{item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => addItem(item)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />

      {/* Floating blurred bottle/delivery icons */}
      <Text style={[styles.floatIcon, styles.icon1]}>🍾</Text>
      <Text style={[styles.floatIcon, styles.icon2]}>🚗</Text>
      <Text style={[styles.floatIcon, styles.icon3]}>🍹</Text>

      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
          <Text style={styles.cartButtonText}>🛒</Text>
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.eyebrow}>CATEGORY</Text>
      <Text style={styles.title}>{category}</Text>

      {products.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🍹</Text>
          <Text style={styles.empty}>No products yet in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            totalItems > 0 && { paddingBottom: 100 },
          ]}
        />
      )}

      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          activeOpacity={0.85}
          onPress={() => router.push('/cart')}
        >
          <Text style={styles.cartBarText}>
            {totalItems} item{totalItems > 1 ? 's' : ''} · R{totalPrice}
          </Text>
          <Text style={styles.cartBarAction}>View Cart →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const ACCENT = '#FF7A5C';
const BG = '#14121A';
const CARD = 'rgba(255,255,255,0.06)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 18,
    paddingTop: 60,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(122,92,255,0.14)',
  },
  floatIcon: {
    position: 'absolute',
    fontSize: 90,
    opacity: 0.07,
  },
  icon1: { top: 100, right: -25, transform: [{ rotate: '10deg' }] },
  icon2: { bottom: 260, left: -20, fontSize: 80, transform: [{ rotate: '-8deg' }] },
  icon3: { bottom: 40, right: -15, fontSize: 85, transform: [{ rotate: '9deg' }] },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cartButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    fontSize: 16,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: ACCENT,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  eyebrow: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 26,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  empty: {
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    fontSize: 15,
  },
  list: {
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    marginBottom: 16,
  },
  imageWrap: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
  },
  name: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    color: ACCENT,
    fontWeight: '800',
  },
  addButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: -1,
  },
  cartBar: {
    position: 'absolute',
    bottom: 24,
    left: 18,
    right: 18,
    backgroundColor: ACCENT,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cartBarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cartBarAction: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});