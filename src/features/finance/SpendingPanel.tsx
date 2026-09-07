import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Text, Card, Sheet, Skeleton, EmptyState, PressableScale } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import {
  useExpenses,
  useBudgetSummary,
  useCreateExpense,
  useDeleteExpense,
  useCreateBudget,
  useDeleteBudget,
} from '../../api/hooks';
import { ExpenseForm } from './ExpenseForm';
import { BudgetForm } from './BudgetForm';
import { ExpenseInput, BudgetInput } from '../../api/echo';
import { Expense, BudgetSummary } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { haptics } from '../../utils/haptics';

export function SpendingPanel() {
  const theme = useTheme();
  const expensesQ = useExpenses();
  const budgetsQ = useBudgetSummary();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const createBudget = useCreateBudget();
  const deleteBudget = useDeleteBudget();

  const [expenseSheet, setExpenseSheet] = useState(false);
  const [budgetSheet, setBudgetSheet] = useState(false);

  const expenses = expensesQ.data ?? [];
  const budgets = budgetsQ.data ?? [];
  const loading = expensesQ.isLoading || budgetsQ.isLoading;

  const onAddExpense = async (input: ExpenseInput) => {
    try {
      await createExpense.mutateAsync(input);
      haptics.success();
      setExpenseSheet(false);
    } catch {
      haptics.warning();
      Alert.alert('Error', 'Could not save the expense.');
    }
  };

  const onAddBudget = async (input: BudgetInput) => {
    try {
      await createBudget.mutateAsync(input);
      haptics.success();
      setBudgetSheet(false);
    } catch {
      haptics.warning();
      Alert.alert('Error', 'Could not save the budget.');
    }
  };

  const confirmDeleteExpense = (e: Expense) => {
    Alert.alert('Delete expense', `Remove this ${formatCurrency(e.amount, e.currency)} expense?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { haptics.medium(); void deleteExpense.mutateAsync(e._id); } },
    ]);
  };

  const confirmDeleteBudget = (b: BudgetSummary) => {
    Alert.alert('Delete budget', `Remove "${b.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { haptics.medium(); void deleteBudget.mutateAsync(b._id); } },
    ]);
  };

  const refetch = () => {
    void expensesQ.refetch();
    void budgetsQ.refetch();
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} onRefresh={refetch} refreshing={expensesQ.isRefetching || budgetsQ.isRefetching}>
        {loading ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={72} radius={theme.radius.lg} />
            ))}
          </View>
        ) : (
          <View style={{ gap: 16, marginTop: 12 }}>
            {/* Budgets */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, marginLeft: 4 }}>
                <Text variant="label" color="textMuted">
                  BUDGETS
                </Text>
                <PressableScale onPress={() => setBudgetSheet(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="add-circle" size={18} color={theme.colors.primary} />
                  <Text variant="label" color="primary">
                    Add
                  </Text>
                </PressableScale>
              </View>
              {budgets.length === 0 ? (
                <Card>
                  <Text variant="body" color="textMuted">
                    Set a budget to track your spending against a monthly limit.
                  </Text>
                </Card>
              ) : (
                <View style={{ gap: 12 }}>
                  {budgets.map((b, i) => (
                    <BudgetCard key={b._id} budget={b} index={i} onLongPress={() => confirmDeleteBudget(b)} />
                  ))}
                </View>
              )}
            </View>

            {/* Recent expenses */}
            <View>
              <Text variant="label" color="textMuted" style={{ marginBottom: 8, marginLeft: 4 }}>
                RECENT EXPENSES
              </Text>
              {expenses.length === 0 ? (
                <EmptyState icon="receipt-outline" title="No expenses yet" subtitle="Tap + to log your first expense." />
              ) : (
                <View style={{ gap: 10 }}>
                  {expenses.map((e, i) => (
                    <ExpenseRow key={e._id} expense={e} index={i} onLongPress={() => confirmDeleteExpense(e)} />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </Screen>

      <PressableScale
        onPress={() => setExpenseSheet(true)}
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

      <Sheet visible={expenseSheet} onClose={() => setExpenseSheet(false)} title="New expense">
        <ExpenseForm submitting={createExpense.isPending} onSubmit={onAddExpense} />
      </Sheet>
      <Sheet visible={budgetSheet} onClose={() => setBudgetSheet(false)} title="New budget">
        <BudgetForm submitting={createBudget.isPending} onSubmit={onAddBudget} />
      </Sheet>
    </View>
  );
}

function BudgetCard({ budget, index, onLongPress }: { budget: BudgetSummary; index: number; onLongPress: () => void }) {
  const theme = useTheme();
  const ratio = Math.max(0, Math.min(1, budget.percent / 100));
  const over = budget.spent > budget.limit;
  const barColor = over ? theme.colors.danger : budget.percent > 80 ? theme.colors.warning : theme.colors.success;

  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(360)}>
      <PressableScale onLongPress={onLongPress} haptic={false}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text variant="bodyStrong">{budget.name}</Text>
            <Text variant="label" color={over ? 'danger' : 'textMuted'}>
              {formatCurrency(budget.spent, budget.currency)} / {formatCurrency(budget.limit, budget.currency)}
            </Text>
          </View>
          <ProgressBar ratio={ratio} color={barColor} />
          <Text variant="caption" color={over ? 'danger' : 'textFaint'} style={{ marginTop: 6 }}>
            {over
              ? `Over by ${formatCurrency(budget.spent - budget.limit, budget.currency)}`
              : `${formatCurrency(budget.remaining, budget.currency)} left`}
          </Text>
        </Card>
      </PressableScale>
    </Animated.View>
  );
}

function ProgressBar({ ratio, color }: { ratio: number; color: string }) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [ratio, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceAlt, overflow: 'hidden' }}>
      <Animated.View style={[{ height: 8, borderRadius: 4, backgroundColor: color }, fillStyle]} />
    </View>
  );
}

function ExpenseRow({ expense, index, onLongPress }: { expense: Expense; index: number; onLongPress: () => void }) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(index * 35).duration(320)}>
      <PressableScale onLongPress={onLongPress} haptic={false}>
        <Card padded={false} style={{ padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="receipt-outline" size={18} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" numberOfLines={1}>
                  {expense.description || 'Expense'}
                </Text>
                <Text variant="caption" color="textFaint" style={{ marginTop: 2 }}>
                  {formatDate(expense.spentAt)}
                </Text>
              </View>
            </View>
            <Text variant="bodyStrong">{formatCurrency(expense.amount, expense.currency)}</Text>
          </View>
        </Card>
      </PressableScale>
    </Animated.View>
  );
}
