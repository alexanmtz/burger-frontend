import styles from './ImageUpload.module.css';

import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
  onError: (msg: string) => void;
}

export function ImageUpload({ onFileSelect, onError }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file.');
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`${styles.dropzone} ${dragging ? styles.dropzoneDragging : ''} ${imagePreview ? styles.dropzoneHasImage : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => fileRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
      aria-label="Upload burger photo"
    >
      {imagePreview ? (
        <>
          <img src={imagePreview} alt="Preview" className={styles.preview} />
          <div className={styles.previewOverlay}>
            <span>Change photo</span>
          </div>
        </>
      ) : (
        <div className={styles.dropzonePrompt}>
          <span className={styles.dropzoneIcon}>📷</span>
          <p>Drag & drop or click to upload</p>
          <p className="text-xs text-muted">JPG, PNG, WebP — max 10 MB</p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={onFileChange}
        aria-label="Upload image"
      />
    </div>
  );
}
