import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

export function StudentIllustration() {
  const leftBob = useRef(new Animated.Value(0)).current;
  const rightBob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createBob = (value: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

    const leftAnimation = createBob(leftBob, 1050);
    const rightAnimation = createBob(rightBob, 1250);
    leftAnimation.start();
    rightAnimation.start();

    return () => {
      leftAnimation.stop();
      rightAnimation.stop();
    };
  }, [leftBob, rightBob]);

  const leftStyle = {
    transform: [{ translateY: leftBob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) }],
  };
  const rightStyle = {
    transform: [{ translateY: rightBob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }],
  };

  return (
    <View style={styles.illustration} accessible={false} pointerEvents="none">
      <View style={styles.sun} />
      <View style={styles.sparkleOne} />
      <View style={styles.sparkleTwo} />

      <Animated.View style={[styles.student, styles.studentBack, leftStyle]}>
        <View style={[styles.head, styles.headBack]}>
          <View style={styles.hairBack} />
          <View style={styles.eyeLeft} />
          <View style={styles.eyeRight} />
          <View style={styles.smile} />
        </View>
        <View style={[styles.body, styles.bodyBack]}>
          <View style={styles.armLeft} />
          <View style={styles.armRight} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.student, styles.studentFront, rightStyle]}>
        <View style={[styles.head, styles.headFront]}>
          <View style={styles.hairFront} />
          <View style={styles.eyeLeft} />
          <View style={styles.eyeRight} />
          <View style={styles.smile} />
        </View>
        <View style={[styles.body, styles.bodyFront]}>
          <View style={styles.armLeft} />
          <View style={styles.armRight} />
          <View style={styles.book}>
            <View style={styles.bookLine} />
            <View style={styles.bookLineShort} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: { width: 190, height: 142, alignSelf: 'center', marginVertical: 10 },
  sun: { position: 'absolute', width: 128, height: 128, borderRadius: 64, backgroundColor: '#201D17', top: 8, left: 31 },
  sparkleOne: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#E6BE73', top: 24, left: 19 },
  sparkleTwo: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: '#8DC9B3', top: 47, right: 14 },
  student: { position: 'absolute', width: 78, height: 118, bottom: 0 },
  studentBack: { left: 26, zIndex: 1 },
  studentFront: { right: 23, zIndex: 2 },
  head: { position: 'absolute', top: 0, width: 44, height: 47, borderRadius: 22, backgroundColor: '#C9855D', overflow: 'hidden', zIndex: 2 },
  headBack: { left: 17 },
  headFront: { left: 18, backgroundColor: '#E2A77D' },
  hairBack: { position: 'absolute', top: -8, left: -2, width: 48, height: 22, borderRadius: 16, backgroundColor: '#30231F' },
  hairFront: { position: 'absolute', top: -8, left: -2, width: 48, height: 22, borderRadius: 16, backgroundColor: '#493025' },
  eyeLeft: { position: 'absolute', top: 24, left: 13, width: 3, height: 4, borderRadius: 2, backgroundColor: '#25201C' },
  eyeRight: { position: 'absolute', top: 24, right: 13, width: 3, height: 4, borderRadius: 2, backgroundColor: '#25201C' },
  smile: { position: 'absolute', top: 32, left: 18, width: 9, height: 5, borderBottomWidth: 1.5, borderColor: '#7B423A', borderRadius: 8 },
  body: { position: 'absolute', bottom: 0, left: 6, width: 67, height: 76, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderBottomLeftRadius: 9, borderBottomRightRadius: 9 },
  bodyBack: { backgroundColor: '#83AFC1' },
  bodyFront: { backgroundColor: '#D58F58' },
  armLeft: { position: 'absolute', top: 12, left: -7, width: 14, height: 40, borderRadius: 8, backgroundColor: '#C9855D', transform: [{ rotate: '12deg' }] },
  armRight: { position: 'absolute', top: 12, right: -7, width: 14, height: 40, borderRadius: 8, backgroundColor: '#C9855D', transform: [{ rotate: '-12deg' }] },
  book: { position: 'absolute', top: 28, right: 7, width: 30, height: 25, borderRadius: 4, backgroundColor: '#F1D98A', borderWidth: 2, borderColor: '#FFF0B7', transform: [{ rotate: '-7deg' }] },
  bookLine: { height: 2, width: 15, backgroundColor: '#9A8550', marginTop: 6, marginLeft: 5 },
  bookLineShort: { height: 2, width: 11, backgroundColor: '#9A8550', marginTop: 4, marginLeft: 5 },
});
