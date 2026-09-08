import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Card, GradientHero, Skeleton, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useAdvisor } from '../../api/hooks';
import { Recommendation, RecommendationSeverity } from '../../types';
import { Palette } from '../../theme/tokens';

const SEVERITY_META: Record<
  RecommendationSeverity,
  { icon: keyof typeof Ionicons.glyphMap; color: keyof Palette; soft: keyof Palette }
> = {
  info: { icon: 'information-circle', color: 'info', soft: 'infoSoft' },
  suggestion: { icon: 'bulb', color: 'primary', soft: 'primarySoft' },
  warning: { icon: 'alert-circle', color: 'warning', soft: 'warningSoft' },
  critical: { icon: 'warning', color: 'danger', soft: 'dangerSoft' },
};

export default function AdvisorScreen() {
  const theme = useTheme();
  const { data, isLoading, refetch, isRefetching } = useAdvisor();

  return (
    <Screen onRefresh={refetch} refreshing={isRefetching}>
      <Text variant="title" style={{ marginBottom: 4 }}>
        Insights
      </Text>
      <Text variant="body" color="textMuted" style={{ marginBottom: 16 }}>
        Personalized guidance from your own finances and activity.
      </Text>

      <Animated.View entering={FadeInDown.duration(450)}>
        <GradientHero>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="bulb" size={22} color="#fff" />
            <Text variant="heading" style={{ color: '#fff' }}>
              Smart insights
            </Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>
            Grounded in your real finances — always free.
          </Text>
        </GradientHero>
      </Animated.View>

      <View style={{ height: 16 }} />

      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={92} radius={theme.radius.lg} />
          ))}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {data?.recommendations.map((rec, index) => (
            <RecommendationCard key={index} rec={rec} index={index} />
          ))}
        </View>
      )}

      <PressableScale onPress={() => refetch()} style={{ alignSelf: 'center', marginTop: 20, flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        <Ionicons name="refresh" size={16} color={theme.colors.primary} />
        <Text color="primary" variant="label">
          Refresh advice
        </Text>
      </PressableScale>
    </Screen>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const theme = useTheme();
  const meta = SEVERITY_META[rec.severity];
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <Card>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: theme.colors[meta.soft] as string,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={meta.icon} size={20} color={theme.colors[meta.color] as string} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">{rec.title}</Text>
            <Text variant="body" color="textMuted" style={{ marginTop: 4, lineHeight: 20 }}>
              {rec.message}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}
