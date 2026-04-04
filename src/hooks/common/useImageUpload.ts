import { useMutation } from '@tanstack/react-query';
import { getPresignedUploadUrl, uploadToS3 } from '@/api/resources/images';

interface UploadArgs {
  file: File;
  filename: string;
  contentType: string;
}

export function useImageUpload() {
  return useMutation({
    mutationFn: async ({ file, filename, contentType }: UploadArgs) => {
      const { uploadUrl, publicUrl } = await getPresignedUploadUrl(filename, contentType);
      await uploadToS3(uploadUrl, file);
      return publicUrl;
    },
  });
}
