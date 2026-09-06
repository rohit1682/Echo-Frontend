import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';
import { haptics } from '../utils/haptics';

export interface Segment {
  key: string;
  label: string;
}

interface Props {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
}

/** Horizontal scrollable pill segmented control with an animated active pill. */
export function SegmentedControl({ segments, value, onChange }: Props) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {segments.map((seg) => {
        const active = seg.key === value;
        return (
          <PressableScale
            key={seg.key}
            haptic={false}
            onPress={() => {
              haptics.selection();
              onChange(seg.key);
            }}
          >
            <Animated.View
              layout={LinearTransition.springify().damping(18)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <Text
                variant="label"
                style={{ color: active ? theme.colors.onPrimary : theme.colors.textMuted }}
              >
                {seg.label}
              </Text>
            </Animated.View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4, paddingRight: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 9 },
});
