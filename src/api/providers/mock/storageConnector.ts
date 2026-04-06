import type { StorageConnector } from '@/api/providers/types';

const STUB_IMAGE_URL = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80';

export class MockStorageConnector implements StorageConnector {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async uploadImage(_file: File, _filename: string, _contentType: string): Promise<string> {
    return STUB_IMAGE_URL;
  }
}
