import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { PressableScale } from './PressableScale';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  label: string;
  color?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

/** A compact tag/filter chip. Pass `onPress` to make it selectable. */
export function Chip({ label, color, selected, onPress, style }: Props) {
  const theme = useTheme();
  const dot = color ?? theme.colors.primary;
  const content = (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surfaceAlt,
          borderColor: selected ? theme.colors.primary : 'transparent',
          borderRadius: theme.radius.pill,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text variant="caption" color={selected ? 'primary' : 'textMuted'}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress} haptic={false}>
        {content}
      </PressableScale>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
