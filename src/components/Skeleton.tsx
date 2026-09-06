import React, { useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** A shimmering placeholder block used while data loads. */
export function Skeleton({ width = '100%', height = 16, radius, style }: Props) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.4, 0.85]),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor: theme.colors.surfaceAlt,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/** A common card-shaped skeleton group. */
export function SkeletonCard() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
      ]}
    >
      <Skeleton width="55%" height={14} />
      <Skeleton width="80%" height={22} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 12, borderWidth: StyleSheet.hairlineWidth },
});
