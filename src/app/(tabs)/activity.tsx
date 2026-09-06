import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, Text, SegmentedControl, EmptyState } from '../../components';
import type { Segment } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';

const SEGMENTS: Segment[] = [
  { key: 'calendar', label: 'Calendar' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'birthdays', label: 'Birthdays' },
];

const PANELS: Record<string, { icon: any; title: string; subtitle: string }> = {
  calendar: {
    icon: 'calendar-outline',
    title: 'Your calendar',
    subtitle: 'Day, week and month views with your events, financial due dates and reminders — arriving next.',
  },
  tasks: {
    icon: 'checkbox-outline',
    title: 'Daily tasks',
    subtitle: 'Create one-time and recurring tasks and check them off with a satisfying tap.',
  },
  birthdays: {
    icon: 'gift-outline',
    title: 'Birthdays & dates',
    subtitle: 'Import from contacts and never miss a birthday or anniversary again.',
  },
};

export default function ActivityScreen() {
  const theme = useTheme();
  const [segment, setSegment] = useState('calendar');
  const panel = PANELS[segment];

  return (
    <Screen scroll={false} padded={false}>
      <View style={{ paddingHorizontal: theme.spacing.lg, gap: 4 }}>
        <Text variant="caption" color="textMuted">
          Plan your days
        </Text>
        <Text variant="title">Personal Activity</Text>
      </View>

      <View style={{ paddingLeft: theme.spacing.lg, marginTop: theme.spacing.md }}>
        <SegmentedControl segments={SEGMENTS} value={segment} onChange={setSegment} />
      </View>

      <Animated.View key={segment} entering={FadeIn.duration(220)} style={{ flex: 1 }}>
        <Screen topInset={false}>
          <EmptyState icon={panel.icon} title={panel.title} subtitle={panel.subtitle} />
        </Screen>
      </Animated.View>
    </Screen>
  );
}
