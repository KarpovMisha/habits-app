import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import HabitForm from '@/components/habit-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabits } from '@/hooks/use-habits';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, updateHabit } = useHabits();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <ThemedView type="surface" style={styles.empty}>
        <ThemedText type="subtitle">Habit not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <HabitForm
      title="Edit habit"
      submitLabel="Save changes"
      initial={habit}
      onSubmit={(values) => {
        updateHabit(habit.id, values);
        router.back();
      }}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
