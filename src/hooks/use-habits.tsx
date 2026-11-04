import { createContext, use, useState, type ReactNode } from 'react';

import type { Habit } from '@/constants/habits';

type HabitsContextValue = {
  habits: Habit[];
  done: Record<string, boolean>;
  addHabit: (habit: Omit<Habit, 'id' | 'streak'>) => void;
  setDone: (id: string, value: boolean) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

// In-memory only for now: habits are lost when the app restarts.
export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [done, setDoneState] = useState<Record<string, boolean>>({});

  const addHabit: HabitsContextValue['addHabit'] = (habit) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setHabits((prev) => [...prev, { ...habit, id, streak: 0 }]);
  };

  const setDone: HabitsContextValue['setDone'] = (id, value) => {
    setDoneState((prev) => ({ ...prev, [id]: value }));
  };

  return <HabitsContext value={{ habits, done, addHabit, setDone }}>{children}</HabitsContext>;
}

export function useHabits() {
  const context = use(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used inside HabitsProvider');
  }
  return context;
}
