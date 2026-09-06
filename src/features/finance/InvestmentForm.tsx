import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text, Input, Button, Chip, DateField } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useTags, useCreateTag } from '../../api/hooks';
import { InvestmentInput } from '../../api/echo';
import { Investment, InvestmentType, RiskLevel, INVESTMENT_TYPE_LABELS, Tag } from '../../types';

interface Props {
  initial?: Investment | null;
  submitting?: boolean;
  onSubmit: (input: InvestmentInput) => void;
}

const RISK_OPTIONS: { key: RiskLevel; label: string }[] = [
  { key: RiskLevel.LOW, label: 'Low' },
  { key: RiskLevel.MEDIUM, label: 'Medium' },
  { key: RiskLevel.HIGH, label: 'High' },
];

export function InvestmentForm({ initial, submitting, onSubmit }: Props) {
  const theme = useTheme();
  const { data: tags } = useTags();
  const createTag = useCreateTag();

  const [name, setName] = useState('');
  const [type, setType] = useState<InvestmentType>(InvestmentType.MUTUAL_FUND);
  const [invested, setInvested] = useState('');
  const [current, setCurrent] = useState('');
  const [risk, setRisk] = useState<RiskLevel>(RiskLevel.MEDIUM);
  const [date, setDate] = useState<Date>(new Date());
  const [maturity, setMaturity] = useState<Date | null>(null);
  const [symbol, setSymbol] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setType(initial.type);
    setInvested(String(initial.investedAmount));
    setCurrent(String(initial.currentValue));
    setRisk(initial.riskLevel);
    setDate(new Date(initial.investmentDate));
    setMaturity(initial.maturityDate ? new Date(initial.maturityDate) : null);
    setSymbol(initial.symbol ?? '');
    setNotes(initial.notes ?? '');
    setSelectedTags((initial.tags as Tag[]).map((t) => (typeof t === 'string' ? t : t._id)));
  }, [initial]);

  const toggleTag = (id: string) =>
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const addTag = async () => {
    const label = newTag.trim();
    if (!label) return;
    const created = await createTag.mutateAsync({ name: label });
    setSelectedTags((prev) => [...prev, created._id]);
    setNewTag('');
  };

  const submit = () => {
    setError(null);
    const investedNum = Number(invested);
    const currentNum = Number(current);
    if (!name.trim()) return setError('Name is required.');
    if (Number.isNaN(investedNum) || investedNum < 0) return setError('Enter a valid invested amount.');
    if (Number.isNaN(currentNum) || currentNum < 0) return setError('Enter a valid current value.');

    onSubmit({
      name: name.trim(),
      type,
      investedAmount: investedNum,
      currentValue: currentNum,
      riskLevel: risk,
      investmentDate: date.toISOString(),
      maturityDate: maturity ? maturity.toISOString() : undefined,
      symbol: symbol.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: selectedTags,
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 14, paddingBottom: 8 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. Nifty 50 Index Fund" />

        <View style={{ gap: 6 }}>
          <Text variant="label" color="textMuted">
            Type
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {Object.values(InvestmentType).map((t) => (
              <Chip
                key={t}
                label={INVESTMENT_TYPE_LABELS[t]}
                selected={type === t}
                color={theme.colors.primary}
                onPress={() => setType(t)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Invested" value={invested} onChangeText={setInvested} keyboardType="numeric" placeholder="0" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Current value" value={current} onChangeText={setCurrent} keyboardType="numeric" placeholder="0" />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text variant="label" color="textMuted">
            Risk level
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {RISK_OPTIONS.map((r) => (
              <Chip key={r.key} label={r.label} selected={risk === r.key} onPress={() => setRisk(r.key)} />
            ))}
          </View>
        </View>

        <DateField label="Investment date" value={date} onChange={setDate} />
        <DateField label="Maturity date" value={maturity} onChange={setMaturity} optional />

        <Input label="Symbol / code" value={symbol} onChangeText={setSymbol} autoCapitalize="characters" placeholder="e.g. BTC (optional)" />

        <View style={{ gap: 6 }}>
          <Text variant="label" color="textMuted">
            Tags
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(tags ?? []).map((t) => (
              <Chip
                key={t._id}
                label={t.name}
                color={t.color}
                selected={selectedTags.includes(t._id)}
                onPress={() => toggleTag(t._id)}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <View style={{ flex: 1 }}>
              <Input value={newTag} onChangeText={setNewTag} placeholder="Create a tag…" onSubmitEditing={addTag} />
            </View>
            <Button title="Add" onPress={addTag} variant="secondary" fullWidth={false} loading={createTag.isPending} />
          </View>
        </View>

        <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" multiline />

        {error ? (
          <Text variant="caption" color="danger">
            {error}
          </Text>
        ) : null}

        <Button title={initial ? 'Save changes' : 'Add investment'} onPress={submit} loading={submitting} style={{ marginTop: 4 }} />
      </View>
    </ScrollView>
  );
}
