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
