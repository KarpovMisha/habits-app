import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { addDays, toDateKey } from '@/api/habit-completions';
import { isScheduledOn, TimesOfDay, type Habit } from '@/constants/habits';

// Hour of the reminder for each time of day: near the end of the slot, to catch what is still left.
export const ReminderHours: Record<Habit['timeOfDay'], number> = {
  morning: 9,
  afternoon: 14,
  evening: 20,
};

const SlotTitles: Record<Habit['timeOfDay'], string> = {
  morning: 'Morning habits',
  afternoon: 'Afternoon habits',
  evening: 'Evening habits',
};

// Local notifications can't check completions when they fire, so we schedule a week ahead
// and reschedule whenever habits or today's completions change.
const DaysAhead = 7;

const ChannelId = 'reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Android 13+ only shows the permission prompt once a channel exists.
// Expo Go on Android fails to create channels, so fall back to the default one there.
const channelReady: Promise<string | undefined> =
  Platform.OS === 'android'
    ? Notifications.setNotificationChannelAsync(ChannelId, {
        name: 'Reminders',
        importance: AndroidImportance.DEFAULT,
      }).then(
        () => ChannelId,
        (error) => {
          console.warn('Failed to create reminders channel:', error.message);
          return undefined;
        },
      )
    : Promise.resolve(undefined);

export async function requestReminderPermission(): Promise<boolean> {
  await channelReady;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export type ReminderSlot = {
  date: Date;
  timeOfDay: Habit['timeOfDay'];
  habits: Habit[];
};

// One slot per day and time of day, with the habits still left in it.
export function reminderSlots(
  habits: Habit[],
  done: Record<string, boolean>,
  now: Date,
): ReminderSlot[] {
  const slots: ReminderSlot[] = [];
  for (let offset = 0; offset < DaysAhead; offset++) {
    const day = addDays(now, offset);
    for (const timeOfDay of TimesOfDay) {
      const date = new Date(day);
      date.setHours(ReminderHours[timeOfDay]);
      if (date <= now) continue;

      // Completions are only known for today; later days start with nothing done.
      const left = habits.filter(
        (habit) =>
          habit.timeOfDay === timeOfDay &&
          isScheduledOn(habit, day) &&
          !(offset === 0 && done[habit.id]),
      );
      if (left.length > 0) slots.push({ date, timeOfDay, habits: left });
    }
  }
  return slots;
}

function slotContent(slot: ReminderSlot): Notifications.NotificationContentInput {
  const count = slot.habits.length;
  const names = slot.habits.map((habit) => habit.name).join(', ');
  return {
    title: SlotTitles[slot.timeOfDay],
    body: `${count} left: ${names}`,
  };
}

// Serializes syncs, so a slow one can't schedule over a newer one.
let queue = Promise.resolve();

export function syncReminders(
  habits: Habit[],
  done: Record<string, boolean>,
  enabled: boolean,
): Promise<void> {
  queue = queue
    .then(async () => {
      // Reminders are the only notifications the app schedules.
      await Notifications.cancelAllScheduledNotificationsAsync();
      if (!enabled) return;
      const { granted } = await Notifications.getPermissionsAsync();
      if (!granted) return;

      const channelId = await channelReady;
      for (const slot of reminderSlots(habits, done, new Date())) {
        await Notifications.scheduleNotificationAsync({
          identifier: `reminder-${toDateKey(slot.date)}-${slot.timeOfDay}`,
          content: slotContent(slot),
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: slot.date,
            channelId,
          },
        });
      }
    })
    .catch((error) => console.warn('Failed to schedule reminders:', error.message));
  return queue;
}
