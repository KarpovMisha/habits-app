import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { useColorSchemeOverride } from './color-scheme-override';

const noopSubscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  // false during server rendering and hydration, true once on the client.
  const hasHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const override = useColorSchemeOverride();
  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return override ?? colorScheme;
  }

  return 'light';
}
