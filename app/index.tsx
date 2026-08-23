import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const IndexScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.background}>
      {/* Decorative glow shapes */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🍸</Text>
          </View>
          <Text style={styles.brand}>Sip It</Text>
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButtonGhost} onPress={() => router.push('/signin')}>
            <Text style={styles.navButtonGhostText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButtonSolid} onPress={() => router.push('/auth')}>
            <Text style={styles.navButtonSolidText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero content */}
      <View style={styles.hero}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>DELIVERED TO YOUR DOOR</Text>
        </View>

        <Text style={styles.title}>Great drinks,{'\n'}delivered fast.</Text>

        <Text style={styles.subtitle}>
          Order your favorite cognac, spirits, gin, wine and more — straight to your door in minutes.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/menu')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Start Ordering</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IndexScreen;

const ACCENT = '#FF7A5C';
const ACCENT_DEEP = '#E85A3C';
const BG = '#14121A';
const CARD = 'rgba(255,255,255,0.06)';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BG,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,122,92,0.18)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(122,92,255,0.14)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  navButtonGhost: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  navButtonGhostText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  navButtonSolid: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: '#fff',
  },
  navButtonSolidText: {
    fontSize: 13,
    color: BG,
    fontWeight: '700',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  pill: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 22,
  },
  pillText: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 320,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ACCENT,
    paddingVertical: 17,
    paddingHorizontal: 36,
    borderRadius: 32,
    shadowColor: ACCENT_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
  },
  buttonArrow: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
  },
});