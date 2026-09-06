import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TypographyVariant, Palette } from '../theme/tokens';

type ColorKey = keyof Palette;

interface Props extends TextProps {
  variant?: TypographyVariant;
  color?: ColorKey;
  center?: boolean;
  children?: React.ReactNode;
}

/** Themed text with a typographic scale. `variant` sets size/weight, `color` a token. */
export function Text({ variant = 'body', color = 'text', center, style, children, ...rest }: Props) {
  const theme = useTheme();
  const base = theme.typography[variant] as TextStyle;
  return (
    <RNText
      style={[base, { color: theme.colors[color] as string }, center && { textAlign: 'center' }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
