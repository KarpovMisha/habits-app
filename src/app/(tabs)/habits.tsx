import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { currentStreak, fetchAllCompletions } from '@/api/habit-completions';
import HabitCard from '@/components/habits/habit-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TimesOfDay, type Habit } from '@/constants/habits';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/use-habits';
import { useTheme } from '@/hooks/use-theme';

type Filter = 'all' | Habit['timeOfDay'];

const NoCompletions = new Set<string>();

export default function HabitsScreen() {
  const theme = useTheme();
  const { habits } = useHabits();
  const [filter, setFilter] = useState<Filter>('all');
  const [today, setToday] = useState(() => new Date());
  const [completions, setCompletions] = useState<Record<string, Set<string>>>(
    {},
  );

  // Completions change on other screens, so reload whenever this tab is shown.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setToday(new Date());
      fetchAllCompletions()
        .then((byHabit) => {
          if (!cancelled) setCompletions(byHabit);
        })
        .catch((error) =>
          console.warn('Failed to load completions:', error.message),
        );
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const visible =
    filter === 'all'
      ? habits
      : habits.filter((habit) => habit.timeOfDay === filter);

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: `All · ${habits.length}` },
    ...TimesOfDay.map((time) => ({
      value: time,
      label: time[0].toUpperCase() + time.slice(1),
    })),
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <FlatList
          data={visible}
          keyExtractor={(habit) => habit.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <ThemedText type="title" style={styles.title}>
                  Habits
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/new-habit')}
                  accessibilityRole="button"
                  accessibilityLabel="New habit"
                  style={({ pressed }) => [
                    styles.addButton,
                    { backgroundColor: theme.primary },
                    pressed && styles.pressed,
                  ]}
                >
                  <SymbolView
                    name={{ ios: 'plus', android: 'add', web: 'add' }}
                    tintColor="#ffffff"
                    size={28}
                  />
                </Pressable>
              </View>

              <View style={styles.filters}>
                {filters.map(({ value, label }) => {
                  const selected = value === filter;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => setFilter(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      style={[
                        styles.chip,
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
                        style={styles.chipText}
                      >
                        {label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          }
          ListEmptyComponent={
            <ThemedView type="surface" style={styles.empty}>
              <ThemedText style={styles.emptyTitle}>
                {habits.length === 0 ? 'No habits yet' : 'Nothing here'}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                {habits.length === 0
                  ? 'Tap + to add your first habit'
                  : `No ${filter} habits`}
              </ThemedText>
            </ThemedView>
          }
          renderItem={({ item }) => {
            const completed = completions[item.id] ?? NoCompletions;
            return (
              <HabitCard
                habit={item}
                streak={currentStreak(completed, today)}
              />
            );
          }}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.four,
    marginBottom: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'left',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  chipText: {
    fontSize: 15,
    fontWeight: 700,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: 20,
    padding: Spacing.four,
  },
  emptyTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
  },
  pressed: {
    opacity: 0.7,
  },
});
