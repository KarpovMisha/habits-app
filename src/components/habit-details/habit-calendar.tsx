import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';

import { toDateKey } from '@/api/habit-completions';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const WeekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// How far a horizontal swipe must travel to change the month.
const SwipeThreshold = 50;

type HabitCalendarProps = {
  today: Date;
  completed: Set<string>;
  onToggle: (dateKey: string) => void;
};

// One month at a time; swipe or use the arrows to switch. Months after the current one are
// unreachable, and within a month only past days and today can be toggled.
export default function HabitCalendar({ today, completed, onToggle }: HabitCalendarProps) {
  const theme = useTheme();
  // Offset from the current month: 0 is this month, -1 the previous one, and so on.
  const [offset, setOffset] = useState(0);
  // Which side the new month slides in from.
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const goTo = (next: number) => {
    if (next > 0) return;
    setDirection(next > offset ? 'left' : 'right');
    setOffset(next);
  };

  const swipe = usePanGesture({
    // Horizontal drags only, so the page can still scroll vertically.
    activeOffsetX: [-20, 20],
    failOffsetY: [-15, 15],
    runOnJS: true,
    onDeactivate: (event) => {
      if (event.translationX <= -SwipeThreshold) goTo(offset + 1);
      else if (event.translationX >= SwipeThreshold) goTo(offset - 1);
    },
  });

  const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset of the 1st.
  const leading = (first.getDay() + 6) % 7;

  // Days that have already happened: the whole month for past months.
  const elapsed = offset === 0 ? today.getDate() : daysInMonth;
  let doneCount = 0;
  for (let day = 1; day <= elapsed; day++) {
    if (completed.has(toDateKey(new Date(year, month, day)))) doneCount++;
  }
  const percent = Math.round((doneCount / elapsed) * 100);

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <ThemedView type="surface" style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.month}>
          {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.summary}>
          {doneCount} of {elapsed} days · {percent}%
        </ThemedText>
      </View>

      <View style={styles.nav}>
        <Pressable
          onPress={() => goTo(offset - 1)}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          hitSlop={8}
          style={[styles.navButton, { backgroundColor: theme.field }]}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            tintColor={theme.text}
            size={16}
          />
        </Pressable>
        {offset < 0 && (
          <Pressable onPress={() => goTo(0)} accessibilityRole="button" hitSlop={8}>
            <ThemedText themeColor="primary" style={styles.todayLink}>
              Today
            </ThemedText>
          </Pressable>
        )}
        <Pressable
          onPress={() => goTo(offset + 1)}
          disabled={offset === 0}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          hitSlop={8}
          style={[
            styles.navButton,
            { backgroundColor: theme.field },
            offset === 0 && styles.navDisabled,
          ]}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={theme.text}
            size={16}
          />
        </Pressable>
      </View>

      <GestureDetector gesture={swipe}>
        <View style={styles.grid}>
          {WeekdayLabels.map((label) => (
            <View key={label} style={styles.cell}>
              <ThemedText themeColor="textSecondary" style={styles.weekday}>
                {label}
              </ThemedText>
            </View>
          ))}

          {/* Keyed by month so each switch remounts the days and plays the slide-in. */}
          <Animated.View
            key={`${year}-${month}`}
            entering={(direction === 'left' ? FadeInRight : FadeInLeft).duration(220)}
            style={styles.days}>
            {cells.map((day, index) => {
              if (day === null) {
                return <View key={`blank-${index}`} style={styles.cell} />;
              }

              const key = toDateKey(new Date(year, month, day));
              const isDone = completed.has(key);
              const isToday = offset === 0 && day === elapsed;
              const isFuture = day > elapsed;

              return (
                <View key={key} style={styles.cell}>
                  <Pressable
                    onPress={() => onToggle(key)}
                    disabled={isFuture}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isDone, disabled: isFuture }}
                    accessibilityLabel={`Day ${day}`}
                    style={[
                      styles.day,
                      isDone && { backgroundColor: theme.primary },
                      !isDone && !isFuture && { backgroundColor: theme.field },
                      isToday && styles.today,
                    ]}>
                    <ThemedText
                      themeColor={isFuture ? 'textSecondary' : 'text'}
                      style={[styles.dayText, isDone && styles.dayTextDone]}>
                      {day}
                    </ThemedText>
                  </Pressable>
                </View>
              );
            })}
          </Animated.View>
        </View>
      </GestureDetector>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: Spacing.three + Spacing.one,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },
  month: {
    fontSize: 18,
    fontWeight: 800,
  },
  summary: {
    fontSize: 14,
    fontWeight: 700,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDisabled: {
    opacity: 0.35,
  },
  todayLink: {
    fontSize: 14,
    fontWeight: 700,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.two,
  },
  days: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.two,
  },
  cell: {
    width: `${100 / 7}%`,
    paddingHorizontal: 3,
    alignItems: 'center',
  },
  weekday: {
    fontSize: 13,
    fontWeight: 700,
  },
  day: {
    width: '100%',
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    borderWidth: 3,
    borderColor: '#ffd84d',
  },
  dayText: {
    fontSize: 15,
    fontWeight: 700,
  },
  dayTextDone: {
    color: '#ffffff',
  },
});
