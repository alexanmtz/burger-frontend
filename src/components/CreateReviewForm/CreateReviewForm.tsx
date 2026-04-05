import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useRestaurants } from '@/hooks/restaurants/useRestaurants';
import { useSubmitReview } from '@/hooks/reviews/useSubmitReview';
import { useImageUpload } from '@/hooks/common/useImageUpload';
import { StarRating } from '@/components/StarRating/StarRating';
import type { Restaurant } from '@/types/types';
import styles from './CreateReviewForm.module.css';

interface FormState {
  restaurantId: string;
  burgerName: string;
  caption: string;
  taste: number;
  texture: number;
  presentation: number;
}

interface Props {
  restaurant?: Restaurant;
  onSuccess: () => void;
}

export function CreateReviewForm({ restaurant, onSuccess }: Props) {
  const { data: restaurants, isLoading: restaurantsLoading, error: restaurantsError } = useRestaurants();
  const submitReview = useSubmitReview();
  const imageUpload = useImageUpload();

  const [form, setForm] = useState<FormState>({
    restaurantId: restaurant?.id ?? '',
    burgerName: '',
    caption: '',
    taste: 7,
    texture: 7,
    presentation: 7,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload an image file.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setValidationError(null);
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

  const overallScore = +((form.taste + form.texture + form.presentation) / 3).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.restaurantId && !restaurant?.id) { setValidationError('Please select a restaurant.'); return; }
    if (!form.burgerName.trim()) { setValidationError('Please enter the burger name.'); return; }
    if (!form.caption.trim()) { setValidationError('Please write a caption.'); return; }

    setValidationError(null);

    let imageUrl = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80';

    if (imageFile) {
      const publicUrl = await imageUpload.mutateAsync({
        file: imageFile,
        filename: imageFile.name,
        contentType: imageFile.type,
      });
      imageUrl = publicUrl;
    }
    if(!validationError && !imageUpload.error && !submitReview.error && (form.restaurantId || restaurant?.id)) {
      await submitReview.mutateAsync({
        restaurantId: form.restaurantId || restaurant?.id || '',
        burgerName: form.burgerName,
        caption: form.caption,
        imageUrl,
        scores: {
          taste: form.taste,
          texture: form.texture,
          presentation: form.presentation,
        },
      });

      onSuccess();
    }
  };

  const submitting = imageUpload.isPending || submitReview.isPending;
  const mutationError = imageUpload.error?.message ?? submitReview.error?.message ?? null;
  const error = validationError ?? mutationError;

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {!restaurant && (
        <div className="form-group">
          <label className="form-label" htmlFor="restaurant">Restaurant</label>
          <select
            id="restaurant"
            className="form-select"
            value={form.restaurantId}
            onChange={e => set('restaurantId', e.target.value)}
            disabled={restaurantsLoading}
            required
          >
            <option value="">
              {restaurantsLoading ? 'Loading restaurants…' : 'Select a restaurant…'}
            </option>
            {restaurants?.map(r => (
              <option key={r.id} value={r.id}>{r.name} — {r.city}</option>
            ))}
          </select>
          {restaurantsError && (
            <p className={styles.error}>Failed to load restaurants: {restaurantsError.message}</p>
          )}
        </div>
      )}
      <div className="form-group">
        <label className="form-label" htmlFor="burgerName">Burger name</label>
        <input
          id="burgerName"
          type="text"
          className="form-input"
          placeholder="e.g. The Classic Smash"
          value={form.burgerName}
          onChange={e => set('burgerName', e.target.value)}
          maxLength={80}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="caption">Your review</label>
        <textarea
          id="caption"
          className="form-textarea"
          placeholder="Describe the burger — taste, texture, what made it special…"
          value={form.caption}
          onChange={e => set('caption', e.target.value)}
          rows={4}
          maxLength={500}
          required
        />
        <p className="text-xs text-muted" style={{ alignSelf: 'flex-end' }}>
          {form.caption.length}/500
        </p>
      </div>

      <div className={styles.scoresBlock}>
        <h3 className={styles.scoresTitle}>Score it</h3>
        <div className={styles.scoresGrid}>
          {([ ['taste', 'Taste'], ['texture', 'Texture'], ['presentation', 'Presentation']] as const).map(
            ([key, label]) => (
              <div key={key} className={styles.scoreRow}>
                <label className="form-label">{label}</label>
                <StarRating
                  value={form[key]}
                  onChange={v => set(key, v)}
                  size="lg"
                />
              </div>
            )
          )}
        </div>
        <div className={styles.overallRow}>
          <span className="text-muted text-sm">Overall score</span>
          <div className="score-circle large">{overallScore}</div>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Photo</label>
        <div
          className={`${styles.dropzone} ${dragging ? styles.dropzoneDragging : ''} ${imagePreview ? styles.dropzoneHasImage : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
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
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button
        type="submit"
        className={`btn btn-primary ${styles.submitBtn}`}
        disabled={submitting}
      >
        {submitting ? 'Submitting…' : 'Publish review'}
      </button>
    </form>
  );
}
