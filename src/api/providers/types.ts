export type { AuthConnector, SessionUser, LoginPayload } from '../auth/types';

export interface StorageConnector {
  uploadImage(file: File, filename: string, contentType: string): Promise<string>;
}

export interface FetchConnector {
  fetch<T>(path: string, options?: RequestInit): Promise<T>;
}
