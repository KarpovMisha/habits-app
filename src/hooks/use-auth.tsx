import type { Session } from '@supabase/supabase-js';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { syncReminders } from '@/lib/reminders';
import { supabase } from '@/lib/supabase';

type AuthContextValue = {
  // null when signed out.
  session: Session | null;
  // true until the stored session has been read on launch.
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  // needsConfirmation: the account exists but the email must be confirmed before logging in.
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Earlier versions of the app signed in anonymously; those sessions don't count as signed in.
function registered(session: Session | null) {
  return session && !session.user.is_anonymous ? session : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fires right away with the stored session (INITIAL_SESSION), then on every change.
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(registered(next));
      setIsLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp: AuthContextValue['signUp'] = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  };

  const signOut: AuthContextValue['signOut'] = async () => {
    // Reminders belong to this account; don't leave them firing for the next one.
    await syncReminders([], {}, false);
    // 'local' keeps the user signed in on their other devices.
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  };

  return (
    <AuthContext value={{ session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
