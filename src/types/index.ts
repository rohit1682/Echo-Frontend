/**
 * Shared types mirroring the backend API (keep in sync with Echo-Backend
 * `src/common/enums.ts` and the finance DTOs/schemas).
 */

export enum InvestmentType {
  MUTUAL_FUND = 'mutual_fund',
  SIP = 'sip',
  STOCK = 'stock',
  FIXED_DEPOSIT = 'fixed_deposit',
  RECURRING_DEPOSIT = 'recurring_deposit',
  PPF = 'ppf',
  EPF = 'epf',
  NPS = 'nps',
  GOLD = 'gold',
  CRYPTO = 'crypto',
  BOND = 'bond',
  OTHER = 'other',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum Frequency {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
}

export enum RecordStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AssetCategory {
  REAL_ESTATE = 'real_estate',
  VEHICLE = 'vehicle',
  GOLD = 'gold',
  SAVINGS_ACCOUNT = 'savings_account',
  FIXED_DEPOSIT = 'fixed_deposit',
  PHYSICAL = 'physical',
  OTHER = 'other',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type RecommendationSeverity = 'info' | 'suggestion' | 'warning' | 'critical';
export type RecommendationDomain = 'finance' | 'activity' | 'general';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface Investment {
  _id: string;
  name: string;
  type: InvestmentType;
  investedAmount: number;
  currentValue: number;
  currency: string;
  riskLevel: RiskLevel;
  investmentDate: string;
  frequency: Frequency;
  maturityDate?: string;
  status: RecordStatus;
  symbol?: string;
  notes?: string;
  tags: Tag[] | string[];
  createdAt?: string;
}

export interface Asset {
  _id: string;
  name: string;
  category: AssetCategory;
  customCategory?: string;
  currentValue: number;
  purchaseValue?: number;
  currency: string;
  acquiredDate?: string;
  notes?: string;
  tags: Tag[] | string[];
  createdAt?: string;
}

export interface Loan {
  _id: string;
  name: string;
  lender?: string;
  principal: number;
  outstanding: number;
  interestRate: number;
  emiAmount: number;
  tenureMonths?: number;
  startDate?: string;
  nextDueDate?: string;
  currency: string;
  status: RecordStatus;
  notes?: string;
  createdAt?: string;
}

/** A point on the net-worth trend, from `GET /finance/networth/history`. */
export interface NetWorthPoint {
  _id: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  capturedAt: string;
}

export interface Expense {
  _id: string;
  amount: number;
  description?: string;
  categoryId?: string | null;
  spentAt: string;
  currency: string;
  tags: Tag[] | string[];
  createdAt?: string;
}

export interface Budget {
  _id: string;
  name: string;
  categoryId?: string | null;
  limit: number;
  period: Frequency;
  currency: string;
}

/** A budget with computed spend for the current period, from `/finance/budgets/summary`. */
export interface BudgetSummary {
  _id: string;
  name: string;
  categoryId: string | null;
  limit: number;
  period: Frequency;
  currency: string;
  spent: number;
  remaining: number;
  percent: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AllocationSlice {
  key: string;
  label: string;
  value: number;
  percent: number;
}

export interface DashboardSummary {
  totals: {
    totalInvested: number;
    totalCurrentValue: number;
    totalGain: number;
    totalGainPercent: number;
    investmentCount: number;
    assetCount: number;
    loanCount: number;
  };
  netWorth: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  };
  allocationByType: AllocationSlice[];
  allocationByRisk: AllocationSlice[];
  upcoming: { sips: unknown[]; premiums: unknown[]; commitments: unknown[] };
  currency: string;
}

export interface Recommendation {
  domain: RecommendationDomain;
  severity: RecommendationSeverity;
  title: string;
  message: string;
  code?: string;
  source: 'rules' | 'llm';
}

export interface AdvisorResponse {
  recommendations: Recommendation[];
  source: 'rules' | 'llm';
  llmEnabled: boolean;
  generatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  recurrence: Frequency;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  tags: Tag[] | string[];
  createdAt?: string;
}

export interface UserPreferences {
  theme: ThemePreference;
  currency: string;
  biometricLockEnabled: boolean;
  syncContacts: boolean;
  syncCalendar: boolean;
  reminderDefaults: { daysBefore: number[] };
}

export interface User {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  [InvestmentType.MUTUAL_FUND]: 'Mutual Fund',
  [InvestmentType.SIP]: 'SIP',
  [InvestmentType.STOCK]: 'Stock',
  [InvestmentType.FIXED_DEPOSIT]: 'Fixed Deposit',
  [InvestmentType.RECURRING_DEPOSIT]: 'Recurring Deposit',
  [InvestmentType.PPF]: 'PPF',
  [InvestmentType.EPF]: 'EPF',
  [InvestmentType.NPS]: 'NPS',
  [InvestmentType.GOLD]: 'Gold',
  [InvestmentType.CRYPTO]: 'Crypto',
  [InvestmentType.BOND]: 'Bond',
  [InvestmentType.OTHER]: 'Other',
};

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  [AssetCategory.REAL_ESTATE]: 'Real Estate',
  [AssetCategory.VEHICLE]: 'Vehicle',
  [AssetCategory.GOLD]: 'Gold',
  [AssetCategory.SAVINGS_ACCOUNT]: 'Savings',
  [AssetCategory.FIXED_DEPOSIT]: 'Fixed Deposit',
  [AssetCategory.PHYSICAL]: 'Physical',
  [AssetCategory.OTHER]: 'Other',
};

export const LOAN_STATUS_LABELS: Record<RecordStatus, string> = {
  [RecordStatus.ACTIVE]: 'Active',
  [RecordStatus.PAUSED]: 'Paused',
  [RecordStatus.COMPLETED]: 'Closed',
  [RecordStatus.CANCELLED]: 'Cancelled',
};
