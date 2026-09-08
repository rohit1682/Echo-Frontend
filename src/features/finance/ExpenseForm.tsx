import React, { useState } from 'react';
import { View } from 'react-native';

import { Text, Input, Button, DateField } from '../../components';
import { ExpenseInput } from '../../api/echo';

interface Props {
  submitting?: boolean;
  onSubmit: (input: ExpenseInput) => void;
}

export function ExpenseForm({ submitting, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) return setError('Enter a valid amount.');
    onSubmit({
      amount: amountNum,
      description: description.trim() || undefined,
      spentAt: date.toISOString(),
    });
  };

  return (
    <View style={{ gap: 14, paddingBottom: 8 }}>
      <Input label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0" />
      <Input label="Description" value={description} onChangeText={setDescription} placeholder="e.g. Groceries" />
      <DateField label="Date" value={date} onChange={setDate} />
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
      <Button title="Add expense" onPress={submit} loading={submitting} style={{ marginTop: 4 }} />
    </View>
  );
}
