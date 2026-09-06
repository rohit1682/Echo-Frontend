import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';

export function BrandHeader({ subtitle }: { subtitle: string }) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center', marginTop: 40, marginBottom: 28 }}>
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logo}
      >
        <Ionicons name="pulse" size={34} color="#fff" />
      </LinearGradient>
      <Text variant="display" style={{ marginTop: 16 }}>
        Echo
      </Text>
      <Text variant="body" color="textMuted" center style={{ marginTop: 6, maxWidth: 260 }}>
        {subtitle}
      </Text>
    </Animated.View>
  );
}

export function SocialRow({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const buttons: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { icon: 'logo-google', label: 'Google' },
    { icon: 'logo-apple', label: 'Apple' },
    { icon: 'call-outline', label: 'OTP' },
  ];
  return (
    <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ marginTop: 22 }}>
      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
        <Text variant="caption" color="textFaint">
          or continue with
        </Text>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      </View>
      <View style={styles.socialRow}>
        {buttons.map((b) => (
          <PressableScale
            key={b.label}
            onPress={onPress}
            style={{
              ...styles.social,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
            }}
          >
            <Ionicons name={b.icon} size={20} color={theme.colors.text} />
            <Text variant="label" color="textMuted">
              {b.label}
            </Text>
          </PressableScale>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: { width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  socialRow: { flexDirection: 'row', gap: 10 },
  social: {
    flex: 1,
    height: 52,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flexDirection: 'row',
  },
});
