import type { ImageSource } from 'expo-image';

// [tint, ink] for the icon tile, per color scheme.
export const Hues = {
  blue: { light: ['#CFE4FF', '#1D5FBF'], dark: ['#1C3557', '#8EC0FF'] },
  yellow: { light: ['#FFE8A3', '#8A5A00'], dark: ['#4A3A0E', '#FFD66B'] },
  green: { light: ['#C9F2DE', '#12704A'], dark: ['#143D2C', '#6FE0A8'] },
  violet: { light: ['#E5DCFF', '#5B4CF0'], dark: ['#2E2766', '#B3A8FF'] },
  pink: { light: ['#FFD6E0', '#B0264F'], dark: ['#4A1A2A', '#FF8FB0'] },
} as const;

export const HabitIcons = {
  water: require('@/assets/images/water.svg'),
  book: require('@/assets/images/book.svg'),
  sun: require('@/assets/images/sun.svg'),
  leaf: require('@/assets/images/leaf.svg'),
  moon: require('@/assets/images/moon.svg'),
} satisfies Record<string, ImageSource>;

export const TimesOfDay = ['morning', 'afternoon', 'evening'] as const;

// Monday first; index matches `Habit.days`.
export const WeekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export type Habit = {
  id: string;
  name: string;
  goal: string;
  streak: number;
  hue: keyof typeof Hues;
  icon: keyof typeof HabitIcons;
  timeOfDay: (typeof TimesOfDay)[number];
  days: boolean[];
};
