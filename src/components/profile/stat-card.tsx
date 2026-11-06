import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Hues } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StatCardProps = {
  value: number;
  label: string;
  hue: keyof typeof Hues;
};

export default function StatCard({ value, label, hue }: StatCardProps) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [tint, ink] = Hues[hue][scheme];

  return (
    <View style={[styles.card, { backgroundColor: tint }]}>
      <ThemedText style={[styles.value, { color: ink }]}>{value}</ThemedText>
      <ThemedText type="smallBold" style={{ color: ink }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  value: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: 800,
  },
});
