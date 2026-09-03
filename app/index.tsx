import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IndexScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.background}>
      {/* Bold decorative glow shapes */}
      <View style={styles.glowTop} />
      <View style={styles.glowMid} />
      <View style={styles.glowBottom} />

      {/* Logo watermark behind hero content */}
      <Image
        source={require('../assets/images/sip-it-logo.png')}
        style={styles.watermark}
        resizeMode="contain"
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../assets/images/sip-it-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
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
const BG = '#241031';
const CARD = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BG,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -140,
    right: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(255,122,92,0.35)',
  },
  glowMid: {
    position: 'absolute',
    top: '35%',
    left: -140,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,200,80,0.22)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -160,
    left: -80,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(150,80,255,0.30)',
  },
  watermark: {
    position: 'absolute',
    alignSelf: 'center',
    top: '24%',
    width: 380,
    height: 380,
    opacity: 0.14,
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  brand: {
    fontSize: 22,
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
    borderColor: 'rgba(255,255,255,0.3)',
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
    borderColor: 'rgba(255,255,255,0.18)',
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
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 18,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
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
