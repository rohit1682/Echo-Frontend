import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import {
  Screen,
  Text,
  Card,
  Chip,
  Sheet,
  Skeleton,
  EmptyState,
  PressableScale,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import {
  useInvestments,
  useCreateInvestment,
  useUpdateInvestment,
  useDeleteInvestment,
} from '../../api/hooks';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentInput } from '../../api/echo';
import { Investment, INVESTMENT_TYPE_LABELS, Tag } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/format';
import { haptics } from '../../utils/haptics';

export function InvestmentsPanel() {
  const theme = useTheme();
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, refetch, isRefetching } = useInvestments(
    typeFilter ? { type: typeFilter } : undefined,
  );
  const createM = useCreateInvestment();
  const updateM = useUpdateInvestment();
  const deleteM = useDeleteInvestment();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Investment | null>(null);

  const items = data?.items ?? [];
  const availableTypes = useMemo(() => {
    const set = new Set((data?.items ?? []).map((i) => i.type));
    return Array.from(set);
  }, [data]);

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (inv: Investment) => {
    setEditing(inv);
    setSheetOpen(true);
  };

  const handleSubmit = async (input: InvestmentInput) => {
    try {
      if (editing) {
        await updateM.mutateAsync({ id: editing._id, input });
      } else {
        await createM.mutateAsync(input);
      }
      haptics.success();
      setSheetOpen(false);
      setEditing(null);
    } catch {
      haptics.warning();
      Alert.alert('Error', 'Could not save the investment. Please try again.');
    }
  };

  const confirmDelete = (inv: Investment) => {
    Alert.alert('Delete investment', `Remove "${inv.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          haptics.medium();
          void deleteM.mutateAsync(inv._id);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} onRefresh={refetch} refreshing={isRefetching}>
        {/* Type filters */}
        {availableTypes.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 4 }}>
            <Chip label="All" selected={!typeFilter} onPress={() => setTypeFilter(undefined)} />
            {availableTypes.map((t) => (
              <Chip
                key={t}
                label={INVESTMENT_TYPE_LABELS[t]}
                selected={typeFilter === t}
                onPress={() => setTypeFilter(t)}
              />
            ))}
          </View>
        )}

        {isLoading ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={78} radius={theme.radius.lg} />
            ))}
          </View>
        ) : items.length === 0 ? (
          <EmptyState
            icon="add-circle-outline"
            title="No investments yet"
            subtitle="Add your first investment to see it here and in your dashboard."
          />
        ) : (
          <View style={{ gap: 12, marginTop: 12 }}>
            {items.map((inv, index) => (
              <InvestmentRow
                key={inv._id}
                inv={inv}
                index={index}
                onPress={() => openEdit(inv)}
                onLongPress={() => confirmDelete(inv)}
              />
            ))}
          </View>
        )}
      </Screen>

      {/* FAB */}
      <PressableScale
        onPress={openAdd}
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

      <Sheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? 'Edit investment' : 'New investment'}
      >
        <InvestmentForm
          initial={editing}
          submitting={createM.isPending || updateM.isPending}
          onSubmit={handleSubmit}
        />
      </Sheet>
    </View>
  );
}

function InvestmentRow({
  inv,
  index,
  onPress,
  onLongPress,
}: {
  inv: Investment;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const theme = useTheme();
  const gain = inv.currentValue - inv.investedAmount;
  const pct = inv.investedAmount > 0 ? (gain / inv.investedAmount) * 100 : 0;
  const positive = gain >= 0;
  const tags = (inv.tags as Tag[]).filter((t) => typeof t !== 'string') as Tag[];

  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(360)}>
      <PressableScale onPress={onPress} onLongPress={onLongPress} haptic={false}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text variant="bodyStrong" numberOfLines={1}>
                {inv.name}
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
                {INVESTMENT_TYPE_LABELS[inv.type]}
              </Text>
              {tags.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {tags.slice(0, 3).map((t) => (
                    <Chip key={t._id} label={t.name} color={t.color} />
                  ))}
                </View>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="bodyStrong">{formatCurrency(inv.currentValue, inv.currency)}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  marginTop: 4,
                }}
              >
                <Ionicons
                  name={positive ? 'caret-up' : 'caret-down'}
                  size={12}
                  color={positive ? theme.colors.success : theme.colors.danger}
                />
                <Text variant="caption" color={positive ? 'success' : 'danger'}>
                  {formatPercent(pct)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </PressableScale>
    </Animated.View>
  );
}
