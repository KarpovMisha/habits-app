import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LogoutButton from '@/components/profile/logout-button';
import ProfileCard from '@/components/profile/profile-card';
import SettingsCard from '@/components/profile/settings-card';
import StatCard from '@/components/profile/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/use-habits';

export default function Profile() {
  const { habits } = useHabits();
  const bestStreak = Math.max(0, ...habits.map((habit) => habit.streak));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title">Profile</ThemedText>
          <ProfileCard name="Mykhailo" email="mikhail.karpov.s@gmail.com" />
          <View style={styles.stats}>
            <StatCard value={habits.length} label="Active habits" hue="green" />
            <StatCard value={bestStreak} label="Best streak" hue="yellow" />
          </View>
          <SettingsCard />
          <LogoutButton />
        </ScrollView>
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
    maxWidth: MaxContentWidth,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingTop: BottomTabInset + Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});
