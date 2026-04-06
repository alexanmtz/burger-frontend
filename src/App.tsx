import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Router from '@/Router';

import { queryClient } from './api/client/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
