import React, { useState } from 'react';
import { useCreateReview, useGetRestaurantReviews } from '@/api/OrderApi';
import { Reviews } from '@/types';


interface ReviewInterfaceProps {
  restaurantId: string;
}

const ReviewInterface: React.FC<ReviewInterfaceProps> = ({ restaurantId }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const { createReview, isLoading: isSubmitting } = useCreateReview(restaurantId);
  const { data: reviews, isLoading: isLoadingReviews } = useGetRestaurantReviews(restaurantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({ rating, comment });
    // Reset form after submission
    setRating(5);
    setComment('');
  };

  return (
    <div>
      <h2>Reviews</h2>
      
      {/* Review submission form */}
      <form onSubmit={handleSubmit}>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value} stars</option>
          ))}
        </select>
        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Display existing reviews */}
      {isLoadingReviews ? (
        <p>Loading reviews...</p>
      ) : (
        <ul>
          {reviews?.map((review: Reviews) => (
            <li key={review.id}>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewInterface;