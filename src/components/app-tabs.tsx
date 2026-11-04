import { Image, type ImageSource } from 'expo-image';
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

export default function AppTabs() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList
        style={[
          styles.tabList,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundSelected,
            paddingBottom: Spacing.two + insets.bottom,
          },
        ]}
      >
        <TabTrigger name="index" href="/" asChild>
          <TabButton icon={require('@/assets/images/tabIcons/home.svg')}>
            Home
          </TabButton>
        </TabTrigger>
        <TabTrigger name="explore" href="/habit-details" asChild>
          <TabButton icon={require('@/assets/images/tabIcons/list.svg')}>
            Habits
          </TabButton>
        </TabTrigger>
        <TabTrigger name="explore" href="/profile" asChild>
          <TabButton icon={require('@/assets/images/tabIcons/profile.svg')}>
            Profile
          </TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: ImageSource };

// `ref` is dropped: its type from TabTrigger doesn't match Pressable's ref type.
export function TabButton({
  children,
  isFocused,
  icon,
  ref,
  ...props
}: TabButtonProps) {
  const colors = useTheme();
  const color = isFocused ? colors.text : colors.textSecondary;

  return (
    <Pressable {...props} style={styles.tabButton}>
      <View
        style={[
          styles.indicator,
          isFocused && { backgroundColor: colors.backgroundSelected },
        ]}
      >
        <Image source={icon} tintColor={color} style={styles.icon} />
      </View>
      <ThemedText type={isFocused ? 'smallBold' : 'small'} style={{ color }}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  indicator: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
