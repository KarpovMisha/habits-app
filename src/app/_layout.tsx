import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HabitsProvider } from '@/hooks/use-habits';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { Appearance, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// TODO: temporary override until there's a theme switcher. 'unspecified' follows the system.
// react-native-web has no setColorScheme, so web always follows the browser.
if (Platform.OS !== 'web') {
  Appearance.setColorScheme('light');
}

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];

  // Navigation (screen backgrounds, headers) uses the same palette as our components.
  const navigationTheme = {
    ...base,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.backgroundSelected,
      notification: colors.flame,
    },
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <HabitsProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="new-habit" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="edit-habit/[id]" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </HabitsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
