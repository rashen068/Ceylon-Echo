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
  rustLight: '#FBF0EA',
};

export function AdminScreen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
}

export function AdminHeader({
  title,
  onSave,
  onDelete,
  onSignOut,
  saveDisabled = false,
}: {
  title: string;
  onSave?: () => void;
  onDelete?: () => void;
  onSignOut?: () => void;
  saveDisabled?: boolean;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        {onDelete ? (
          <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteAction}>
            <Text style={styles.deleteActionText}>Delete</Text>
          </Pressable>
        ) : null}
        {onSave ? (
          <Pressable
            accessibilityRole="button"
            disabled={saveDisabled}
            onPress={onSave}
            style={[styles.headerAction, saveDisabled && styles.disabledAction]}>
            <Text style={styles.headerActionText}>{saveDisabled ? 'Saving…' : 'Save'}</Text>
          </Pressable>
        ) : null}
        {onSignOut ? (
          <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.headerAction}>
            <Text style={styles.headerActionText}>Log out</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function AdminButton({
  label,
  onPress,
  style,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' && styles.outlineButton,
        style,
        disabled && styles.disabledAction,
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
  fieldStyle,
  ...inputProps
}: Omit<TextInputProps, 'style'> & { label: string; fieldStyle?: ViewStyle }) {
  return (
    <View style={[styles.field, fieldStyle]}>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAction: {
    backgroundColor: adminColors.rust,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  deleteAction: {
    backgroundColor: adminColors.rustLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteActionText: {
    color: adminColors.rust,
    fontSize: 13,
    fontWeight: '700',
  },
  disabledAction: {
    opacity: 0.6,
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
