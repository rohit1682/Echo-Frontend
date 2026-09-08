import React, { useState } from 'react';
import { View } from 'react-native';

import { Text, Input, Button, Chip, DateField } from '../../components';
import { TaskInput } from '../../api/echo';
import { TaskPriority } from '../../types';

interface Props {
  submitting?: boolean;
  initialDate?: Date | null;
  onSubmit: (input: TaskInput) => void;
}

const PRIORITIES: { key: TaskPriority; label: string }[] = [
  { key: TaskPriority.LOW, label: 'Low' },
  { key: TaskPriority.MEDIUM, label: 'Medium' },
  { key: TaskPriority.HIGH, label: 'High' },
];

export function TaskForm({ submitting, initialDate, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState<Date | null>(initialDate ?? null);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (!title.trim()) return setError('Title is required.');
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: due ? due.toISOString() : undefined,
      priority,
    });
  };

  return (
    <View style={{ gap: 14, paddingBottom: 8 }}>
      <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Pay electricity bill" />
      <Input label="Description" value={description} onChangeText={setDescription} placeholder="Optional" multiline />
      <DateField label="Due date" value={due} onChange={setDue} optional />
      <View style={{ gap: 6 }}>
        <Text variant="label" color="textMuted">
          Priority
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {PRIORITIES.map((p) => (
            <Chip key={p.key} label={p.label} selected={priority === p.key} onPress={() => setPriority(p.key)} />
          ))}
        </View>
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
      <Button title="Add task" onPress={submit} loading={submitting} style={{ marginTop: 4 }} />
    </View>
  );
}
