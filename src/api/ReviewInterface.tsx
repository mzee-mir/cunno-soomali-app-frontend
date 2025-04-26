import React, { useState } from 'react';
import { useCreateOrderReview, useGetOrderReviews } from '@/api/OrderApi';
import { Review } from '@/store/ReviewSlice';

interface ReviewInterfaceProps {
  restaurantId: string;
}

const ReviewInterface: React.FC<ReviewInterfaceProps> = ({ restaurantId }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const { mutate: createReview, isLoading: isSubmitting } = useCreateOrderReview(restaurantId);
  const { data: reviews, isLoading: isLoadingReviews } = useGetOrderReviews(restaurantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({ rating, comment });
    // Reset form after submission
    setRating(5);
    setComment('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Reviews</h2>
      
      {/* Review submission form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="rating" className="block mb-1">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>{value} stars</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="comment" className="block mb-1">Review:</label>
          <textarea
            id="comment"
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Display existing reviews */}
      {isLoadingReviews ? (
        <p>Loading reviews...</p>
      ) : (
        <ul className="space-y-4">
          {reviews?.map((review: Review) => (
            <li key={review._id} className="p-4 border rounded">
              <div className="flex items-center gap-2">
                <div className="font-bold">Rating:</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <div className="font-bold">Comment:</div>
                <p>{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewInterface;