import type { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

export function ScreenBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1200",
      }}
      style={styles.background}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View pointerEvents="none" style={styles.scrim} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    opacity: 0.82,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(8, 8, 7, 0.76)",
  },
});
