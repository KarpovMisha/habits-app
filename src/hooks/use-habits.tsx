import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { setCompletion, toDateKey } from '@/api/habit-completions';
import type { Habit } from '@/constants/habits';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type HabitRow = Database['public']['Tables']['habits']['Row'];
type HabitValues = Omit<Habit, 'id' | 'streak'>;

function fromRow(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    goal: row.goal,
    icon: row.icon as Habit['icon'],
    hue: row.hue as Habit['hue'],
    timeOfDay: row.time_of_day as Habit['timeOfDay'],
    days: row.days,
    streak: 0, // computed on the details screen from completions
  };
}

function toRow(values: HabitValues) {
  return {
    name: values.name,
    goal: values.goal,
    icon: values.icon,
    hue: values.hue,
    time_of_day: values.timeOfDay,
    days: values.days,
  };
}

type HabitsContextValue = {
  habits: Habit[];
  done: Record<string, boolean>;
  addHabit: (habit: HabitValues) => void;
  setDone: (id: string, value: boolean) => void;
  updateHabit: (id: string, changes: HabitValues) => void;
  removeHabit: (id: string) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [done, setDoneState] = useState<Record<string, boolean>>({});
  const userId = useAuth().session?.user.id;

  // The provider is keyed by user in the root layout, so this only loads once per account.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const today = toDateKey(new Date());
      const [habitsResult, doneResult] = await Promise.all([
        supabase.from('habits').select('*').order('created_at'),
        supabase.from('completions').select('habit_id').eq('date', today),
      ]);
      if (cancelled) return;
      if (habitsResult.error) throw habitsResult.error;
      if (doneResult.error) throw doneResult.error;

      setHabits(habitsResult.data.map(fromRow));
      setDoneState(
        Object.fromEntries(doneResult.data.map((row) => [row.habit_id, true])),
      );
    })().catch((error) =>
      console.warn('Failed to load habits:', error.message),
    );

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addHabit: HabitsContextValue['addHabit'] = async (habit) => {
    // The database generates the id, so wait for the inserted row.
    const { data, error } = await supabase
      .from('habits')
      .insert(toRow(habit))
      .select()
      .single();
    if (error) return console.warn('Failed to add habit:', error.message);
    setHabits((prev) => [...prev, fromRow(data)]);
  };

  const updateHabit: HabitsContextValue['updateHabit'] = async (
    id,
    changes,
  ) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...changes } : habit)),
    );
    const { error } = await supabase
      .from('habits')
      .update(toRow(changes))
      .eq('id', id);
    if (error) console.warn('Failed to update habit:', error.message);
  };

  const removeHabit: HabitsContextValue['removeHabit'] = async (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    setDoneState(({ [id]: _, ...rest }) => rest);
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) console.warn('Failed to delete habit:', error.message);
  };

  // "Done today" on the home screen is a completion for today's date.
  const setDone: HabitsContextValue['setDone'] = (id, value) => {
    setDoneState((prev) => ({ ...prev, [id]: value }));
    setCompletion(id, toDateKey(new Date()), value).catch(() =>
      setDoneState((prev) => ({ ...prev, [id]: !value })),
    );
  };

  return (
    <HabitsContext
      value={{ habits, done, addHabit, setDone, updateHabit, removeHabit }}
    >
      {children}
    </HabitsContext>
  );
}

export function useHabits() {
  const context = use(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used inside HabitsProvider');
  }
  return context;
}
