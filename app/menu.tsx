import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const categories = [
  { id: '1', name: 'Cognac', emoji: '🥃' },
  { id: '2', name: 'Spirits', emoji: '🍾' },
  { id: '3', name: 'Gin', emoji: '🍸' },
  { id: '4', name: 'Rum', emoji: '🥂' },
  { id: '5', name: 'Wine', emoji: '🍷' },
  { id: '6', name: 'Ciders', emoji: '🍏' },
];

export default function MenuScreen() {
  const router = useRouter();
  const { totalItems } = useCart();

  const renderItem = ({ item }: { item: { id: string; name: string; emoji: string } }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/category/${item.name}`)}
    >
      <Text style={styles.cardEmoji}>{item.emoji}</Text>
      <Text style={styles.cardText}>{item.name}</Text>
      <View style={styles.cardArrowWrap}>
        <Text style={styles.cardArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />

      {/* Floating blurred bottle/delivery icons */}
      <Text style={[styles.floatIcon, styles.icon1]}>🍷</Text>
      <Text style={[styles.floatIcon, styles.icon2]}>🥃</Text>
      <Text style={[styles.floatIcon, styles.icon3]}>🚗</Text>
      <Text style={[styles.floatIcon, styles.icon4]}>🍸</Text>

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

      <Text style={styles.eyebrow}>BROWSE</Text>
      <Text style={styles.title}>What are you{'\n'}sipping tonight?</Text>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
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
    paddingHorizontal: 20,
    paddingTop: 60,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,122,92,0.14)',
  },
  floatIcon: {
    position: 'absolute',
    fontSize: 90,
    opacity: 0.07,
  },
  icon1: { top: 60, left: -20, transform: [{ rotate: '-12deg' }] },
  icon2: { top: 320, right: -25, fontSize: 100, transform: [{ rotate: '10deg' }] },
  icon3: { bottom: 220, left: -15, fontSize: 80, transform: [{ rotate: '8deg' }] },
  icon4: { bottom: 60, right: -20, fontSize: 90, transform: [{ rotate: '-9deg' }] },
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
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 36,
    marginBottom: 28,
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
    paddingVertical: 26,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  cardEmoji: {
    fontSize: 30,
    marginBottom: 14,
  },
  cardText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 10,
  },
  cardArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrow: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
