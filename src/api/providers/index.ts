import type { FetchConnector, StorageConnector } from './types';
import { MockFetchConnector } from './mock/fetchConnector';
import { MockStorageConnector } from './mock/storageConnector';
import { RealFetchConnector } from './http/fetchConnector';
import { SupabaseStorageConnector } from './supabase/storageConnector';
import { authConnector } from '../auth';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const storageConnector: StorageConnector = USE_MOCK_AUTH
  ? new MockStorageConnector()
  : new SupabaseStorageConnector();

export const fetchConnector: FetchConnector = USE_MOCK_API
  ? new MockFetchConnector()
  : new RealFetchConnector(authConnector);
