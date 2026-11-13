import { supabase } from '@/lib/supabase';

// The profile row is created on the first change, so a missing row means defaults.
export async function fetchRemindersEnabled(): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('reminders_enabled')
    .maybeSingle();
  if (error) throw error;
  return data?.reminders_enabled ?? false;
}

export async function setRemindersEnabled(enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ reminders_enabled: enabled, updated_at: new Date().toISOString() });
  if (error) throw error;
}
