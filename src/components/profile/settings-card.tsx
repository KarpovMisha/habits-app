import Constants from 'expo-constants';
import { useState } from 'react';
import { StyleSheet, Switch } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { setColorSchemeOverride } from '@/hooks/color-scheme-override';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

import SettingsRow from './settings-row';

export default function SettingsCard() {
  const theme = useTheme();
  const isDark = useColorScheme() === 'dark';
  const [reminders, setReminders] = useState(true);

  const trackColor = { false: theme.unchecked, true: theme.primary };

  return (
    <ThemedView type="surface" style={styles.card}>
      <SettingsRow
        icon={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
        label="Reminders"
        divider
        accessory={
          <Switch
            value={reminders}
            onValueChange={setReminders}
            trackColor={trackColor}
            thumbColor="#ffffff"
          />
        }
      />
      <SettingsRow
        icon={{ ios: 'moon', android: 'dark_mode', web: 'dark_mode' }}
        label="Dark mode"
        divider
        accessory={
          <Switch
            value={isDark}
            onValueChange={(value) =>
              setColorSchemeOverride(value ? 'dark' : 'light')
            }
            trackColor={trackColor}
            thumbColor="#ffffff"
          />
        }
      />
      <SettingsRow
        icon={{ ios: 'info.circle', android: 'info', web: 'info' }}
        label="App version"
        accessory={
          <ThemedText themeColor="textSecondary" style={styles.value}>
            {Constants.expoConfig?.version}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.four,
  },
  value: {
    fontWeight: 700,
  },
});
