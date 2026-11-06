import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingsRowProps = {
  icon: SymbolViewProps['name'];
  label: string;
  /** Rendered on the right side: a switch, a value, etc. */
  accessory?: ReactNode;
  divider?: boolean;
};

export default function SettingsRow({
  icon,
  label,
  accessory,
  divider,
}: SettingsRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        divider && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.fieldBorder,
        },
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: theme.field }]}>
        <SymbolView name={icon} tintColor={theme.text} size={20} />
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {accessory}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontWeight: 700,
  },
});
