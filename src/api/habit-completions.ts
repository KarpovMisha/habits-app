import { supabase } from '@/lib/supabase';

export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export async function fetchCompletions(habitId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('completions')
    .select('date')
    .eq('habit_id', habitId);
  if (error) throw error;
  return data.map((row) => row.date);
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
