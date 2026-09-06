import storage from '../utils/storage';
import { useAuthStore, authAccessor } from './auth';

jest.mock('../utils/storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn().mockResolvedValue(undefined), removeItem: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('../utils/logger', () => ({ authLog: { info: jest.fn() } }));

const mockStorage = storage as unknown as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

const result = {
  accessToken: 'acc',
  refreshToken: 'ref',
  user: { _id: 'u1', email: 'a@b.com', preferences: {} as any },
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null, hydrated: false });
});

describe('auth store', () => {
  it('hydrate loads persisted session', async () => {
    mockStorage.getItem.mockImplementation((key: string) =>
      Promise.resolve(
        {
          'echo.accessToken': 'acc',
          'echo.refreshToken': 'ref',
          'echo.user': JSON.stringify({ _id: 'u1' }),
        }[key] ?? null,
      ),
    );
    await useAuthStore.getState().hydrate();
    const s = useAuthStore.getState();
    expect(s.accessToken).toBe('acc');
    expect(s.user).toEqual({ _id: 'u1' });
    expect(s.hydrated).toBe(true);
  });

  it('hydrate tolerates corrupt user JSON', async () => {
    mockStorage.getItem.mockImplementation((key: string) =>
      Promise.resolve(key === 'echo.user' ? '{not json' : 'x'),
    );
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('hydrate handles a missing user', async () => {
    mockStorage.getItem.mockResolvedValue(null);
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('setSession stores tokens and user', async () => {
    await useAuthStore.getState().setSession(result as any);
    expect(useAuthStore.getState().accessToken).toBe('acc');
    expect(mockStorage.setItem).toHaveBeenCalledTimes(3);
  });

  it('setSession identifies users by phone or id when email is absent', async () => {
    await useAuthStore.getState().setSession({ ...result, user: { _id: 'u2', phone: '+91' } } as any);
    expect(useAuthStore.getState().user).toEqual({ _id: 'u2', phone: '+91' });
    await useAuthStore.getState().setSession({ ...result, user: { _id: 'u3' } } as any);
    expect(useAuthStore.getState().user).toEqual({ _id: 'u3' });
  });

  it('setTokens updates and persists tokens', async () => {
    await useAuthStore.getState().setTokens('a2', 'r2');
    expect(useAuthStore.getState().refreshToken).toBe('r2');
    expect(mockStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('setUser updates and persists the user', async () => {
    await useAuthStore.getState().setUser({ _id: 'u2' } as any);
    expect(useAuthStore.getState().user).toEqual({ _id: 'u2' });
    expect(mockStorage.setItem).toHaveBeenCalledWith('echo.user', JSON.stringify({ _id: 'u2' }));
  });

  it('logout clears session and storage', async () => {
    useAuthStore.setState({ accessToken: 'x', refreshToken: 'y', user: { _id: 'u1' } as any });
    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(mockStorage.removeItem).toHaveBeenCalledTimes(3);
  });
});

describe('authAccessor', () => {
  it('reads tokens and delegates token/logout mutations', async () => {
    await useAuthStore.getState().setTokens('a', 'r');
    expect(authAccessor.getAccessToken()).toBe('a');
    expect(authAccessor.getRefreshToken()).toBe('r');
    await authAccessor.setTokens('a3', 'r3');
    expect(useAuthStore.getState().accessToken).toBe('a3');
    await authAccessor.logout();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
