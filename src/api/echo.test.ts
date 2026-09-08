import { api } from './client';
import {
  authApi,
  usersApi,
  tagsApi,
  investmentsApi,
  assetsApi,
  loansApi,
  expensesApi,
  budgetsApi,
  tasksApi,
  financeApi,
  advisorApi,
} from './echo';

jest.mock('./client', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const mockApi = api as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockApi.get.mockResolvedValue({ data: 'GET' });
  mockApi.post.mockResolvedValue({ data: 'POST' });
  mockApi.patch.mockResolvedValue({ data: 'PATCH' });
  mockApi.delete.mockResolvedValue({ data: undefined });
});

describe('authApi', () => {
  it('login posts credentials', async () => {
    await expect(authApi.login('a@b.com', 'pw')).resolves.toBe('POST');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'pw' });
  });
  it('register posts details', async () => {
    await authApi.register('a@b.com', 'pw', 'N');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/register', { email: 'a@b.com', password: 'pw', name: 'N' });
  });
  it('logout posts', async () => {
    await authApi.logout();
    expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
  });
});

describe('usersApi', () => {
  it('me gets the profile', async () => {
    await expect(usersApi.me()).resolves.toBe('GET');
    expect(mockApi.get).toHaveBeenCalledWith('/users/me');
  });
  it('updateMe patches the profile', async () => {
    await usersApi.updateMe({ name: 'X' });
    expect(mockApi.patch).toHaveBeenCalledWith('/users/me', { name: 'X' });
  });
});

describe('tagsApi', () => {
  it('list gets tags', async () => {
    await tagsApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/tags');
  });
  it('create posts a tag', async () => {
    await tagsApi.create('Long Term', '#fff');
    expect(mockApi.post).toHaveBeenCalledWith('/tags', { name: 'Long Term', color: '#fff' });
  });
});

describe('investmentsApi', () => {
  it('list passes params', async () => {
    await investmentsApi.list({ type: 'crypto' });
    expect(mockApi.get).toHaveBeenCalledWith('/finance/investments', { params: { type: 'crypto' } });
  });
  it('list works with no params', async () => {
    await investmentsApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/investments', { params: undefined });
  });
  it('create posts', async () => {
    const input = { name: 'A', type: 'stock', investedAmount: 1, currentValue: 2, investmentDate: 'd' };
    await investmentsApi.create(input);
    expect(mockApi.post).toHaveBeenCalledWith('/finance/investments', input);
  });
  it('update patches by id', async () => {
    await investmentsApi.update('i1', { name: 'B' });
    expect(mockApi.patch).toHaveBeenCalledWith('/finance/investments/i1', { name: 'B' });
  });
  it('remove deletes by id', async () => {
    await investmentsApi.remove('i1');
    expect(mockApi.delete).toHaveBeenCalledWith('/finance/investments/i1');
  });
});

describe('assetsApi', () => {
  it('list gets assets', async () => {
    await assetsApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/assets');
  });
  it('create posts', async () => {
    const input = { name: 'Flat', currentValue: 100 };
    await assetsApi.create(input);
    expect(mockApi.post).toHaveBeenCalledWith('/finance/assets', input);
  });
  it('update patches by id', async () => {
    await assetsApi.update('a1', { currentValue: 200 });
    expect(mockApi.patch).toHaveBeenCalledWith('/finance/assets/a1', { currentValue: 200 });
  });
  it('remove deletes by id', async () => {
    await assetsApi.remove('a1');
    expect(mockApi.delete).toHaveBeenCalledWith('/finance/assets/a1');
  });
});

describe('loansApi', () => {
  it('list gets loans', async () => {
    await loansApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/loans');
  });
  it('create posts', async () => {
    const input = { name: 'Home loan', principal: 1000, outstanding: 900 };
    await loansApi.create(input);
    expect(mockApi.post).toHaveBeenCalledWith('/finance/loans', input);
  });
  it('update patches by id', async () => {
    await loansApi.update('l1', { outstanding: 800 });
    expect(mockApi.patch).toHaveBeenCalledWith('/finance/loans/l1', { outstanding: 800 });
  });
  it('remove deletes by id', async () => {
    await loansApi.remove('l1');
    expect(mockApi.delete).toHaveBeenCalledWith('/finance/loans/l1');
  });
});

describe('expensesApi', () => {
  it('list gets expenses', async () => {
    await expensesApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/expenses');
  });
  it('create posts', async () => {
    const input = { amount: 250, description: 'Lunch' };
    await expensesApi.create(input);
    expect(mockApi.post).toHaveBeenCalledWith('/finance/expenses', input);
  });
  it('update patches by id', async () => {
    await expensesApi.update('e1', { amount: 300 });
    expect(mockApi.patch).toHaveBeenCalledWith('/finance/expenses/e1', { amount: 300 });
  });
  it('remove deletes by id', async () => {
    await expensesApi.remove('e1');
    expect(mockApi.delete).toHaveBeenCalledWith('/finance/expenses/e1');
  });
});

describe('budgetsApi', () => {
  it('list gets budgets', async () => {
    await budgetsApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/budgets');
  });
  it('summary gets budget summary', async () => {
    await budgetsApi.summary();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/budgets/summary');
  });
  it('create posts', async () => {
    const input = { name: 'Food', limit: 5000 };
    await budgetsApi.create(input);
    expect(mockApi.post).toHaveBeenCalledWith('/finance/budgets', input);
  });
  it('update patches by id', async () => {
    await budgetsApi.update('b1', { limit: 6000 });
    expect(mockApi.patch).toHaveBeenCalledWith('/finance/budgets/b1', { limit: 6000 });
  });
  it('remove deletes by id', async () => {
    await budgetsApi.remove('b1');
    expect(mockApi.delete).toHaveBeenCalledWith('/finance/budgets/b1');
  });
});

describe('financeApi + advisorApi', () => {
  it('dashboard gets summary', async () => {
    await financeApi.dashboard();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/dashboard');
  });
  it('netWorthHistory passes a limit', async () => {
    await financeApi.netWorthHistory(30);
    expect(mockApi.get).toHaveBeenCalledWith('/finance/networth/history', { params: { limit: 30 } });
  });
  it('netWorthHistory works with no limit', async () => {
    await financeApi.netWorthHistory();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/networth/history', { params: undefined });
  });
  it('advisor gets recommendations', async () => {
    await advisorApi.recommendations();
    expect(mockApi.get).toHaveBeenCalledWith('/advisor/recommendations');
  });
});

describe('tasksApi', () => {
  it('list gets tasks', async () => {
    await tasksApi.list();
    expect(mockApi.get).toHaveBeenCalledWith('/activity/tasks');
  });
  it('create posts', async () => {
    const input = { title: 'Pay bill' };
    await tasksApi.create(input);
    expect(mockApi.post).toHaveBeenCalledWith('/activity/tasks', input);
  });
  it('update patches by id', async () => {
    await tasksApi.update('t1', { completed: true });
    expect(mockApi.patch).toHaveBeenCalledWith('/activity/tasks/t1', { completed: true });
  });
  it('remove deletes by id', async () => {
    await tasksApi.remove('t1');
    expect(mockApi.delete).toHaveBeenCalledWith('/activity/tasks/t1');
  });
});
