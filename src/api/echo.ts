import { api } from './client';
import {
  AdvisorResponse,
  Asset,
  AssetCategory,
  AuthResult,
  Budget,
  BudgetSummary,
  DashboardSummary,
  Expense,
  Frequency,
  Investment,
  Loan,
  NetWorthPoint,
  Paginated,
  RecordStatus,
  Tag,
  Task,
  TaskPriority,
  User,
} from '../types';

// ---- Auth ----
export const authApi = {
  async login(email: string, password: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/login', { email, password });
    return data;
  },
  async register(email: string, password: string, name?: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/register', { email, password, name });
    return data;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};

// ---- Users ----
export const usersApi = {
  async me(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },
  async updateMe(patch: Partial<Pick<User, 'name' | 'avatarUrl'>> & { preferences?: Partial<User['preferences']> }): Promise<User> {
    const { data } = await api.patch<User>('/users/me', patch);
    return data;
  },
};

// ---- Tags ----
export const tagsApi = {
  async list(): Promise<Tag[]> {
    const { data } = await api.get<Tag[]>('/tags');
    return data;
  },
  async create(name: string, color?: string): Promise<Tag> {
    const { data } = await api.post<Tag>('/tags', { name, color });
    return data;
  },
};

// ---- Investments ----
export interface InvestmentInput {
  name: string;
  type: string;
  investedAmount: number;
  currentValue: number;
  riskLevel?: string;
  investmentDate: string;
  frequency?: string;
  maturityDate?: string;
  symbol?: string;
  notes?: string;
  tags?: string[];
}

export const investmentsApi = {
  async list(params?: { type?: string; tag?: string; page?: number; limit?: number }): Promise<Paginated<Investment>> {
    const { data } = await api.get<Paginated<Investment>>('/finance/investments', { params });
    return data;
  },
  async create(input: InvestmentInput): Promise<Investment> {
    const { data } = await api.post<Investment>('/finance/investments', input);
    return data;
  },
  async update(id: string, input: Partial<InvestmentInput>): Promise<Investment> {
    const { data } = await api.patch<Investment>(`/finance/investments/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/finance/investments/${id}`);
  },
};

// ---- Assets ----
export interface AssetInput {
  name: string;
  category?: AssetCategory;
  customCategory?: string;
  currentValue: number;
  purchaseValue?: number;
  acquiredDate?: string;
  notes?: string;
  tags?: string[];
}

export const assetsApi = {
  async list(): Promise<Asset[]> {
    const { data } = await api.get<Asset[]>('/finance/assets');
    return data;
  },
  async create(input: AssetInput): Promise<Asset> {
    const { data } = await api.post<Asset>('/finance/assets', input);
    return data;
  },
  async update(id: string, input: Partial<AssetInput>): Promise<Asset> {
    const { data } = await api.patch<Asset>(`/finance/assets/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/finance/assets/${id}`);
  },
};

// ---- Loans ----
export interface LoanInput {
  name: string;
  lender?: string;
  principal: number;
  outstanding: number;
  interestRate?: number;
  emiAmount?: number;
  tenureMonths?: number;
  startDate?: string;
  nextDueDate?: string;
  status?: RecordStatus;
  notes?: string;
}

export const loansApi = {
  async list(): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>('/finance/loans');
    return data;
  },
  async create(input: LoanInput): Promise<Loan> {
    const { data } = await api.post<Loan>('/finance/loans', input);
    return data;
  },
  async update(id: string, input: Partial<LoanInput>): Promise<Loan> {
    const { data } = await api.patch<Loan>(`/finance/loans/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/finance/loans/${id}`);
  },
};

// ---- Expenses ----
export interface ExpenseInput {
  amount: number;
  description?: string;
  categoryId?: string;
  spentAt?: string;
  tags?: string[];
}

export const expensesApi = {
  async list(): Promise<Expense[]> {
    const { data } = await api.get<Expense[]>('/finance/expenses');
    return data;
  },
  async create(input: ExpenseInput): Promise<Expense> {
    const { data } = await api.post<Expense>('/finance/expenses', input);
    return data;
  },
  async update(id: string, input: Partial<ExpenseInput>): Promise<Expense> {
    const { data } = await api.patch<Expense>(`/finance/expenses/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/finance/expenses/${id}`);
  },
};

// ---- Budgets ----
export interface BudgetInput {
  name: string;
  categoryId?: string;
  limit: number;
  period?: Frequency;
}

export const budgetsApi = {
  async list(): Promise<Budget[]> {
    const { data } = await api.get<Budget[]>('/finance/budgets');
    return data;
  },
  async summary(): Promise<BudgetSummary[]> {
    const { data } = await api.get<BudgetSummary[]>('/finance/budgets/summary');
    return data;
  },
  async create(input: BudgetInput): Promise<Budget> {
    const { data } = await api.post<Budget>('/finance/budgets', input);
    return data;
  },
  async update(id: string, input: Partial<BudgetInput>): Promise<Budget> {
    const { data } = await api.patch<Budget>(`/finance/budgets/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/finance/budgets/${id}`);
  },
};

// ---- Dashboard / Advisor ----
export const financeApi = {
  async dashboard(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>('/finance/dashboard');
    return data;
  },
  async netWorthHistory(limit?: number): Promise<NetWorthPoint[]> {
    const { data } = await api.get<NetWorthPoint[]>('/finance/networth/history', {
      params: limit ? { limit } : undefined,
    });
    return data;
  },
};

export const advisorApi = {
  async recommendations(): Promise<AdvisorResponse> {
    const { data } = await api.get<AdvisorResponse>('/advisor/recommendations');
    return data;
  },
};

// ---- Tasks (Personal Activity) ----
export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  recurrence?: Frequency;
  priority?: TaskPriority;
  tags?: string[];
}

export const tasksApi = {
  async list(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/activity/tasks');
    return data;
  },
  async create(input: TaskInput): Promise<Task> {
    const { data } = await api.post<Task>('/activity/tasks', input);
    return data;
  },
  async update(id: string, input: Partial<TaskInput> & { completed?: boolean }): Promise<Task> {
    const { data } = await api.patch<Task>(`/activity/tasks/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/activity/tasks/${id}`);
  },
};
