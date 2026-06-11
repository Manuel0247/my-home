'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { createReview } from '@/app/actions/reviews';

interface ReviewFormProps {
  propertyId: string;
}

export function ReviewForm({ propertyId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createReview({ property_id: propertyId, rating, comment });
      if (result.error) throw new Error(result.error);
      toast.success('Avis publié avec succès !');
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ['', 'Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Votre note</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200 fill-gray-100'
                }`}
              />
            </button>
          ))}
          {(hoverRating || rating) > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              {ratingLabels[hoverRating || rating]}
            </span>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</p>
        <Textarea
          placeholder="Partagez votre expérience dans ce logement…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          className="resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
      </div>

      <Button
        type="submit"
        disabled={submitting || rating === 0}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {submitting ? 'Publication…' : 'Publier mon avis'}
      </Button>
    </form>
  );
}
