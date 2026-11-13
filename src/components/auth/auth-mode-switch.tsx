import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AuthMode = 'login' | 'signup';

const Labels: Record<AuthMode, string> = {
  login: 'Log in',
  signup: 'Sign up',
};

type AuthModeSwitchProps = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export default function AuthModeSwitch({ mode, onChange }: AuthModeSwitchProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.container, { backgroundColor: theme.field }]}
    >
      {(Object.keys(Labels) as AuthMode[]).map((key) => {
        const selected = key === mode;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[
              styles.segment,
              selected && [styles.selected, { backgroundColor: theme.surface }],
            ]}
          >
            <ThemedText
              themeColor={selected ? 'text' : 'textSecondary'}
              style={styles.text}
            >
              {Labels[key]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
    borderRadius: 16,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
  },
  text: {
    fontSize: 15,
    fontWeight: 800,
  },
});
