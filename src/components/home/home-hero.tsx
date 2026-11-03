import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedView } from '../themed-view';

export default function HomeHero() {
  const theme = useTheme();
  return (
    <ThemedView style={styles.heroSection}>
      <View style={styles.heroText}>
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.title}
        >
          Thursday, October 29
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Hi, Mykhailo
        </ThemedText>
      </View>

      <Pressable
        onPress={() => router.push('/new-habit')}
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: theme.backgroundPrimary },
          pressed && styles.pressed,
        ]}
      >
        <SymbolView
          name={{ ios: 'plus', android: 'add', web: 'add' }}
          tintColor="#ffffff"
          size={28}
        />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroText: {
    flex: 1,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    textAlign: 'left',
  },
});
