import type { StorageConnector } from '@/api/providers/types';
import { supabase } from './client';

const BUCKET = 'burger-images';

export class SupabaseStorageConnector implements StorageConnector {
  async uploadImage(file: File, filename: string, contentType: string): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to upload images');

    const path = `${user.id}/${Date.now()}-${filename}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType });
    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
}
