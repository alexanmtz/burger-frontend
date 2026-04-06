import { authConnector } from '@/api/auth';
import { HttpFetchConnector } from './http/fetchConnector';
import { MockFetchConnector } from './mock/fetchConnector';
import { MockStorageConnector } from './mock/storageConnector';
import { SupabaseStorageConnector } from './supabase/storageConnector';
import type { FetchConnector, StorageConnector } from './types';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const storageConnector: StorageConnector = USE_MOCK_AUTH
  ? new MockStorageConnector()
  : new SupabaseStorageConnector();

export const fetchConnector: FetchConnector = USE_MOCK_API
  ? new MockFetchConnector()
  : new HttpFetchConnector(authConnector);
