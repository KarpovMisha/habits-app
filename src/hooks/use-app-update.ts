import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import { compareVersions } from '@/lib/version';

export type UpdateStatus = 'none' | 'optional' | 'required';

type AppUpdate = {
  status: UpdateStatus;
  latestVersion: string | null;
  storeUrl: string | null;
  // Hides the optional banner until a newer version than this one comes out.
  dismiss: () => void;
};

// The latest version the user tapped "Later" on.
const DismissedKey = 'app-update-dismissed';

function readDismissed() {
  try {
    return localStorage.getItem(DismissedKey);
  } catch {
    return null;
  }
}

// Compares the running version with `app_config` in Supabase. Any failure means 'none':
// the app must not lock itself because the server is unreachable.
export function useAppUpdate(): AppUpdate {
  const [status, setStatus] = useState<UpdateStatus>('none');
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    // In Expo Go, expo-application would report Expo Go's own version, so read app.json instead.
    const current = Constants.expoConfig?.version;
    if (!current) return;

    let cancelled = false;
    supabase
      .from('app_config')
      .select('latest_version, min_version, store_url')
      .eq('platform', Platform.OS)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn('Failed to check for updates:', error.message);
          return;
        }
        if (!data) return;

        setLatestVersion(data.latest_version);
        setStoreUrl(data.store_url);
        if (compareVersions(current, data.min_version) < 0) {
          setStatus('required');
        } else if (
          compareVersions(current, data.latest_version) < 0 &&
          readDismissed() !== data.latest_version
        ) {
          setStatus('optional');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    if (status !== 'optional') return;
    try {
      if (latestVersion) localStorage.setItem(DismissedKey, latestVersion);
    } catch {
      // Not remembered; the banner just comes back on the next launch.
    }
    setStatus('none');
  };

  return { status, latestVersion, storeUrl, dismiss };
}
