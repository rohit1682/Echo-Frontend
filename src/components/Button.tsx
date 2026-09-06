import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  fullWidth = true,
  icon,
  style,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const palette: Record<Variant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: theme.colors.primary, fg: theme.colors.onPrimary },
    secondary: { bg: theme.colors.surfaceAlt, fg: theme.colors.text },
    ghost: { bg: 'transparent', fg: theme.colors.primary },
    danger: { bg: theme.colors.danger, fg: '#fff' },
  };
  const p = palette[variant];

  return (
    <PressableScale
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      scaleTo={0.97}
      style={[
        styles.base,
        {
          backgroundColor: p.bg,
          borderRadius: theme.radius.md,
          opacity: isDisabled ? 0.55 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? theme.spacing.lg : theme.spacing.xl,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={p.fg} />
        ) : (
          <>
            {icon}
            <Text variant="bodyStrong" style={{ color: p.fg }}>
              {title}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { height: 52, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
