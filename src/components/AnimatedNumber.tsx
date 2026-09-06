import React, { useEffect, useRef, useState } from 'react';
import { TextStyle } from 'react-native';
import { Text } from './Text';
import { TypographyVariant, Palette } from '../theme/tokens';

interface Props {
  value: number;
  format: (n: number) => string;
  duration?: number;
  variant?: TypographyVariant;
  color?: keyof Palette;
  style?: TextStyle;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up/down to `value` with an eased tween — a subtle premium touch on stats. */
export function AnimatedNumber({ value, format, duration = 750, variant, color, style }: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  return (
    <Text variant={variant} color={color} style={style}>
      {format(display)}
    </Text>
  );
}
