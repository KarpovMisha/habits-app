import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { Appearance, Platform } from 'react-native';

// TODO: temporary override until there's a theme switcher. 'unspecified' follows the system.
// react-native-web has no setColorScheme, so web always follows the browser.
if (Platform.OS !== 'web') {
  Appearance.setColorScheme('light');
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
