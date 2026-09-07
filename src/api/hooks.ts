import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  advisorApi,
  AssetInput,
  assetsApi,
  BudgetInput,
  budgetsApi,
  ExpenseInput,
  expensesApi,
  financeApi,
  InvestmentInput,
  investmentsApi,
  LoanInput,
  loansApi,
  tagsApi,
  TaskInput,
  tasksApi,
} from './echo';

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  investments: (params?: object) => ['investments', params ?? {}] as const,
  assets: ['assets'] as const,
  loans: ['loans'] as const,
  netWorthHistory: (limit?: number) => ['networth-history', limit ?? 0] as const,
  expenses: ['expenses'] as const,
  budgets: ['budgets'] as const,
  budgetSummary: ['budget-summary'] as const,
  tasks: ['tasks'] as const,
  tags: ['tags'] as const,
  advisor: ['advisor'] as const,
};

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: financeApi.dashboard });
}

export function useInvestments(params?: { type?: string; tag?: string }) {
  return useQuery({
    queryKey: queryKeys.investments(params),
    queryFn: () => investmentsApi.list(params),
  });
}

export function useTags() {
  return useQuery({ queryKey: queryKeys.tags, queryFn: tagsApi.list });
}

export function useAdvisor() {
  return useQuery({ queryKey: queryKeys.advisor, queryFn: advisorApi.recommendations });
}

export function useAssets() {
  return useQuery({ queryKey: queryKeys.assets, queryFn: assetsApi.list });
}

export function useLoans() {
  return useQuery({ queryKey: queryKeys.loans, queryFn: loansApi.list });
}

export function useNetWorthHistory(limit?: number) {
  return useQuery({
    queryKey: queryKeys.netWorthHistory(limit),
    queryFn: () => financeApi.netWorthHistory(limit),
  });
}

/** Invalidate everything that a finance mutation can affect. */
function useInvalidateFinance() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ['investments'] });
    void qc.invalidateQueries({ queryKey: queryKeys.assets });
    void qc.invalidateQueries({ queryKey: queryKeys.loans });
    void qc.invalidateQueries({ queryKey: ['networth-history'] });
    void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    void qc.invalidateQueries({ queryKey: queryKeys.advisor });
  };
}

export function useCreateInvestment() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (input: InvestmentInput) => investmentsApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateInvestment() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<InvestmentInput> }) =>
      investmentsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteInvestment() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (id: string) => investmentsApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useCreateAsset() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (input: AssetInput) => assetsApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateAsset() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AssetInput> }) =>
      assetsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteAsset() {
  const invalidate = useInvalidateFinance();
  return useMutation({ mutationFn: (id: string) => assetsApi.remove(id), onSuccess: invalidate });
}

export function useCreateLoan() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (input: LoanInput) => loansApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateLoan() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<LoanInput> }) =>
      loansApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteLoan() {
  const invalidate = useInvalidateFinance();
  return useMutation({ mutationFn: (id: string) => loansApi.remove(id), onSuccess: invalidate });
}

/** Expenses affect budget progress (but not net worth). */
function useInvalidateSpending() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: queryKeys.expenses });
    void qc.invalidateQueries({ queryKey: queryKeys.budgets });
    void qc.invalidateQueries({ queryKey: queryKeys.budgetSummary });
    void qc.invalidateQueries({ queryKey: queryKeys.advisor });
  };
}

export function useExpenses() {
  return useQuery({ queryKey: queryKeys.expenses, queryFn: expensesApi.list });
}

export function useBudgetSummary() {
  return useQuery({ queryKey: queryKeys.budgetSummary, queryFn: budgetsApi.summary });
}

export function useCreateExpense() {
  const invalidate = useInvalidateSpending();
  return useMutation({ mutationFn: (input: ExpenseInput) => expensesApi.create(input), onSuccess: invalidate });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateSpending();
  return useMutation({ mutationFn: (id: string) => expensesApi.remove(id), onSuccess: invalidate });
}

export function useCreateBudget() {
  const invalidate = useInvalidateSpending();
  return useMutation({ mutationFn: (input: BudgetInput) => budgetsApi.create(input), onSuccess: invalidate });
}

export function useDeleteBudget() {
  const invalidate = useInvalidateSpending();
  return useMutation({ mutationFn: (id: string) => budgetsApi.remove(id), onSuccess: invalidate });
}

export function useTasks() {
  return useQuery({ queryKey: queryKeys.tasks, queryFn: tasksApi.list });
}

function useInvalidateTasks() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.tasks });
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: (input: TaskInput) => tasksApi.create(input), onSuccess: invalidate });
}

export function useUpdateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> & { completed?: boolean } }) =>
      tasksApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: (id: string) => tasksApi.remove(id), onSuccess: invalidate });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) => tagsApi.create(name, color),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tags }),
  });
}
