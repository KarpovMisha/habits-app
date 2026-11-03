import { Image } from 'expo-image';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type CheckboxProps = Omit<PressableProps, 'onPress' | 'children'> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
};

export function Checkbox({ checked, onChange, size = 44, style, ...rest }: CheckboxProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={(state) => [
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: checked ? theme.primary : theme.surface,
          borderColor: checked ? theme.primary : theme.unchecked,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {checked && (
        <Image
          source={require('@/assets/images/check.svg')}
          style={{ width: size / 2, height: size / 2 }}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
