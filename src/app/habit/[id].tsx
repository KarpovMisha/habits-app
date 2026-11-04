import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import HabitDetailsView from '@/components/habit-details/habit-details-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabits } from '@/hooks/use-habits';

export default function HabitDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, removeHabit } = useHabits();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <ThemedView style={styles.empty}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <ThemedText type="subtitle">Habit not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      {/* The view draws its own back button. */}
      <Stack.Screen options={{ headerShown: false }} />
      <HabitDetailsView
        habit={habit}
        onDelete={() => {
          router.back();
          removeHabit(habit.id);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
