import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HabitIcons, Hues } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabits } from '@/hooks/use-habits';
import { useTheme } from '@/hooks/use-theme';

export default function HabitDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { habits } = useHabits();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <ThemedView style={styles.empty}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <ThemedText type="subtitle">Habit not found</ThemedText>
      </ThemedView>
    );
  }

  const [tint, ink] = Hues[habit.hue][scheme];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: habit.name }} />

      <View style={[styles.iconTile, { backgroundColor: tint }]}>
        <Image source={HabitIcons[habit.icon]} svgVariables={{ '--stroke': ink }} style={styles.icon} />
      </View>

      <ThemedText type="subtitle">{habit.name}</ThemedText>
      <ThemedText themeColor="textSecondary">{habit.goal}</ThemedText>

      <View style={styles.streak}>
        <Image
          source={require('@/assets/images/flame.svg')}
          svgVariables={{ '--stroke': theme.flame }}
          style={styles.flame}
        />
        <ThemedText style={styles.streakText}>{habit.streak} day streak</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTile: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  icon: {
    width: 44,
    height: 44,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  flame: {
    width: 18,
    height: 18,
  },
  streakText: {
    fontWeight: 700,
  },
});
