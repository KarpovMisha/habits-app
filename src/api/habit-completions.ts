import { supabase } from '@/lib/supabase';

import { isScheduledOn, type Habit } from '@/constants/habits';

export type Period = 'week' | 'month' | 'year';

export function periodStart(period: Period, today: Date) {
  if (period === 'week') return addDays(today, -((today.getDay() + 6) % 7)); // monday
  if (period === 'month')
    return new Date(today.getFullYear(), today.getMonth(), 1);
  return new Date(today.getFullYear(), 0, 1);
}

export async function fetchCompletionsBetween(from: string, to: string) {
  const { data, error } = await supabase
    .from('completions')
    .select('habit_id, date')
    .gte('date', from)
    .lte('date', to);
  if (error) throw error;
  return data;
}

export function completionRate(
  habits: Habit[],
  rows: { habit_id: string; date: string }[],
  from: Date,
  to: Date,
): number | null {
  const done = new Set(rows.map((r) => `${r.habit_id}|${r.date}`));
  let scheduled = 0;
  let completed = 0;
  for (let day = from; day <= to; day = addDays(day, 1)) {
    const key = toDateKey(day);
    for (const habit of habits) {
      if (!isScheduledOn(habit, day)) continue;
      scheduled++;
      if (done.has(`${habit.id}|${key}`)) completed++;
    }
  }
  return scheduled ? Math.round((completed / scheduled) * 100) : null;
}

export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

// Current streak counts back from today, or from yesterday if today isn't done yet.
export function currentStreak(completed: Set<string>, today: Date) {
  let day = completed.has(toDateKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (completed.has(toDateKey(day))) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

export async function fetchCompletions(habitId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('completions')
    .select('date')
    .eq('habit_id', habitId);
  if (error) throw error;
  return data.map((row) => row.date);
}

// Completed dates for every habit, keyed by habit id.
export async function fetchAllCompletions(): Promise<
  Record<string, Set<string>>
> {
  const { data, error } = await supabase
    .from('completions')
    .select('habit_id, date');
  if (error) throw error;
  const byHabit: Record<string, Set<string>> = {};
  for (const row of data) {
    (byHabit[row.habit_id] ??= new Set()).add(row.date);
  }
  return byHabit;
}

export async function setCompletion(
  habitId: string,
  dateKey: string,
  done: boolean,
): Promise<void> {
  const { error } = done
    ? await supabase
        .from('completions')
        .upsert(
          { habit_id: habitId, date: dateKey },
          { onConflict: 'habit_id,date', ignoreDuplicates: true },
        )
    : await supabase
        .from('completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('date', dateKey);
  if (error) throw error;
}
