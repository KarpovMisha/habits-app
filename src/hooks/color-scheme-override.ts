import '@/lib/install-local-storage';

import { useSyncExternalStore } from 'react';
import { Appearance, Platform } from 'react-native';

type ColorSchemeOverride = 'light' | 'dark' | null;

const STORAGE_KEY = 'colorScheme';

// No localStorage during server rendering on web.
const isServer = typeof window === 'undefined';

// null follows the system. Kept in JS because react-native-web has no Appearance.setColorScheme.
let override = readStoredOverride();
applyToNative(override);

const listeners = new Set<() => void>();

function readStoredOverride(): ColorSchemeOverride {
  if (isServer) return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

function applyToNative(value: ColorSchemeOverride) {
  if (Platform.OS !== 'web') {
    // Lets native UI (alerts, keyboard, status bar) follow the chosen scheme too.
    Appearance.setColorScheme(value ?? 'unspecified');
  }
}

export function setColorSchemeOverride(value: ColorSchemeOverride) {
  override = value;
  applyToNative(value);
  if (value) {
    localStorage.setItem(STORAGE_KEY, value);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useColorSchemeOverride() {
  return useSyncExternalStore(
    subscribe,
    () => override,
    () => null,
  );
}
