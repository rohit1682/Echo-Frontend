import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export interface DonutSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

/** A minimal animated donut chart drawn with SVG arcs (no chart library). */
export function DonutChart({ data, size = 168, strokeWidth = 22, centerLabel, centerValue }: Props) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;
  const slices = data.filter((d) => d.value > 0);

  return (
    <Animated.View entering={ZoomIn.duration(450)} style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${center}, ${center}`}>
          {/* Track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.colors.surfaceAlt}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {slices.map((slice, i) => {
            const arc = (slice.percent / 100) * circumference;
            const dashArray = `${arc} ${circumference - arc}`;
            const dashOffset = -(cumulative / 100) * circumference;
            cumulative += slice.percent;
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                fill="none"
              />
            );
          })}
        </G>
      </Svg>
      {(centerLabel || centerValue) && (
        <Animated.View
          entering={FadeIn.delay(250)}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}
        >
          {centerValue ? <Text variant="heading">{centerValue}</Text> : null}
          {centerLabel ? (
            <Text variant="caption" color="textMuted">
              {centerLabel}
            </Text>
          ) : null}
        </Animated.View>
      )}
    </Animated.View>
  );
}
