import { Image } from 'expo-image';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HabitIcons, Hues } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabits } from '@/hooks/use-habits';
import { useTheme } from '@/hooks/use-theme';

export default function ArchivedScreen() {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { archivedHabits, setArchived } = useHabits();

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={archivedHabits}
        keyExtractor={(habit) => habit.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary">No archived habits</ThemedText>
        }
        renderItem={({ item }) => {
          const [tint, ink] = Hues[item.hue][scheme];
          return (
            <ThemedView type="surface" style={styles.row}>
              <View style={[styles.iconTile, { backgroundColor: tint }]}>
                <Image
                  source={HabitIcons[item.icon]}
                  tintColor={ink}
                  style={styles.icon}
                />
              </View>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <Pressable
                onPress={() => setArchived(item.id, false)}
                accessibilityRole="button"
                style={[styles.restore, { backgroundColor: theme.text }]}
              >
                <ThemedText themeColor="textInvert" type="small">
                  Restore
                </ThemedText>
              </Pressable>
            </ThemedView>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.three },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 20,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 24, height: 24 },
  name: { flex: 1, fontWeight: 600 },
  restore: {
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
});
