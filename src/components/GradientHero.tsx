import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** A premium indigo→violet gradient card used for the hero net-worth panel. */
export function GradientHero({ children, style }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.wrap,
        {
          borderRadius: theme.radius.xl,
          shadowColor: theme.colors.primary,
          shadowOpacity: theme.isDark ? 0.35 : 0.28,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radius.xl, padding: theme.spacing.xl }]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'visible' },
  gradient: { overflow: 'hidden' },
});
