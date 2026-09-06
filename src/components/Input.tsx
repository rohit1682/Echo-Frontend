import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  right?: React.ReactNode;
}

export function Input({ label, error, right, style, onFocus, onBlur, ...rest }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="label" color="textMuted">
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.wrap,
          {
            backgroundColor: theme.colors.surface,
            borderColor,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={theme.colors.textFaint}
          style={[styles.input, { color: theme.colors.text }, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {right}
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500', paddingVertical: 14 },
});
