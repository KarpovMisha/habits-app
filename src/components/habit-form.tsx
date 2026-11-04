import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HabitIcons, Hues, TimesOfDay, WeekDays, type Habit } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

const TimeLabels: Record<Habit['timeOfDay'], string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

function repeatLabel(days: boolean[]) {
  const count = days.filter(Boolean).length;
  if (count === 7) return 'Every day';
  if (count === 0) return 'Never';
  if (count === 5 && days.slice(0, 5).every(Boolean)) return 'Weekdays';
  if (count === 2 && days[5] && days[6]) return 'Weekends';
  return `${count} ${count === 1 ? 'day' : 'days'} a week`;
}

export type HabitFormValues = Omit<Habit, 'id' | 'streak'>;

type HabitFormProps = {
  title: string;
  submitLabel: string;
  // Prefills the form when editing; a new habit starts from defaults.
  initial?: HabitFormValues;
  onSubmit: (values: HabitFormValues) => void;
};

export default function HabitForm({ title, submitLabel, initial, onSubmit }: HabitFormProps) {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(initial?.name ?? '');
  const [goal, setGoal] = useState(initial?.goal ?? '');
  const [icon, setIcon] = useState<Habit['icon']>(initial?.icon ?? 'water');
  const [hue, setHue] = useState<Habit['hue']>(initial?.hue ?? 'blue');
  const [timeOfDay, setTimeOfDay] = useState<Habit['timeOfDay']>(initial?.timeOfDay ?? 'morning');
  const [days, setDays] = useState<boolean[]>(() => initial?.days ?? WeekDays.map(() => true));
  const [focused, setFocused] = useState<'name' | 'goal' | null>(null);

  const canSubmit = name.trim().length > 0 && days.some(Boolean);

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), goal: goal.trim(), icon, hue, timeOfDay, days });
  };

  const fieldStyle = (field: 'name' | 'goal') => [
    styles.input,
    {
      color: theme.text,
      backgroundColor: focused === field ? theme.surface : theme.field,
      borderColor: focused === field ? theme.primary : theme.fieldBorder,
    },
  ];

  return (
    <ThemedView type="surface" style={styles.container}>
      <View style={[styles.handle, { backgroundColor: theme.fieldBorder }]} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={[styles.closeButton, { backgroundColor: theme.field }]}>
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              tintColor={theme.text}
              size={18}
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={'e.g. “Drink water”'}
            placeholderTextColor={theme.textSecondary}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            returnKeyType="next"
            autoFocus={!initial}
            style={fieldStyle('name')}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Goal</ThemedText>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="8 glasses, 20 minutes..."
            placeholderTextColor={theme.textSecondary}
            onFocus={() => setFocused('goal')}
            onBlur={() => setFocused(null)}
            style={fieldStyle('goal')}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Icon</ThemedText>
          <View style={styles.row}>
            {(Object.keys(HabitIcons) as Habit['icon'][]).map((key) => {
              const selected = key === icon;
              // The selected icon previews the chosen color, as it will look in the habits list.
              const [tint, ink] = Hues[hue][scheme];
              return (
                <Pressable
                  key={key}
                  onPress={() => setIcon(key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={key}
                  style={[
                    styles.iconOption,
                    selected
                      ? { backgroundColor: tint, borderColor: ink }
                      : { backgroundColor: theme.field },
                  ]}>
                  <Image
                    source={HabitIcons[key]}
                    svgVariables={{ '--stroke': selected ? ink : theme.text }}
                    style={styles.iconImage}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Color</ThemedText>
          <View style={styles.colors}>
            {(Object.keys(Hues) as Habit['hue'][]).map((key) => {
              const selected = key === hue;
              return (
                <Pressable
                  key={key}
                  onPress={() => setHue(key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={key}
                  style={[
                    styles.colorOption,
                    { backgroundColor: Hues[key][scheme][0] },
                    selected && { borderColor: theme.text },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Time of day</ThemedText>
          <View style={[styles.segmented, { backgroundColor: theme.field }]}>
            {TimesOfDay.map((time) => {
              const selected = time === timeOfDay;
              return (
                <Pressable
                  key={time}
                  onPress={() => setTimeOfDay(time)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[
                    styles.segment,
                    selected && [styles.segmentSelected, { backgroundColor: theme.surface }],
                  ]}>
                  <ThemedText
                    themeColor={selected ? 'text' : 'textSecondary'}
                    style={styles.segmentText}>
                    {TimeLabels[time]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.repeatHeader}>
            <ThemedText style={styles.label}>Repeat</ThemedText>
            <ThemedText themeColor="primary" style={styles.label}>
              {repeatLabel(days)}
            </ThemedText>
          </View>
          <View style={styles.row}>
            {WeekDays.map((day, index) => {
              const selected = days[index];
              return (
                <Pressable
                  key={index}
                  onPress={() => setDays((prev) => prev.map((d, i) => (i === index ? !d : d)))}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={[styles.day, { backgroundColor: selected ? theme.primary : theme.field }]}>
                  <ThemedText
                    style={[styles.dayText, { color: selected ? '#ffffff' : theme.textSecondary }]}>
                    {day}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={submit}
          disabled={!canSubmit}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: theme.primary },
            !canSubmit && styles.disabled,
            pressed && styles.pressed,
          ]}>
          <ThemedText style={styles.createText}>{submitLabel}</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 999,
    marginTop: Spacing.two,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 800,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    fontWeight: 500,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  iconOption: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  colors: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: Spacing.one,
  },
  segment: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
  },
  segmentText: {
    fontSize: 15,
    fontWeight: 700,
  },
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 15,
    fontWeight: 800,
  },
  createButton: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  createText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 800,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
