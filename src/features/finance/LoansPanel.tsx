import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Card, Sheet, Skeleton, EmptyState, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useLoans, useCreateLoan, useUpdateLoan, useDeleteLoan } from '../../api/hooks';
import { LoanForm } from './LoanForm';
import { LoanInput } from '../../api/echo';
import { Loan, RecordStatus, LOAN_STATUS_LABELS } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { haptics } from '../../utils/haptics';

export function LoansPanel() {
  const theme = useTheme();
  const { data, isLoading, refetch, isRefetching } = useLoans();
  const createM = useCreateLoan();
  const updateM = useUpdateLoan();
  const deleteM = useDeleteLoan();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Loan | null>(null);

  const items = data ?? [];
  const totalOutstanding = items
    .filter((l) => l.status === RecordStatus.ACTIVE)
    .reduce((sum, l) => sum + l.outstanding, 0);

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (loan: Loan) => {
    setEditing(loan);
    setSheetOpen(true);
  };

  const handleSubmit = async (input: LoanInput) => {
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
      Alert.alert('Error', 'Could not save the loan. Please try again.');
    }
  };

  const confirmDelete = (loan: Loan) => {
    Alert.alert('Delete loan', `Remove "${loan.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          haptics.medium();
          void deleteM.mutateAsync(loan._id);
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
            icon="card-outline"
            title="No loans yet"
            subtitle="Track home, car or personal loans and their EMIs — outstanding balances reduce your net worth."
          />
        ) : (
          <View style={{ gap: 12, marginTop: 12 }}>
            <Animated.View entering={FadeInDown.duration(360)}>
              <Card>
                <Text variant="label" color="textMuted">
                  Total outstanding
                </Text>
                <Text variant="title" color="danger" style={{ marginTop: 2 }}>
                  {formatCurrency(totalOutstanding)}
                </Text>
              </Card>
            </Animated.View>
            {items.map((loan, index) => (
              <LoanRow
                key={loan._id}
                loan={loan}
                index={index}
                onPress={() => openEdit(loan)}
                onLongPress={() => confirmDelete(loan)}
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

      <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title={editing ? 'Edit loan' : 'New loan'}>
        <LoanForm initial={editing} submitting={createM.isPending || updateM.isPending} onSubmit={handleSubmit} />
      </Sheet>
    </View>
  );
}

function LoanRow({
  loan,
  index,
  onPress,
  onLongPress,
}: {
  loan: Loan;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const theme = useTheme();
  const closed = loan.status !== RecordStatus.ACTIVE;

  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(360)}>
      <PressableScale onPress={onPress} onLongPress={onLongPress} haptic={false}>
        <Card style={{ opacity: closed ? 0.6 : 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text variant="bodyStrong" numberOfLines={1}>
                {loan.name}
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
                {loan.lender ? `${loan.lender} · ` : ''}
                {LOAN_STATUS_LABELS[loan.status]}
                {loan.emiAmount ? ` · EMI ${formatCurrency(loan.emiAmount, loan.currency, { compact: true })}` : ''}
              </Text>
              {loan.nextDueDate && !closed ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Ionicons name="calendar-outline" size={12} color={theme.colors.warning} />
                  <Text variant="caption" color="warning">
                    Due {formatDate(loan.nextDueDate, { year: undefined })}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="bodyStrong" color="danger">
                {formatCurrency(loan.outstanding, loan.currency)}
              </Text>
              <Text variant="caption" color="textFaint" style={{ marginTop: 2 }}>
                of {formatCurrency(loan.principal, loan.currency, { compact: true })}
              </Text>
            </View>
          </View>
        </Card>
      </PressableScale>
    </Animated.View>
  );
}
