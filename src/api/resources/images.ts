import { supabase } from '@/api/auth/supabase';

const BUCKET = 'burger-images';

export interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string
): Promise<PresignResponse> {
  void filename;
  void contentType;

  return {
    uploadUrl: 'https://mock-s3.example.com/upload',
    publicUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  };
}

export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  void uploadUrl;
  void file;
}

export async function uploadImage(file: File, filename: string, contentType: string): Promise<string> {
  if (import.meta.env.VITE_USE_SUPABASE === 'true') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to upload images');
    const path = `${user.id}/${Date.now()}-${filename}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
  const { publicUrl } = await getPresignedUploadUrl(filename, contentType);
  return publicUrl;
}
