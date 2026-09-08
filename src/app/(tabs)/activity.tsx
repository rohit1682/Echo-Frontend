import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, Text, SegmentedControl, EmptyState } from '../../components';
import type { Segment } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { TasksPanel } from '../../features/activity/TasksPanel';
import { CalendarPanel } from '../../features/activity/CalendarPanel';

const SEGMENTS: Segment[] = [
  { key: 'tasks', label: 'Tasks' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'birthdays', label: 'Birthdays' },
];

export default function ActivityScreen() {
  const theme = useTheme();
  const [segment, setSegment] = useState('tasks');

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
        {segment === 'tasks' && <TasksPanel />}
        {segment === 'calendar' && <CalendarPanel />}
        {segment === 'birthdays' && (
          <Screen topInset={false}>
            <EmptyState
              icon="gift-outline"
              title="Birthdays & dates"
              subtitle="Import from contacts and never miss a birthday or anniversary again — coming soon."
            />
          </Screen>
        )}
      </Animated.View>
    </Screen>
  );
}
