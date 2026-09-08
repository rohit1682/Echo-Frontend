import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Card, Sheet, Skeleton, EmptyState, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useAssets, useCreateAsset, useUpdateAsset, useDeleteAsset } from '../../api/hooks';
import { AssetForm } from './AssetForm';
import { AssetInput } from '../../api/echo';
import { Asset, ASSET_CATEGORY_LABELS } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/format';
import { haptics } from '../../utils/haptics';

export function AssetsPanel() {
  const theme = useTheme();
  const { data, isLoading, refetch, isRefetching } = useAssets();
  const createM = useCreateAsset();
  const updateM = useUpdateAsset();
  const deleteM = useDeleteAsset();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);

  const items = data ?? [];
  const total = items.reduce((sum, a) => sum + a.currentValue, 0);

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (asset: Asset) => {
    setEditing(asset);
    setSheetOpen(true);
  };

  const handleSubmit = async (input: AssetInput) => {
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
      Alert.alert('Error', 'Could not save the asset. Please try again.');
    }
  };

  const confirmDelete = (asset: Asset) => {
    Alert.alert('Delete asset', `Remove "${asset.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          haptics.medium();
          void deleteM.mutateAsync(asset._id);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} onRefresh={refetch} refreshing={isRefetching}>
        {isLoading ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={78} radius={theme.radius.lg} />
            ))}
          </View>
        ) : items.length === 0 ? (
          <EmptyState
            icon="home-outline"
            title="No assets yet"
            subtitle="Add real estate, a vehicle, gold or savings to see it counted in your net worth."
          />
        ) : (
          <View style={{ gap: 12, marginTop: 12 }}>
            <Animated.View entering={FadeInDown.duration(360)}>
              <Card>
                <Text variant="label" color="textMuted">
                  Total asset value
                </Text>
                <Text variant="title" style={{ marginTop: 2 }}>
                  {formatCurrency(total)}
                </Text>
              </Card>
            </Animated.View>
            {items.map((asset, index) => (
              <AssetRow
                key={asset._id}
                asset={asset}
                index={index}
                onPress={() => openEdit(asset)}
                onLongPress={() => confirmDelete(asset)}
              />
            ))}
          </View>
        )}
      </Screen>

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

      <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title={editing ? 'Edit asset' : 'New asset'}>
        <AssetForm initial={editing} submitting={createM.isPending || updateM.isPending} onSubmit={handleSubmit} />
      </Sheet>
    </View>
  );
}

function AssetRow({
  asset,
  index,
  onPress,
  onLongPress,
}: {
  asset: Asset;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const theme = useTheme();
  const label = asset.customCategory?.trim() || ASSET_CATEGORY_LABELS[asset.category];
  const hasGain = asset.purchaseValue != null && asset.purchaseValue > 0;
  const gain = hasGain ? asset.currentValue - (asset.purchaseValue as number) : 0;
  const pct = hasGain ? (gain / (asset.purchaseValue as number)) * 100 : 0;
  const positive = gain >= 0;

  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(360)}>
      <PressableScale onPress={onPress} onLongPress={onLongPress} haptic={false}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text variant="bodyStrong" numberOfLines={1}>
                {asset.name}
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
                {label}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="bodyStrong">{formatCurrency(asset.currentValue, asset.currency)}</Text>
              {hasGain ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 }}>
                  <Ionicons
                    name={positive ? 'caret-up' : 'caret-down'}
                    size={12}
                    color={positive ? theme.colors.success : theme.colors.danger}
                  />
                  <Text variant="caption" color={positive ? 'success' : 'danger'}>
                    {formatPercent(pct)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Card>
      </PressableScale>
    </Animated.View>
  );
}
