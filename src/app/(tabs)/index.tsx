import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHero from '@/components/home/home-hero';
import MyHabits from '@/components/home/my-habits';
import ProgressCard from '@/components/home/progress-card';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <HomeHero />
        <ProgressCard done={3} total={5} />
        <MyHabits />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingTop: BottomTabInset + Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
});
