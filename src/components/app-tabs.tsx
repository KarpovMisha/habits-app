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
      {/* TabSlot only grows by default (flex-basis auto), so on web a tall screen pushes the
          tab bar off-screen instead of scrolling. Give it the remaining height. */}
      <TabSlot style={styles.slot} />
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
        <TabTrigger name="habits" href="/habits" asChild>
          <TabButton icon={require('@/assets/images/tabIcons/list.svg')}>
            Habits
          </TabButton>
        </TabTrigger>
        <TabTrigger name="stats" href="/stats" asChild>
          <TabButton icon={require('@/assets/images/tabIcons/stats.svg')}>
            Stats
          </TabButton>
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" asChild>
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
      {/* Always-present background + collapsable={false}: on Android the view is otherwise
          flattened while unfocused and loses borderRadius when re-created with a background. */}
      <View
        collapsable={false}
        style={[
          styles.indicator,
          {
            backgroundColor: isFocused
              ? colors.backgroundSelected
              : 'transparent',
          },
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
  slot: {
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
