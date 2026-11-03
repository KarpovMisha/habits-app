import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Checkbox } from '@/components/ui/checkbox';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

// [tint, ink] for the icon tile, per color scheme.
const Hues = {
  blue: { light: ['#CFE4FF', '#1D5FBF'], dark: ['#1C3557', '#8EC0FF'] },
  yellow: { light: ['#FFE8A3', '#8A5A00'], dark: ['#4A3A0E', '#FFD66B'] },
  green: { light: ['#C9F2DE', '#12704A'], dark: ['#143D2C', '#6FE0A8'] },
  violet: { light: ['#E5DCFF', '#5B4CF0'], dark: ['#2E2766', '#B3A8FF'] },
  pink: { light: ['#FFD6E0', '#B0264F'], dark: ['#4A1A2A', '#FF8FB0'] },
} as const;

type Habit = {
  id: string;
  name: string;
  goal: string;
  streak: number;
  hue: keyof typeof Hues;
  icon: ImageSource;
};

const HABITS: Habit[] = [
  { id: 'water', name: 'Drink water', goal: '8 glasses', streak: 12, hue: 'blue', icon: require('@/assets/images/water.svg') },
  { id: 'read', name: 'Read 20 minutes', goal: 'before bed', streak: 5, hue: 'yellow', icon: require('@/assets/images/book.svg') },
  { id: 'walk', name: 'Go for a walk', goal: '30 minutes', streak: 3, hue: 'green', icon: require('@/assets/images/sun.svg') },
  { id: 'calm', name: 'Meditate', goal: '10 min in the morning', streak: 21, hue: 'violet', icon: require('@/assets/images/leaf.svg') },
  { id: 'sugar', name: 'No sugar', goal: 'all day', streak: 2, hue: 'pink', icon: require('@/assets/images/stop.svg') },
];

export default function MyHabits() {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [done, setDone] = useState<Record<string, boolean>>({
    water: true,
    read: true,
    calm: true,
  });

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>My habits</ThemedText>

      <View style={styles.list}>
        {HABITS.map((habit) => {
          const [tint, ink] = Hues[habit.hue][scheme];
          const checked = !!done[habit.id];

          return (
            <ThemedView key={habit.id} type="surface" style={styles.card}>
              <View style={[styles.iconTile, { backgroundColor: tint }]}>
                <Image source={habit.icon} svgVariables={{ '--stroke': ink }} style={styles.icon} />
              </View>

              <View style={styles.info}>
                <ThemedText style={styles.name}>{habit.name}</ThemedText>
                <View style={styles.meta}>
                  <Image
                    source={require('@/assets/images/flame.svg')}
                    svgVariables={{ '--stroke': theme.flame }}
                    style={styles.flame}
                  />
                  <ThemedText themeColor="textSecondary" style={styles.metaText}>
                    {habit.streak} days · {habit.goal}
                  </ThemedText>
                </View>
              </View>

              <Checkbox
                checked={checked}
                onChange={(value) => setDone((prev) => ({ ...prev, [habit.id]: value }))}
                accessibilityLabel={checked ? 'Mark as not done' : 'Mark as done'}
              />
            </ThemedView>
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
