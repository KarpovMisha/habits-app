import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { Alert, Linking } from 'react-native';

import { fetchRemindersEnabled, setRemindersEnabled } from '@/api/profile';
import { useHabits } from '@/hooks/use-habits';
import { ensureSession } from '@/lib/supabase';
import { requestReminderPermission, syncReminders } from '@/lib/reminders';

type RemindersContextValue = {
  // null until the setting is loaded.
  enabled: boolean | null;
  setEnabled: (value: boolean) => void;
};

const RemindersContext = createContext<RemindersContextValue | null>(null);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const { habits, done } = useHabits();
  const [enabled, setEnabledState] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureSession()
      .then(fetchRemindersEnabled)
      .then((value) => {
        if (!cancelled) setEnabledState(value);
      })
      .catch((error) =>
        console.warn('Failed to load reminders setting:', error.message),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  // Keeps scheduled notifications in line with habits and today's completions.
  useEffect(() => {
    if (enabled === null) return;
    syncReminders(habits, done, enabled);
  }, [habits, done, enabled]);

  const setEnabled: RemindersContextValue['setEnabled'] = async (value) => {
    if (value && !(await requestReminderPermission())) {
      Alert.alert(
        'Notifications are off',
        'Allow notifications for this app in Settings to get reminders.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const previous = enabled;
    setEnabledState(value);
    setRemindersEnabled(value).catch((error) => {
      console.warn('Failed to save reminders setting:', error.message);
      setEnabledState(previous);
    });
  };

  return (
    <RemindersContext value={{ enabled, setEnabled }}>
      {children}
    </RemindersContext>
  );
}

export function useReminders() {
  const context = use(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used inside RemindersProvider');
  }
  return context;
}
