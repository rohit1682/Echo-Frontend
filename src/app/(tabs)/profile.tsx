import React, { useState } from 'react';
import { Alert, Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Card, SegmentedControl, Button } from '../../components';
import type { Segment } from '../../components';
import { useTheme, ThemeMode } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../store/auth';
import { authApi, usersApi } from '../../api/echo';
import { haptics } from '../../utils/haptics';

const THEME_SEGMENTS: Segment[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [biometric, setBiometric] = useState(!!user?.preferences?.biometricLockEnabled);
  const [savingBiometric, setSavingBiometric] = useState(false);

  const initial = (user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase();

  const toggleBiometric = async (value: boolean) => {
    setBiometric(value);
    setSavingBiometric(true);
    try {
      const updated = await usersApi.updateMe({ preferences: { biometricLockEnabled: value } });
      await setUser(updated);
      haptics.selection();
    } catch {
      setBiometric(!value);
      Alert.alert('Error', 'Could not update your setting.');
    } finally {
      setSavingBiometric(false);
    }
  };

  const onLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            await authApi.logout();
          } catch {
            /* ignore network errors on logout */
          }
          await logout();
        },
      },
    ]);
  };

  const comingSoon = () => Alert.alert('Coming soon', 'This will be available in an upcoming update.');

  return (
    <Screen>
      <Text variant="title" style={{ marginBottom: 16 }}>
        Profile
      </Text>

      {/* Account card */}
      <Animated.View entering={FadeInDown.duration(450)}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text variant="title" style={{ color: theme.colors.onPrimary }}>
                {initial}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="heading">{user?.name ?? 'Echo user'}</Text>
              <Text variant="caption" color="textMuted">
                {user?.email ?? user?.phone ?? ''}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Appearance */}
      <Section title="Appearance" delay={80}>
        <Text variant="label" color="textMuted" style={{ marginBottom: 10 }}>
          Theme
        </Text>
        <SegmentedControl
          segments={THEME_SEGMENTS}
          value={theme.mode}
          onChange={(m) => theme.setMode(m as ThemeMode)}
        />
      </Section>

      {/* Security */}
      <Section title="Security" delay={140}>
        <Row
          icon="finger-print"
          label="Biometric app lock"
          description="Require Face ID / fingerprint to open Echo"
          right={
            <Switch
              value={biometric}
              onValueChange={toggleBiometric}
              disabled={savingBiometric}
              trackColor={{ true: theme.colors.primary }}
            />
          }
        />
      </Section>

      {/* Sync */}
      <Section title="Sync (coming soon)" delay={200}>
        <Row icon="people-outline" label="Contacts" description="Import birthdays from contacts" onPress={comingSoon} soon />
        <Row icon="calendar-outline" label="Calendar" description="Sync events with your device calendar" onPress={comingSoon} soon />
      </Section>

      <View style={{ marginTop: 24 }}>
        <Button title="Sign out" variant="danger" onPress={onLogout} />
      </View>
      <Text variant="caption" color="textFaint" center style={{ marginTop: 16 }}>
        Echo · v1.0.0 (foundation)
      </Text>
    </Screen>
  );
}

function Section({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)} style={{ marginTop: 20 }}>
      <Text variant="label" color="textMuted" style={{ marginBottom: 8, marginLeft: 4 }}>
        {title.toUpperCase()}
      </Text>
      <Card>{children}</Card>
    </Animated.View>
  );
}

function Row({
  icon,
  label,
  description,
  right,
  onPress,
  soon,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  soon?: boolean;
}) {
  const theme = useTheme();
  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}>
      <Ionicons name={icon} size={22} color={theme.colors.textMuted} />
      <View style={{ flex: 1 }}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" color="textFaint" style={{ marginTop: 2 }}>
            {description}
          </Text>
        ) : null}
      </View>
      {right}
      {soon && !right ? (
        <View style={{ backgroundColor: theme.colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.radius.pill }}>
          <Text variant="caption" color="textMuted">
            Soon
          </Text>
        </View>
      ) : null}
    </View>
  );
  if (onPress) {
    return (
      <View onTouchEnd={onPress}>{content}</View>
    );
  }
  return content;
}
