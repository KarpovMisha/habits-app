import { router } from 'expo-router';

import HabitForm from '@/components/habit-form';
import { useHabits } from '@/hooks/use-habits';

export default function NewHabitScreen() {
  const { addHabit } = useHabits();

  return (
    <HabitForm
      title="New habit"
      submitLabel="Create habit"
      onSubmit={(values) => {
        addHabit(values);
        router.back();
      }}
    />
  );
}
