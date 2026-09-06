import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import {
  Screen,
  Text,
  Card,
  GradientHero,
  AnimatedNumber,
  DonutChart,
  SkeletonCard,
  PressableScale,
} from '../../components';
import type { DonutSlice } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useDashboard } from '../../api/hooks';
import { formatCurrency, formatPercent } from '../../utils/format';

export function FinanceDashboard({ onSeeInvestments }: { onSeeInvestments: () => void }) {
  const theme = useTheme();
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  if (isLoading || !data) {
    return (
      <Screen topInset={false} onRefresh={refetch} refreshing={isRefetching}>
        <View style={{ gap: 16, marginTop: 12 }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </Screen>
    );
  }

  const { totals, netWorth, allocationByType, currency } = data;
  const gainPositive = totals.totalGain >= 0;

  const slices: DonutSlice[] = allocationByType.map((a, i) => ({
    label: a.label,
    value: a.value,
    percent: a.percent,
    color: theme.colors.chart[i % theme.colors.chart.length],
  }));

  return (
    <Screen topInset={false} onRefresh={refetch} refreshing={isRefetching}>
      <View style={{ gap: 16, marginTop: 12 }}>
        {/* Hero: net worth */}
        <Animated.View entering={FadeInDown.duration(450)}>
          <GradientHero>
            <Text variant="label" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Net worth
            </Text>
            <AnimatedNumber
              value={netWorth.netWorth}
              format={(n) => formatCurrency(n, currency)}
              variant="display"
              style={{ color: '#fff', marginTop: 4 }}
            />
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
              <HeroStat label="Assets" value={formatCurrency(netWorth.totalAssets, currency, { compact: true })} />
              <HeroStat label="Liabilities" value={formatCurrency(netWorth.totalLiabilities, currency, { compact: true })} />
            </View>
          </GradientHero>
        </Animated.View>

        {/* Investment stat tiles */}
        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={{ flexDirection: 'row', gap: 12 }}>
          <StatTile
            label="Invested"
            value={formatCurrency(totals.totalInvested, currency, { compact: true })}
            icon="cash-outline"
          />
          <StatTile
            label="Current"
            value={formatCurrency(totals.totalCurrentValue, currency, { compact: true })}
            icon="trending-up-outline"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(450)}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text variant="label" color="textMuted">
                  Total gain / loss
                </Text>
                <AnimatedNumber
                  value={totals.totalGain}
                  format={(n) => formatCurrency(n, currency, { sign: true })}
                  variant="title"
                  color={gainPositive ? 'success' : 'danger'}
                  style={{ marginTop: 4 }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: gainPositive ? theme.colors.successSoft : theme.colors.dangerSoft,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: theme.radius.pill,
                }}
              >
                <Ionicons
                  name={gainPositive ? 'arrow-up' : 'arrow-down'}
                  size={14}
                  color={gainPositive ? theme.colors.success : theme.colors.danger}
                />
                <Text variant="label" color={gainPositive ? 'success' : 'danger'}>
                  {formatPercent(totals.totalGainPercent)}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Allocation donut */}
        {slices.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(450)}>
            <Card>
              <Text variant="heading">Allocation</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 16 }}>
                <DonutChart
                  data={slices}
                  centerValue={String(totals.investmentCount)}
                  centerLabel="holdings"
                />
                <View style={{ flex: 1, gap: 10 }}>
                  {slices.map((s) => (
                    <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} />
                      <Text variant="caption" style={{ flex: 1 }} numberOfLines={1}>
                        {s.label}
                      </Text>
                      <Text variant="label" color="textMuted">
                        {Math.round(s.percent)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(260).duration(450)}>
          <PressableScale onPress={onSeeInvestments}>
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Ionicons name="pie-chart-outline" size={22} color={theme.colors.primary} />
                  <View>
                    <Text variant="bodyStrong">View all investments</Text>
                    <Text variant="caption" color="textMuted">
                      {totals.investmentCount} holdings · {totals.assetCount} assets · {totals.loanCount} loans
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textFaint} />
              </View>
            </Card>
          </PressableScale>
        </Animated.View>
      </View>
    </Screen>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {label}
      </Text>
      <Text variant="bodyStrong" style={{ color: '#fff', marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  const theme = useTheme();
  return (
    <Card style={{ flex: 1 }}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text variant="caption" color="textMuted" style={{ marginTop: 8 }}>
        {label}
      </Text>
      <Text variant="heading" style={{ marginTop: 2 }}>
        {value}
      </Text>
    </Card>
  );
}
