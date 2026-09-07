import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text, Input, Button, Chip, DateField } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useTags, useCreateTag } from '../../api/hooks';
import { AssetInput } from '../../api/echo';
import { Asset, AssetCategory, ASSET_CATEGORY_LABELS, Tag } from '../../types';

interface Props {
  initial?: Asset | null;
  submitting?: boolean;
  onSubmit: (input: AssetInput) => void;
}

export function AssetForm({ initial, submitting, onSubmit }: Props) {
  const theme = useTheme();
  const { data: tags } = useTags();
  const createTag = useCreateTag();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>(AssetCategory.REAL_ESTATE);
  const [customCategory, setCustomCategory] = useState('');
  const [current, setCurrent] = useState('');
  const [purchase, setPurchase] = useState('');
  const [acquired, setAcquired] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setCategory(initial.category);
    setCustomCategory(initial.customCategory ?? '');
    setCurrent(String(initial.currentValue));
    setPurchase(initial.purchaseValue != null ? String(initial.purchaseValue) : '');
    setAcquired(initial.acquiredDate ? new Date(initial.acquiredDate) : null);
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
    const currentNum = Number(current);
    const purchaseNum = purchase.trim() === '' ? undefined : Number(purchase);
    if (!name.trim()) return setError('Name is required.');
    if (Number.isNaN(currentNum) || currentNum < 0) return setError('Enter a valid current value.');
    if (purchaseNum !== undefined && (Number.isNaN(purchaseNum) || purchaseNum < 0))
      return setError('Enter a valid purchase value.');

    onSubmit({
      name: name.trim(),
      category,
      customCategory: customCategory.trim() || undefined,
      currentValue: currentNum,
      purchaseValue: purchaseNum,
      acquiredDate: acquired ? acquired.toISOString() : undefined,
      notes: notes.trim() || undefined,
      tags: selectedTags,
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 14, paddingBottom: 8 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. Apartment, Car, Gold" />

        <View style={{ gap: 6 }}>
          <Text variant="label" color="textMuted">
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {Object.values(AssetCategory).map((c) => (
              <Chip
                key={c}
                label={ASSET_CATEGORY_LABELS[c]}
                selected={category === c}
                color={theme.colors.primary}
                onPress={() => setCategory(c)}
              />
            ))}
          </ScrollView>
        </View>

        {category === AssetCategory.OTHER ? (
          <Input
            label="Custom category"
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholder="Name your bucket (optional)"
          />
        ) : null}

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Current value" value={current} onChangeText={setCurrent} keyboardType="numeric" placeholder="0" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Purchase value" value={purchase} onChangeText={setPurchase} keyboardType="numeric" placeholder="Optional" />
          </View>
        </View>

        <DateField label="Acquired date" value={acquired} onChange={setAcquired} optional />

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

        <Button title={initial ? 'Save changes' : 'Add asset'} onPress={submit} loading={submitting} style={{ marginTop: 4 }} />
      </View>
    </ScrollView>
  );
}
