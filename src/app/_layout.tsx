import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/auth';
import { BiometricLock } from '../components/BiometricLock';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false } },
});

/** Redirects between the (auth) and (tabs) groups based on auth state. */
function useAuthRedirect() {
  const segments = useSegments();
  const router = useRouter();
  const { accessToken, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!accessToken && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (accessToken && inAuthGroup) {
      router.replace('/(tabs)/finance');
    }
  }, [accessToken, hydrated, segments, router]);
}

function RootNavigator() {
  const theme = useTheme();
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useAuthRedirect();

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.bg }} />;
  }

  return (
    <BiometricLock>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.bg } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </BiometricLock>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
