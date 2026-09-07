import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  /** Values in chronological (oldest → newest) order. */
  values: number[];
  height?: number;
  color?: string;
}

const W = 320;
const PAD = 10;

/**
 * A minimal responsive area/line chart drawn with SVG (no chart library).
 * Scales to its container width via a viewBox, so no layout measurement is
 * needed, and fades in on mount. Renders nothing for fewer than two points.
 */
export function TrendChart({ values, height = 130, color }: Props) {
  const theme = useTheme();
  const stroke = color ?? theme.colors.primary;
  if (values.length < 2) return null;

  const H = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const x = (i: number) => PAD + (i / (values.length - 1)) * (W - 2 * PAD);
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - 2 * PAD);

  const pts = values.map((v, i) => `${x(i)},${y(v)}`);
  const linePath = `M ${pts.join(' L ')}`;
  const areaPath = `${linePath} L ${x(values.length - 1)},${H - PAD} L ${x(0)},${H - PAD} Z`;

  const lastX = x(values.length - 1);
  const lastY = y(values[values.length - 1]);

  return (
    <Animated.View entering={FadeIn.duration(500)} style={{ width: '100%' }}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={stroke} stopOpacity={0.28} />
            <Stop offset="1" stopColor={stroke} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#trendFill)" />
        <Path d={linePath} stroke={stroke} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {/* preserveAspectRatio none stretches x; keep the marker circular by drawing it outside the viewBox scaling */}
      </Svg>
      <View style={{ position: 'absolute', left: `${(lastX / W) * 100}%`, top: lastY - 4, width: 8, height: 8 }}>
        <Svg width={8} height={8}>
          <Circle cx={4} cy={4} r={4} fill={stroke} />
        </Svg>
      </View>
    </Animated.View>
  );
}
