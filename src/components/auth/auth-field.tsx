import { useState, type Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AuthFieldProps = TextInputProps & {
  label: string;
  ref?: Ref<TextInputInstance>;
};

// A labeled text input; highlighted while focused, like the fields in the habit form.
export default function AuthField({
  label,
  ref,
  style,
  onFocus,
  onBlur,
  ...props
}: AuthFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: focused ? theme.surface : theme.field,
            borderColor: focused ? theme.primary : theme.fieldBorder,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    fontWeight: 600,
  },
});
