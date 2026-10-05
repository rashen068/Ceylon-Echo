import type { ReactNode } from 'react';
import type { TextInputProps, ViewStyle } from 'react-native';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export const adminColors = {
  background: '#F7F5F1',
  surface: '#FFFFFF',
  text: '#1D2830',
  muted: '#7C8284',
  line: '#E8E4DE',
  green: '#2D5140',
  rust: '#B95C38',
};

export function AdminScreen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
}

export function AdminHeader({
  title,
  onSave,
}: {
  title: string;
  onSave?: () => void;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {onSave ? (
        <Pressable accessibilityRole="button" onPress={onSave} style={styles.headerAction}>
          <Text style={styles.headerActionText}>Save</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function AdminButton({
  label,
  onPress,
  style,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'outline';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' && styles.outlineButton,
        style,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.buttonText, variant === 'outline' && styles.outlineButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AdminField({
  label,
  ...inputProps
}: Omit<TextInputProps, 'style'> & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={adminColors.muted}
        style={[styles.input, inputProps.multiline && styles.multilineInput]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: adminColors.background,
  },
  header: {
    minHeight: 52,
    paddingHorizontal: 20,
    backgroundColor: adminColors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: adminColors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: adminColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerAction: {
    backgroundColor: adminColors.rust,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  headerActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  button: {
    minHeight: 46,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: adminColors.rust,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: adminColors.surface,
    borderWidth: 1,
    borderColor: adminColors.line,
  },
  outlineButtonText: {
    color: adminColors.text,
  },
  pressed: {
    opacity: 0.75,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: adminColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: adminColors.line,
    borderRadius: 6,
    backgroundColor: adminColors.surface,
    color: adminColors.text,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
});
