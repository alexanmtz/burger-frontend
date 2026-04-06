import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import type { User } from '@/types/types';

import { ProtectedRoute } from '@/components/navigation/ProtectedRoute/ProtectedRoute';
import { AuthContext } from '@/context/auth';

type ValueProps = {
  user: User | null;
  loading: boolean;
  token: string | null;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const renderWithAuth = (user: User | null) =>
  render(
    <AuthContext.Provider
      value={
        {
          user,
          loading: false,
          token: null,
          signIn: async () => {},
          signOut: async () => {},
        } as ValueProps
      }
    >
      <MemoryRouter initialEntries={['/submit']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    renderWithAuth({ id: '1', email: 'test@test.com' } as User);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithAuth(null);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
