import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface Props extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
}

/** A themed surface card with subtle border + shadow. */
export function Card({ children, padded = true, elevated = true, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: theme.radius.lg,
          padding: padded ? theme.spacing.lg : 0,
        },
        elevated && {
          shadowColor: theme.colors.shadow,
          shadowOpacity: theme.isDark ? 0.4 : 0.06,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: theme.isDark ? 0 : 2,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
