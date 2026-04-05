import { useMutation } from '@tanstack/react-query';

import { uploadImage } from '@/api/resources/images';

interface UploadArgs {
  file: File;
  filename: string;
  contentType: string;
}

export function useImageUpload() {
  return useMutation({
    mutationFn: ({ file, filename, contentType }: UploadArgs) =>
      uploadImage(file, filename, contentType),
  });
}
