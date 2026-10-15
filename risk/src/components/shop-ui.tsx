import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { colors } from "../theme/colors";

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  loading?: boolean;
  disabled?: boolean;
}) {
  const outlined = variant === "outline";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outlined && styles.outlineButton,
        (disabled || loading) && styles.disabledButton,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outlined ? colors.accent : colors.background} />
      ) : (
        <Text style={[styles.buttonText, outlined && styles.outlineButtonText]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.pageTitle}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: colors.accent,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  disabledButton: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  outlineButtonText: {
    color: colors.text,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  pageTitle: {
    gap: 6,
    marginBottom: 20,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
});
