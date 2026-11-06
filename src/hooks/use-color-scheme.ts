import { useColorScheme as useRNColorScheme } from 'react-native';

import { useColorSchemeOverride } from './color-scheme-override';

export function useColorScheme() {
  const override = useColorSchemeOverride();
  const colorScheme = useRNColorScheme();

  return override ?? colorScheme;
}
