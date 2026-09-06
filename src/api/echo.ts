import { api } from './client';
import {
  AdvisorResponse,
  AuthResult,
  DashboardSummary,
  Investment,
  Paginated,
  Tag,
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

// ---- Dashboard / Advisor ----
export const financeApi = {
  async dashboard(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>('/finance/dashboard');
    return data;
  },
};

export const advisorApi = {
  async recommendations(): Promise<AdvisorResponse> {
    const { data } = await api.get<AdvisorResponse>('/advisor/recommendations');
    return data;
  },
};
