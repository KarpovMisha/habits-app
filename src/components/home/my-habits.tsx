import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Checkbox } from '@/components/ui/checkbox';
import { HabitIcons, Hues, isScheduledOn } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabits } from '@/hooks/use-habits';
import { useTheme } from '@/hooks/use-theme';

export default function MyHabits() {
  const theme = useTheme();
  const { habits: allHabits, done, setDone } = useHabits();
  const today = new Date();
  const habits = allHabits.filter((habit) => isScheduledOn(habit, today));
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>My habits</ThemedText>

      {habits.length === 0 && (
        <ThemedView type="surface" style={styles.empty}>
          <ThemedText style={styles.name}>
            {allHabits.length === 0 ? 'No habits yet' : 'Nothing for today'}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.metaText}>
            {allHabits.length === 0
              ? 'Tap + to add your first habit'
              : 'No habits are scheduled for today'}
          </ThemedText>
        </ThemedView>
      )}

      <View style={styles.list}>
        {habits.map((habit) => {
          const [tint, ink] = Hues[habit.hue][scheme];
          const checked = !!done[habit.id];

          return (
            <Pressable
              key={habit.id}
              onPress={() =>
                router.push({
                  pathname: '/habit/[id]',
                  params: { id: habit.id },
                })
              }
              accessibilityRole="button"
            >
              <ThemedView type="surface" style={styles.card}>
                <View style={[styles.iconTile, { backgroundColor: tint }]}>
                  <Image
                    source={HabitIcons[habit.icon]}
                    svgVariables={{ '--stroke': ink }}
                    style={styles.icon}
                  />
                </View>

                <View style={styles.info}>
                  <ThemedText style={styles.name}>{habit.name}</ThemedText>
                  <View style={styles.meta}>
                    <Image
                      source={require('@/assets/images/flame.svg')}
                      svgVariables={{ '--stroke': theme.flame }}
                      style={styles.flame}
                    />
                    <ThemedText
                      themeColor="textSecondary"
                      style={styles.metaText}
                    >
                      {habit.streak} days{habit.goal ? ` · ${habit.goal}` : ''}
                    </ThemedText>
                  </View>
                </View>

                <Checkbox
                  checked={checked}
                  onChange={(value) => setDone(habit.id, value)}
                  accessibilityLabel={
                    checked ? 'Mark as not done' : 'Mark as done'
                  }
                />
              </ThemedView>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
  },
  list: {
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: 20,
    padding: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 14,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  flame: {
    width: 14,
    height: 14,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
  },
});
