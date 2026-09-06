import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/auth';
import { Text } from './Text';
import { Button } from './Button';

/**
 * When the signed-in user has enabled biometric lock, this overlay blocks the UI
 * on cold start and whenever the app returns to the foreground until the user
 * authenticates (Face ID / Touch ID / device passcode).
 */
export function BiometricLock({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const enabled = !!user?.preferences?.biometricLockEnabled;

  const [locked, setLocked] = useState(enabled);
  const appState = useRef(AppState.currentState);

  const authenticate = useCallback(async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !enrolled) {
      // Can't verify — don't trap the user out of their own app.
      setLocked(false);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Echo',
      fallbackLabel: 'Use passcode',
    });
    if (result.success) setLocked(false);
  }, []);

  useEffect(() => {
    setLocked(enabled);
    if (enabled) void authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === 'active' && enabled) {
        setLocked(true);
        void authenticate();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [enabled, authenticate]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      {locked && (
        <View
          style={{
            ...StyleSheetAbsolute,
            backgroundColor: theme.colors.bg,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 32,
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: theme.colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="lock-closed" size={40} color={theme.colors.primary} />
          </View>
          <Text variant="title" center>
            Echo is locked
          </Text>
          <Text variant="body" color="textMuted" center>
            Authenticate to access your finances and activities.
          </Text>
          <Button title="Unlock" onPress={authenticate} fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const StyleSheetAbsolute = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };
