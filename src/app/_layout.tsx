import AppUpdate from '@/components/app-update';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HabitsProvider } from '@/hooks/use-habits';
import { RemindersProvider } from '@/hooks/use-reminders';
import {
  DarkTheme,
  DefaultTheme,
  SplashScreen,
  Stack,
  ThemeProvider,
} from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Kept up until the stored session is read, so the login screen doesn't flash for signed-in users.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];

  useEffect(() => {
    if (!isLoading) SplashScreen.hide();
  }, [isLoading]);

  if (isLoading) return null;

  const signedIn = session !== null;

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

  // Keyed by user, so nothing from one account is left on screen after signing in as another.
  return (
    <HabitsProvider key={session?.user.id ?? 'signed-out'}>
      <RemindersProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Protected guard={signedIn}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="habit/[id]" />
              <Stack.Screen
                name="new-habit"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="edit-habit/[id]"
                options={{ presentation: 'modal', headerShown: false }}
              />
            </Stack.Protected>
            <Stack.Protected guard={!signedIn}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
          <AppUpdate />
        </ThemeProvider>
      </RemindersProvider>
    </HabitsProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
