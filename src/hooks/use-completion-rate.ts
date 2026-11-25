import {
  completionRate,
  fetchCompletionsBetween,
  periodStart,
  toDateKey,
  type Period,
} from '@/api/habit-completions';
import { useHabits } from '@/hooks/use-habits';
import { useEffect, useState } from 'react';

export function useCompletionRate(period: Period) {
  const { habits, done } = useHabits();
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const from = periodStart(period, today);
    fetchCompletionsBetween(toDateKey(from), toDateKey(today))
      .then((rows) => {
        if (!cancelled) setRate(completionRate(habits, rows, from, today));
      })
      .catch((e) => console.warn('Failed to load stats:', e.message));
    return () => {
      cancelled = true;
    };
  }, [period, habits, done]); // `done` needed so that the percentage updates immediately

  return rate;
}
