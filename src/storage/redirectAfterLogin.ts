const KEY = 'redirectAfterLogin';

export const redirectAfterLogin = {
  set(path: string) {
    if (path && path !== '/') {
      sessionStorage.setItem(KEY, path);
    }
  },

  get(): string {
    return sessionStorage.getItem(KEY) ?? '/dashboard';
  },

  clear() {
    sessionStorage.removeItem(KEY);
  },
};
