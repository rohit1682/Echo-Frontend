import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { Screen, Text, Input, Button, PressableScale } from '../../components';
import { authApi } from '../../api/echo';
import { apiErrorMessage } from '../../api/client';
import { useAuthStore } from '../../store/auth';
import { haptics } from '../../utils/haptics';
import { BrandHeader } from '../../features/auth/AuthShared';

export default function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!email.includes('@')) return setError('Enter a valid email.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    setLoading(true);
    try {
      const result = await authApi.register(email.trim(), password, name.trim() || undefined);
      await setSession(result);
      haptics.success();
      router.replace('/(tabs)/finance');
    } catch (e) {
      haptics.warning();
      setError(apiErrorMessage(e, 'Could not create your account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <BrandHeader subtitle="Create your account to get started." />

        <Animated.View entering={FadeInDown.delay(120).duration(500)} style={{ gap: 14 }}>
          <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="At least 8 characters"
          />
          {error ? (
            <Animated.View entering={FadeIn}>
              <Text variant="caption" color="danger">
                {error}
              </Text>
            </Animated.View>
          ) : null}
          <Button title="Create account" onPress={onSubmit} loading={loading} style={{ marginTop: 4 }} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(260).duration(500)}
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 }}
        >
          <Text color="textMuted">Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <PressableScale haptic={false}>
              <Text color="primary" variant="bodyStrong">
                Sign in
              </Text>
            </PressableScale>
          </Link>
        </Animated.View>
        <View style={{ height: 40 }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
