import React, { useState } from 'react';
import { View } from 'react-native';

import { Text, Input, Button, Chip } from '../../components';
import { BudgetInput } from '../../api/echo';
import { Frequency } from '../../types';

interface Props {
  submitting?: boolean;
  onSubmit: (input: BudgetInput) => void;
}

const PERIODS: { key: Frequency; label: string }[] = [
  { key: Frequency.WEEKLY, label: 'Weekly' },
  { key: Frequency.MONTHLY, label: 'Monthly' },
  { key: Frequency.YEARLY, label: 'Yearly' },
];

export function BudgetForm({ submitting, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<Frequency>(Frequency.MONTHLY);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const limitNum = Number(limit);
    if (!name.trim()) return setError('Name is required.');
    if (Number.isNaN(limitNum) || limitNum <= 0) return setError('Enter a valid limit.');
    onSubmit({ name: name.trim(), limit: limitNum, period });
  };

  return (
    <View style={{ gap: 14, paddingBottom: 8 }}>
      <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. Monthly spending" />
      <Input label="Limit" value={limit} onChangeText={setLimit} keyboardType="numeric" placeholder="0" />
      <View style={{ gap: 6 }}>
        <Text variant="label" color="textMuted">
          Period
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {PERIODS.map((p) => (
            <Chip key={p.key} label={p.label} selected={period === p.key} onPress={() => setPeriod(p.key)} />
          ))}
        </View>
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
      <Button title="Add budget" onPress={submit} loading={submitting} style={{ marginTop: 4 }} />
    </View>
  );
}
