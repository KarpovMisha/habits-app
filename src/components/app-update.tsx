import { SymbolView } from 'expo-symbols';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAppUpdate } from '@/hooks/use-app-update';
import { useTheme } from '@/hooks/use-theme';

// Rendered over the whole app: a blocking screen below `min_version`, a banner to restart
// once an over-the-air update (EAS Update) has downloaded, a banner below `latest_version`
// for changes that need a new APK, nothing otherwise.
export default function AppUpdate() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { status, latestVersion, storeUrl, dismiss } = useAppUpdate();
  // expo-updates checks on launch and downloads in the background; always false on web and in dev.
  const { isUpdatePending } = Updates.useUpdates();
  const [otaDismissed, setOtaDismissed] = useState(false);
  const showOta = isUpdatePending && !otaDismissed && status !== 'required';

  if (status === 'none' && !showOta) return null;

  const openStore = () => {
    if (storeUrl) Linking.openURL(storeUrl);
  };

  if (status === 'required') {
    return (
      <ThemedView style={[StyleSheet.absoluteFill, styles.required]}>
        <View style={[styles.iconTile, { backgroundColor: theme.primary }]}>
          <SymbolView
            name={{
              ios: 'arrow.down.circle',
              android: 'system_update',
              web: 'system_update',
            }}
            tintColor="#ffffff"
            size={36}
          />
        </View>
        <ThemedText type="subtitle" style={styles.centered}>
          Update required
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.centered}>
          This version is no longer supported. Install version {latestVersion}{' '}
          to keep using the app.
        </ThemedText>
        {!!storeUrl && (
          <Pressable
            onPress={openStore}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.primary },
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={styles.primaryButtonText}>Update</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    );
  }

  // The OTA update wins over the APK banner: it applies with one tap, no download.
  const banner = showOta
    ? {
        title: 'Update ready',
        subtitle: 'Restart to get the latest changes',
        action: 'Restart',
        onAction: () => Updates.reloadAsync(),
        onLater: () => setOtaDismissed(true),
      }
    : {
        title: 'New version available',
        subtitle: `Version ${latestVersion} is out`,
        action: 'Update',
        onAction: storeUrl ? openStore : null,
        onLater: dismiss,
      };

  return (
    <ThemedView
      type="surface"
      style={[styles.banner, { top: insets.top + Spacing.two }]}
    >
      <View style={styles.bannerText}>
        <ThemedText style={styles.bannerTitle}>{banner.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.bannerSubtitle}>
          {banner.subtitle}
        </ThemedText>
      </View>
      <Pressable
        onPress={banner.onLater}
        accessibilityRole="button"
        style={({ pressed }) => [styles.laterButton, pressed && styles.pressed]}
      >
        <ThemedText themeColor="textSecondary" style={styles.buttonText}>
          Later
        </ThemedText>
      </Pressable>
      {banner.onAction && (
        <Pressable
          onPress={banner.onAction}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.updateButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={[styles.buttonText, styles.onPrimary]}>
            {banner.action}
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  required: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.five,
  },
  iconTile: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  centered: {
    textAlign: 'center',
  },
  primaryButton: {
    alignSelf: 'stretch',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 800,
  },
  banner: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 20,
    padding: Spacing.three,
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
  },
  bannerText: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
  },
  laterButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  updateButton: {
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 700,
  },
  onPrimary: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
});
