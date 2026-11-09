import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HabitIcons, Hues, type Habit } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

const WeekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

type HabitCardProps = {
  habit: Habit;
  streak: number;
};

// One row of the Habits tab: icon, name, streak and the days it's scheduled on.
export default function HabitCard({ habit, streak }: HabitCardProps) {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [tint, ink] = Hues[habit.hue][scheme];

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/habit/[id]', params: { id: habit.id } })
      }
      accessibilityRole="button"
      style={({ pressed }) => pressed && styles.pressed}
    >
      <ThemedView type="surface" style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconTile, { backgroundColor: tint }]}>
            <Image
              source={HabitIcons[habit.icon]}
              svgVariables={{ '--stroke': ink }}
              style={styles.icon}
            />
          </View>

          <View style={styles.info}>
            <ThemedText style={styles.name}>{habit.name}</ThemedText>
            {!!habit.goal && (
              <ThemedText themeColor="textSecondary" style={styles.goal}>
                {habit.goal}
              </ThemedText>
            )}
          </View>

          <View style={[styles.streak, { backgroundColor: theme.flameTint }]}>
            <Image
              source={require('@/assets/images/flame.svg')}
              svgVariables={{ '--stroke': theme.flame }}
              style={styles.flame}
            />
            <ThemedText style={[styles.streakText, { color: theme.flame }]}>
              {streak}
            </ThemedText>
          </View>
        </View>

        <View style={styles.week}>
          {WeekdayLabels.map((label, index) => {
            // `habit.days` is Monday-first, same as the labels.
            const color = habit.days[index] ? ink : theme.field;

            return (
              <View key={label} style={styles.day}>
                <View style={[styles.bar, { backgroundColor: color }]} />
                <ThemedText themeColor="textSecondary" style={styles.dayLabel}>
                  {label}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    borderRadius: 20,
    padding: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  goal: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 500,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  flame: {
    width: 14,
    height: 14,
  },
  streakText: {
    fontSize: 15,
    fontWeight: 800,
  },
  week: {
    flexDirection: 'row',
    gap: 6,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  bar: {
    alignSelf: 'stretch',
    height: 6,
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 600,
  },
  pressed: {
    opacity: 0.7,
  },
});
