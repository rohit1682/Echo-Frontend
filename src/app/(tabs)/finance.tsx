import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, Text, SegmentedControl, EmptyState } from '../../components';
import type { Segment } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuthStore } from '../../store/auth';
import { FinanceDashboard } from '../../features/finance/FinanceDashboard';
import { InvestmentsPanel } from '../../features/finance/InvestmentsPanel';

const SEGMENTS: Segment[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'investments', label: 'Investments' },
  { key: 'sips', label: 'SIPs' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'assets', label: 'Assets' },
  { key: 'networth', label: 'Net worth' },
];

const COMING_SOON: Record<string, { icon: any; title: string; subtitle: string }> = {
  sips: { icon: 'repeat', title: 'SIP tracking', subtitle: 'Track recurring investments and never miss a deduction. Landing in an upcoming update.' },
  insurance: { icon: 'shield-checkmark', title: 'Insurance & premiums', subtitle: 'Manage policies and get reminders before premiums are due.' },
  assets: { icon: 'home', title: 'Assets', subtitle: 'Real estate, vehicles, gold and more — already powering your net worth.' },
  networth: { icon: 'trending-up', title: 'Net worth over time', subtitle: 'A trend chart of your net worth is coming soon.' },
};

export default function FinanceScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const [segment, setSegment] = useState('dashboard');

  return (
    <Screen scroll={false} padded={false}>
      <View style={{ paddingHorizontal: theme.spacing.lg, gap: 4 }}>
        <Text variant="caption" color="textMuted">
          {greeting()}, {user?.name?.split(' ')[0] ?? 'there'}
        </Text>
        <Text variant="title">Finance</Text>
      </View>

      <View style={{ paddingLeft: theme.spacing.lg, marginTop: theme.spacing.md }}>
        <SegmentedControl segments={SEGMENTS} value={segment} onChange={setSegment} />
      </View>

      <Animated.View key={segment} entering={FadeIn.duration(220)} style={{ flex: 1 }}>
        {segment === 'dashboard' && <FinanceDashboard onSeeInvestments={() => setSegment('investments')} />}
        {segment === 'investments' && <InvestmentsPanel />}
        {COMING_SOON[segment] && (
          <Screen topInset={false}>
            <EmptyState
              icon={COMING_SOON[segment].icon}
              title={COMING_SOON[segment].title}
              subtitle={COMING_SOON[segment].subtitle}
            />
          </Screen>
        )}
      </Animated.View>
    </Screen>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
