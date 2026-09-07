import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Card, Sheet, Skeleton, EmptyState, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../api/hooks';
import { TaskForm } from './TaskForm';
import { TaskInput } from '../../api/echo';
import { Task, TaskPriority } from '../../types';
import { formatDate } from '../../utils/format';
import { haptics } from '../../utils/haptics';
import { Palette } from '../../theme/tokens';

const PRIORITY_COLOR: Record<TaskPriority, keyof Palette> = {
  [TaskPriority.LOW]: 'textFaint',
  [TaskPriority.MEDIUM]: 'info',
  [TaskPriority.HIGH]: 'danger',
};

export function TasksPanel() {
  const theme = useTheme();
  const { data, isLoading, refetch, isRefetching } = useTasks();
  const createM = useCreateTask();
  const updateM = useUpdateTask();
  const deleteM = useDeleteTask();
  const [sheetOpen, setSheetOpen] = useState(false);

  const tasks = data ?? [];
  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  const onAdd = async (input: TaskInput) => {
    try {
      await createM.mutateAsync(input);
      haptics.success();
      setSheetOpen(false);
    } catch {
      haptics.warning();
      Alert.alert('Error', 'Could not save the task.');
    }
  };

  const toggle = (task: Task) => {
    haptics.selection();
    void updateM.mutateAsync({ id: task._id, input: { completed: !task.completed } });
  };

  const confirmDelete = (task: Task) => {
    Alert.alert('Delete task', `Remove "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { haptics.medium(); void deleteM.mutateAsync(task._id); } },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} onRefresh={refetch} refreshing={isRefetching}>
        {isLoading ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={64} radius={theme.radius.lg} />
            ))}
          </View>
        ) : tasks.length === 0 ? (
          <EmptyState icon="checkbox-outline" title="No tasks yet" subtitle="Tap + to add your first task and check it off with a satisfying tap." />
        ) : (
          <View style={{ gap: 10, marginTop: 12 }}>
            {pending.map((task, i) => (
              <TaskRow key={task._id} task={task} index={i} onToggle={() => toggle(task)} onLongPress={() => confirmDelete(task)} />
            ))}
            {done.length > 0 && (
              <Text variant="label" color="textFaint" style={{ marginTop: 12, marginLeft: 4 }}>
                COMPLETED
              </Text>
            )}
            {done.map((task, i) => (
              <TaskRow key={task._id} task={task} index={i} onToggle={() => toggle(task)} onLongPress={() => confirmDelete(task)} />
            ))}
          </View>
        )}
      </Screen>

      <PressableScale
        onPress={() => setSheetOpen(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.colors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={30} color={theme.colors.onPrimary} />
      </PressableScale>

      <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title="New task">
        <TaskForm submitting={createM.isPending} onSubmit={onAdd} />
      </Sheet>
    </View>
  );
}

function TaskRow({ task, index, onToggle, onLongPress }: { task: Task; index: number; onToggle: () => void; onLongPress: () => void }) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const boxStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const priorityColor = theme.colors[PRIORITY_COLOR[task.priority]] as string;

  const press = () => {
    scale.value = withSpring(1.25, { damping: 6, stiffness: 300 }, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(320)}>
      <PressableScale onLongPress={onLongPress} haptic={false} onPress={press}>
        <Card padded={false} style={{ padding: 14, opacity: task.completed ? 0.6 : 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Animated.View style={boxStyle}>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderWidth: 2,
                  borderColor: task.completed ? theme.colors.success : theme.colors.border,
                  backgroundColor: task.completed ? theme.colors.success : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {task.completed ? <Ionicons name="checkmark" size={16} color={theme.colors.onPrimary} /> : null}
              </View>
            </Animated.View>
            <View style={{ flex: 1 }}>
              <Text
                variant="body"
                numberOfLines={1}
                style={task.completed ? { textDecorationLine: 'line-through', color: theme.colors.textMuted } : undefined}
              >
                {task.title}
              </Text>
              {task.dueDate ? (
                <Text variant="caption" color="textFaint" style={{ marginTop: 2 }}>
                  Due {formatDate(task.dueDate, { year: undefined })}
                </Text>
              ) : null}
            </View>
            {!task.completed ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: priorityColor }} /> : null}
          </View>
        </Card>
      </PressableScale>
    </Animated.View>
  );
}
