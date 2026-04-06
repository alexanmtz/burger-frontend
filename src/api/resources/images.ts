import { storageConnector } from '@/api/providers';

export interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
}

export async function uploadImage(
  file: File,
  filename: string,
  contentType: string,
): Promise<string> {
  return storageConnector.uploadImage(file, filename, contentType);
}
