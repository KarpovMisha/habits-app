import '@/lib/install-local-storage';

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { AppState } from 'react-native';

import type { Database } from '@/types/database';

// No localStorage during server rendering on web.
const isServer = typeof window === 'undefined';

// A local Supabase on 127.0.0.1 is unreachable from a phone, so in development
// point it at the machine running the dev server instead.
function supabaseUrl() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (!__DEV__ || !devHost) return url;
  return url.replace(/\/\/(127\.0\.0\.1|localhost)(?=[:/]|$)/, `//${devHost}`);
}

export const supabase = createClient<Database>(
  supabaseUrl(),
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      storage: isServer ? undefined : localStorage,
      autoRefreshToken: !isServer,
      persistSession: !isServer,
      detectSessionInUrl: false,
    },
  },
);

// Refresh the auth token only while the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Shared, so parallel callers on first launch don't create two anonymous users.
let sessionPromise: ReturnType<typeof signInIfNeeded> | null = null;

// Signs in anonymously on first launch, so every user has an id before any registration.
export function ensureSession() {
  sessionPromise ??= signInIfNeeded().catch((error) => {
    sessionPromise = null;
    throw error;
  });
  return sessionPromise;
}

async function signInIfNeeded() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  const { data: signIn, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return signIn.session;
}
