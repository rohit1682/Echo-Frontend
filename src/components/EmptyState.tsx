import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/** Friendly empty / coming-soon state used across scaffolded sections. */
export function EmptyState({ icon = 'sparkles-outline', title, subtitle, children }: Props) {
  const theme = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={{ alignItems: 'center', paddingVertical: theme.spacing.xxxl, gap: theme.spacing.md }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primarySoft,
        }}
      >
        <Ionicons name={icon} size={32} color={theme.colors.primary} />
      </View>
      <Text variant="heading" center>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color="textMuted" center style={{ maxWidth: 280 }}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </Animated.View>
  );
}
