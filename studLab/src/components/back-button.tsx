import { Href, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type BackButtonProps = {
  fallbackRoute: Href;
  label?: string;
};

export function BackButton({ fallbackRoute, label = 'Back' }: BackButtonProps) {
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={goBack}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.arrow}>‹</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingRight: 14,
  },
  arrow: { color: '#C9A96A', fontSize: 32, lineHeight: 34, marginRight: 7 },
  label: { color: '#D1CEC7', fontSize: 14, fontWeight: '600' },
});
