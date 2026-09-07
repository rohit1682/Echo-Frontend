import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';

import { Screen, Text, Card, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useTasks } from '../../api/hooks';
import { Task } from '../../types';
import { haptics } from '../../utils/haptics';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarPanel() {
  const theme = useTheme();
  const { data } = useTasks();
  const tasks = data ?? [];
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => new Date());

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(month));
    const gridEnd = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [month]);

  const tasksByDay = (day: Date): Task[] =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));

  const selectedTasks = tasksByDay(selected);

  const changeMonth = (dir: 1 | -1) => {
    haptics.selection();
    setMonth((m) => (dir === 1 ? addMonths(m, 1) : subMonths(m, 1)));
  };

  return (
    <Screen topInset={false}>
      <Animated.View entering={FadeIn.duration(300)} style={{ marginTop: 12 }}>
        <Card>
          {/* Month header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <PressableScale onPress={() => changeMonth(-1)} style={{ padding: 4 }}>
              <Ionicons name="chevron-back" size={22} color={theme.colors.textMuted} />
            </PressableScale>
            <Text variant="heading">{format(month, 'MMMM yyyy')}</Text>
            <PressableScale onPress={() => changeMonth(1)} style={{ padding: 4 }}>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.textMuted} />
            </PressableScale>
          </View>

          {/* Weekday labels */}
          <View style={{ flexDirection: 'row' }}>
            {WEEKDAYS.map((w, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
                <Text variant="caption" color="textFaint">
                  {w}
                </Text>
              </View>
            ))}
          </View>

          {/* Day grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {days.map((day) => {
              const inMonth = isSameMonth(day, month);
              const isSelected = isSameDay(day, selected);
              const isToday = isSameDay(day, new Date());
              const hasTasks = tasksByDay(day).length > 0;
              return (
                <PressableScale
                  key={day.toISOString()}
                  haptic={false}
                  onPress={() => {
                    haptics.selection();
                    setSelected(day);
                  }}
                  style={{ width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 4 }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? theme.colors.primary : isToday ? theme.colors.primarySoft : 'transparent',
                    }}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: isSelected
                          ? theme.colors.onPrimary
                          : inMonth
                            ? theme.colors.text
                            : theme.colors.textFaint,
                        fontWeight: isToday ? '800' : '500',
                      }}
                    >
                      {format(day, 'd')}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      marginTop: 2,
                      backgroundColor: hasTasks && !isSelected ? theme.colors.accent : 'transparent',
                    }}
                  />
                </PressableScale>
              );
            })}
          </View>
        </Card>
      </Animated.View>

      {/* Tasks for the selected day */}
      <Text variant="label" color="textMuted" style={{ marginTop: 20, marginBottom: 8, marginLeft: 4 }}>
        {format(selected, 'EEEE, d MMM').toUpperCase()}
      </Text>
      {selectedTasks.length === 0 ? (
        <Card>
          <Text variant="body" color="textMuted">
            Nothing scheduled for this day.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {selectedTasks.map((t, i) => (
            <Animated.View key={t._id} entering={FadeInDown.delay(i * 40).duration(320)}>
              <Card padded={false} style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons
                    name={t.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={t.completed ? theme.colors.success : theme.colors.textFaint}
                  />
                  <Text
                    variant="body"
                    style={t.completed ? { textDecorationLine: 'line-through', color: theme.colors.textMuted } : undefined}
                  >
                    {t.title}
                  </Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>
      )}
    </Screen>
  );
}
