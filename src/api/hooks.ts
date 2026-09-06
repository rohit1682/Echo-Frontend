import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { advisorApi, financeApi, InvestmentInput, investmentsApi, tagsApi } from './echo';

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  investments: (params?: object) => ['investments', params ?? {}] as const,
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

/** Invalidate everything that a finance mutation can affect. */
function useInvalidateFinance() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ['investments'] });
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

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) => tagsApi.create(name, color),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tags }),
  });
}
