import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ProfileCardProps = {
  name: string;
  email: string;
};

export default function ProfileCard({ name, email }: ProfileCardProps) {
  return (
    <ThemedView type="surface" style={styles.card}>
      <View style={styles.avatar}>
        <ThemedText style={styles.initial}>
          {name.charAt(0).toUpperCase()}
        </ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {email}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFD84D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 800,
    color: '#1A1D27',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    lineHeight: 28,
  },
});
