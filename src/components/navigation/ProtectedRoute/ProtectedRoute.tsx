import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/auth/useAuth';
import { redirectAfterLogin } from '@/storage/redirectAfterLogin';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    redirectAfterLogin.set(location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
