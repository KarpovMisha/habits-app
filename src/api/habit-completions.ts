import { supabase } from '@/lib/supabase';

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
export async function fetchAllCompletions(): Promise<Record<string, Set<string>>> {
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
