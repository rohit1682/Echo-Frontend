import { api } from './client';
import { authApi, usersApi, tagsApi, investmentsApi, financeApi, advisorApi } from './echo';

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

describe('financeApi + advisorApi', () => {
  it('dashboard gets summary', async () => {
    await financeApi.dashboard();
    expect(mockApi.get).toHaveBeenCalledWith('/finance/dashboard');
  });
  it('advisor gets recommendations', async () => {
    await advisorApi.recommendations();
    expect(mockApi.get).toHaveBeenCalledWith('/advisor/recommendations');
  });
});
