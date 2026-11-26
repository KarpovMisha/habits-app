import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHero from '@/components/home/home-hero';
import MyHabits from '@/components/home/my-habits';
import ProgressCard from '@/components/home/progress-card';
import { ThemedView } from '@/components/themed-view';
import { isScheduledOn } from '@/constants/habits';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/use-habits';

export default function HomeScreen() {
  const { habits: allHabits, done } = useHabits();
  const today = new Date();
  const habits = allHabits.filter((habit) => isScheduledOn(habit, today));
  const doneCount = habits.filter((habit) => done[habit.id]).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <HomeHero />
          <ProgressCard done={doneCount} total={habits.length} />
          <MyHabits />
        </ScrollView>
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
    maxWidth: MaxContentWidth,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
});
