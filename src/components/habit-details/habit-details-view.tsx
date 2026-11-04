import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchCompletions, setCompletion, toDateKey } from '@/api/habit-completions';
import HabitCalendar from '@/components/habit-details/habit-calendar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HabitIcons, Hues, type Habit } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

function scheduleLabel(days: boolean[]) {
  const count = days.filter(Boolean).length;
  if (count === 7) return 'daily';
  if (count === 5 && days.slice(0, 5).every(Boolean)) return 'weekdays';
  if (count === 2 && days[5] && days[6]) return 'weekends';
  return `${count}× a week`;
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

// Current streak counts back from today, or from yesterday if today isn't done yet.
function currentStreak(completed: Set<string>, today: Date) {
  let day = completed.has(toDateKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (completed.has(toDateKey(day))) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

function bestStreak(completed: Set<string>) {
  let best = 0;
  for (const key of completed) {
    const [y, m, d] = key.split('-').map(Number);
    const start = new Date(y, m - 1, d);
    // Only count from the first day of each run.
    if (completed.has(toDateKey(addDays(start, -1)))) continue;
    let length = 1;
    while (completed.has(toDateKey(addDays(start, length)))) length++;
    best = Math.max(best, length);
  }
  return best;
}

type HabitDetailsViewProps = {
  habit: Habit;
  onDelete: () => void;
};

export default function HabitDetailsView({ habit, onDelete }: HabitDetailsViewProps) {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [tint, ink] = Hues[habit.hue][scheme];
  const [dangerTint, dangerInk] = Hues.pink[scheme];

  const [today] = useState(() => new Date());
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetchCompletions(habit.id).then((keys) => {
      if (!cancelled) setCompleted(new Set(keys));
    });
    return () => {
      cancelled = true;
    };
  }, [habit.id]);

  // Optimistic: update the UI right away, roll back if the request fails.
  const toggleDay = (dateKey: string) => {
    const done = !completed.has(dateKey);
    const update = (value: boolean) =>
      setCompleted((prev) => {
        const next = new Set(prev);
        if (value) next.add(dateKey);
        else next.delete(dateKey);
        return next;
      });

    update(done);
    setCompletion(habit.id, dateKey, done).catch(() => update(!done));
  };

  const stats = [
    { label: 'Day streak', value: currentStreak(completed, today), color: theme.flame },
    { label: 'Best streak', value: bestStreak(completed) },
    { label: 'All-time days', value: completed.size },
  ];

  const subtitle = [habit.goal, scheduleLabel(habit.days)].filter(Boolean).join(' · ');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={[styles.iconButton, { backgroundColor: theme.surface }]}>
              <SymbolView
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                tintColor={theme.text}
                size={20}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push({ pathname: '/edit-habit/[id]', params: { id: habit.id } })}
              accessibilityRole="button"
              accessibilityLabel="Edit habit"
              style={[styles.iconButton, { backgroundColor: theme.surface }]}>
              <SymbolView
                name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                tintColor={theme.text}
                size={20}
              />
            </Pressable>
          </View>

          <View style={[styles.hero, { backgroundColor: tint }]}>
            <View style={[styles.heroIcon, { backgroundColor: ink }]}>
              <Image
                source={HabitIcons[habit.icon]}
                svgVariables={{ '--stroke': tint }}
                style={styles.heroIconImage}
              />
            </View>
            <View style={styles.heroText}>
              <ThemedText style={styles.name}>{habit.name}</ThemedText>
              <ThemedText style={[styles.subtitle, { color: ink }]}>{subtitle}</ThemedText>
            </View>
          </View>

          <View style={styles.stats}>
            {stats.map((stat) => (
              <ThemedView key={stat.label} type="surface" style={styles.stat}>
                <ThemedText style={[styles.statValue, stat.color && { color: stat.color }]}>
                  {stat.value}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                  {stat.label}
                </ThemedText>
              </ThemedView>
            ))}
          </View>

          <HabitCalendar today={today} completed={completed} onToggle={toggleDay} />

          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.deleteButton,
              { backgroundColor: theme.surface, borderColor: dangerTint },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              tintColor={dangerInk}
              size={20}
            />
            <ThemedText style={[styles.deleteText, { color: dangerInk }]}>Delete habit</ThemedText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 28,
    padding: Spacing.four,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconImage: {
    width: 32,
    height: 32,
  },
  heroText: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 600,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two + Spacing.one,
  },
  stat: {
    flex: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 800,
  },
  statLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    marginTop: 'auto',
  },
  deleteText: {
    fontSize: 17,
    fontWeight: 800,
  },
  pressed: {
    opacity: 0.7,
  },
});
