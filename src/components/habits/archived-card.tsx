import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ArchivedCard({ count }: { count: number }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.push('/archived')}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.fieldBorder },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Image
        source={require('@/assets/images/archive.svg')}
        tintColor={theme.text}
        style={styles.icon}
      />
      <ThemedText style={styles.label}>Archived</ThemedText>
      <ThemedText themeColor="textSecondary">{count}</ThemedText>
      <SymbolView
        name={{
          ios: 'chevron.right',
          android: 'chevron_right',
          web: 'chevron_right',
        }}
        tintColor={theme.textSecondary}
        size={18}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    padding: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  icon: { width: 20, height: 20 },
  label: { flex: 1, fontWeight: 600 }, // flex: 1 прижимает число и стрелку вправо
});
