import Router from '@/Router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/client/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
