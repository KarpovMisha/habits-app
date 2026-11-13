import type { Habit } from '@/constants/habits';

// No local notifications on web: reminders are hidden there.
export async function requestReminderPermission(): Promise<boolean> {
  return false;
}

export async function syncReminders(
  _habits: Habit[],
  _done: Record<string, boolean>,
  _enabled: boolean,
): Promise<void> {}
