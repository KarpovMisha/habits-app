import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInputInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthField from '@/components/auth/auth-field';
import AuthModeSwitch, {
  type AuthMode,
} from '@/components/auth/auth-mode-switch';
import { ThemedText } from '@/components/themed-text';
import { Hues } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

// Same as minimum_password_length in supabase/config.toml.
const MinPasswordLength = 8;

const Brand = '#5B4CF0';

type Message = { kind: 'error' | 'info'; text: string };

export default function Login() {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const signup = mode === 'signup';
  const canSubmit =
    !busy &&
    email.trim().length > 0 &&
    password.length > 0 &&
    (!signup || name.trim().length > 0);

  const changeMode = (next: AuthMode) => {
    setMode(next);
    setMessage(null);
  };

  // On success the session changes and the root layout swaps this screen for the app.
  const submit = async () => {
    if (!canSubmit) return;
    if (signup && password.length < MinPasswordLength) {
      setMessage({
        kind: 'error',
        text: `Password must be at least ${MinPasswordLength} characters.`,
      });
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      if (!signup) {
        await signIn(email.trim(), password);
        return;
      }
      const { needsConfirmation } = await signUp(
        name.trim(),
        email.trim(),
        password,
      );
      if (needsConfirmation) {
        setMode('login');
        setMessage({
          kind: 'info',
          text: 'Check your email to confirm your account, then log in.',
        });
      }
    } catch (error) {
      setMessage({
        kind: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  const messageColor =
    message?.kind === 'error' ? Hues.pink[scheme][1] : theme.textSecondary;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        bounces={false}
        overScrollMode="never"
      >
        <View
          style={[styles.header, { paddingTop: insets.top + Spacing.five }]}
        >
          <View style={styles.logo}>
            <Image
              source={require('@/assets/images/check.svg')}
              svgVariables={{ '--stroke': '#3A2E00' }}
              style={styles.logoIcon}
            />
          </View>
          <Text style={styles.title}>Habits</Text>
          <Text style={styles.tagline}>Small steps, every day</Text>
        </View>

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              paddingBottom: insets.bottom + Spacing.five,
            },
          ]}
        >
          <AuthModeSwitch mode={mode} onChange={changeMode} />

          {signup && (
            <AuthField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          )}

          <AuthField
            ref={emailRef}
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType={signup ? 'username' : 'emailAddress'}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <AuthField
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder={`At least ${MinPasswordLength} characters`}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={signup ? 'new-password' : 'current-password'}
            textContentType={signup ? 'newPassword' : 'password'}
            returnKeyType="go"
            onSubmitEditing={submit}
          />

          {message && (
            <ThemedText
              type="small"
              accessibilityLiveRegion="polite"
              style={[styles.message, { color: messageColor }]}
            >
              {message.text}
            </ThemedText>
          )}

          <View style={styles.spacer} />

          <Pressable
            onPress={submit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit, busy }}
            style={({ pressed }) => [
              styles.button,
              !canSubmit && !busy && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            {busy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {signup ? 'Create account' : 'Log in'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand,
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    alignItems: 'flex-start',
    gap: 14,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFD84D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 34,
    height: 34,
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: 800,
    letterSpacing: -1,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 600,
    color: '#E3DFFF',
  },
  sheet: {
    flexGrow: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.four,
    paddingHorizontal: 20,
    gap: 18,
  },
  message: {
    textAlign: 'center',
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: Brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 800,
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
