import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Input, Button, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { authApi } from '../../api/echo';
import { apiErrorMessage } from '../../api/client';
import { useAuthStore } from '../../store/auth';
import { haptics } from '../../utils/haptics';
import { SocialRow, BrandHeader } from '../../features/auth/AuthShared';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('demo@echo.app');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.login(email.trim(), password);
      await setSession(result);
      haptics.success();
      router.replace('/(tabs)/finance');
    } catch (e) {
      haptics.warning();
      setError(apiErrorMessage(e, 'Could not sign in.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <BrandHeader subtitle="Your money and your days, in one place." />

        <Animated.View entering={FadeInDown.delay(120).duration(500)} style={{ gap: 14, marginTop: 8 }}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            autoCorrect={false}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
          {error ? (
            <Animated.View entering={FadeIn}>
              <Text variant="caption" color="danger">
                {error}
              </Text>
            </Animated.View>
          ) : null}
          <Button title="Sign in" onPress={onSubmit} loading={loading} style={{ marginTop: 4 }} />
        </Animated.View>

        <SocialRow onPress={() => Alert.alert('Coming soon', 'Social & OTP sign-in arrives in a later phase.')} />

        <Animated.View
          entering={FadeInDown.delay(320).duration(500)}
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 }}
        >
          <Text color="textMuted">New to Echo?</Text>
          <Link href="/(auth)/register" asChild>
            <PressableScale haptic={false}>
              <Text color="primary" variant="bodyStrong">
                Create an account
              </Text>
            </PressableScale>
          </Link>
        </Animated.View>

        <View style={{ height: 24 }} />
        <Animated.View entering={FadeIn.delay(500)} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="shield-checkmark-outline" size={14} color={theme.colors.textFaint} />
            <Text variant="caption" color="textFaint">
              Secured with encrypted, per-user data
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
