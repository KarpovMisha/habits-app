import { router } from 'expo-router';

import { DEMO_HABIT_ID } from '@/api/habit-completions';
import HabitDetailsView from '@/components/habit-details/habit-details-view';
import type { Habit } from '@/constants/habits';

// Mocked habit until this tab knows which habit to show.
const DEMO_HABIT: Habit = {
  id: DEMO_HABIT_ID,
  name: 'Meditate',
  goal: '10 min in the morning',
  streak: 21,
  hue: 'violet',
  icon: 'leaf',
  timeOfDay: 'morning',
  days: [true, true, true, true, true, true, true],
};

export default function HabitDetails() {
  return <HabitDetailsView habit={DEMO_HABIT} onDelete={() => router.replace('/')} />;
}
