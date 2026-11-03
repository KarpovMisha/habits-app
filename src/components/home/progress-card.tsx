import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ProgressCardProps = {
  done: number;
  total: number;
};

export default function ProgressCard({ done, total }: ProgressCardProps) {
  const ratio = total > 0 ? Math.min(Math.max(done / total, 0), 1) : 0;

  // Animate from the previous ratio to the new one whenever `done` or `total` changes.
  const progress = useSharedValue(ratio);

  useEffect(() => {
    progress.set(withTiming(ratio, { duration: 400 }));
  }, [ratio, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.get() * 100}%`,
  }));

  return (
    <ThemedView type="backgroundPrimary" style={styles.container}>
      <ThemedText themeColor="textInvert" style={styles.label}>
        Done today
      </ThemedText>

      <View style={styles.row}>
        <ThemedText themeColor="textInvert" style={styles.statistic}>
          {done} of {total}
        </ThemedText>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Keep it up!</Text>
        </View>
      </View>

      <View style={styles.progress}>
        <Animated.View style={[styles.progressFill, fillStyle]} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  label: {
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statistic: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: 800,
  },
  badge: {
    backgroundColor: '#ffd84d',
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  badgeText: {
    color: '#3a2a00',
    fontSize: 16,
    fontWeight: 700,
  },
  progress: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    marginTop: Spacing.three,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ffd84d',
  },
});
