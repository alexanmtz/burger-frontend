import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { StarRating } from '@/components/score/StarRating/StarRating';

describe('StarRating', () => {
  it('renders correct number of stars', () => {
    render(<StarRating value={3} />);
    const stars = screen.getAllByTestId('star-rating')[0].querySelectorAll('button');
    expect(stars).toHaveLength(5);
    const startText = screen.getByLabelText('Rating: 3 out of 10');
    expect(startText).toBeInTheDocument();
  });

  it('calls onChange with correct value when star is clicked', async () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    const stars = screen.getAllByTestId('star-rating')[0].querySelectorAll('button');
    fireEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('is read-only when onChange is not provided', () => {
    render(<StarRating value={3} />);
    const stars = screen.getAllByTestId('star-rating')[0].querySelectorAll('button');
    stars.forEach((star) => {
      expect(star).not.toHaveAttribute('role', 'button');
    });
  });
});
