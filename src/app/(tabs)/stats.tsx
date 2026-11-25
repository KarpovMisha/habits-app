import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCompletionRate } from '@/hooks/use-completion-rate';
import { useTheme } from '@/hooks/use-theme';

type Filter = 'week' | 'month' | 'year';

const PERIOD_TABS: { value: Filter; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export default function Stats() {
  const theme = useTheme();
  const [filter, setFilter] = useState<Filter>('week');
  const rate = useCompletionRate(filter);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Stats
          </ThemedText>
          <Pressable
            onPress={() => router.push('/new-habit')}
            accessibilityRole="button"
            accessibilityLabel="Month stats"
            style={({ pressed }) => styles.statsButton}
          >
            <ThemedText themeColor={'textInvert'} type="small">
              October recap
            </ThemedText>
          </Pressable>
        </View>
        <View style={styles.filters}>
          {PERIOD_TABS.map(({ value, label }) => {
            const selected = value === filter;
            return (
              <Pressable
                key={value}
                onPress={() => setFilter(value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.tab,
                  selected
                    ? { backgroundColor: theme.text }
                    : {
                        backgroundColor: theme.surface,
                        borderColor: theme.fieldBorder,
                      },
                ]}
              >
                <ThemedText
                  themeColor={selected ? 'textInvert' : 'text'}
                  style={styles.tabText}
                >
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
        <ThemedView type="surface" style={styles.completion}>
          <ThemedText themeColor={'textSecondary'}>
            this {filter} - completion
          </ThemedText>
          <ThemedText themeColor={'text'} type="big">
            {rate}%
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.container,
    paddingTop: BottomTabInset + Spacing.container,
    paddingBottom: BottomTabInset + Spacing.container,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    textAlign: 'left',
  },
  statsButton: {
    backgroundColor: '#ffd84d',
    borderRadius: 22,
    paddingHorizontal: 6,
    alignSelf: 'center',
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 500,
  },
  completion: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
