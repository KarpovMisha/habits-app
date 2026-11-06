import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Hues } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

type LogoutButtonProps = {
  onPress?: () => void;
};

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const color = Hues.pink[scheme][1];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.surface },
        pressed && styles.pressed,
      ]}
    >
      <SymbolView
        name={{
          ios: 'rectangle.portrait.and.arrow.right',
          android: 'logout',
          web: 'logout',
        }}
        tintColor={color}
        size={22}
      />
      <ThemedText style={[styles.label, { color }]}>Log out</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
  },
  label: {
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
});
