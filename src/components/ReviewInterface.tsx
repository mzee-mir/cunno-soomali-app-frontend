import React, { useState, useEffect } from 'react';
import { useCreateOrderReview, useGetOrderReviews } from '@/api/OrderApi';
import StarRating from './StarRating';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useQueryClient } from 'react-query';

interface ReviewInterfaceProps {
  orderId: string;
  onReviewComplete?: () => void;
}

const ReviewInterface: React.FC<ReviewInterfaceProps> = ({ orderId, onReviewComplete }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Properly typed hooks
  const { mutateAsync: createReview, isLoading: isSubmitting } = useCreateOrderReview(orderId);
  const { data: reviews = [], isLoading: isLoadingReviews } = useGetOrderReviews(orderId);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setShowForm(false);
    }
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ rating, comment });
      setShowForm(false);
      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries(['fetchOrderReviews', orderId]);
      if (onReviewComplete) {
        onReviewComplete();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <div>
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-center text-xl font-bold">Leave a Review</h4>
          <div className='grid grid-1 justify-items-center'>
            <StarRating rating={rating} onRatingChange={setRating} /> 
          </div>
          <div className='flex flex-row gap-5'>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='How was your order experience?'
              className="bg-white mt-1 block border border-gray-300 rounded-md shadow-md"
            />
            <Button
              type="submit"
              className="bg-blue-500 mt-1.5 shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-center text-lg font-medium text-green-600">Thank you for your feedback!</p>
      )}

      {isLoadingReviews ? (
        <p>Loading reviews...</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border p-4 rounded-lg shadow my-2">
              <div className='flex flex-row gap-4'>
                <h4 className="font-semibold">{review.user.name}</h4>
                <p>{'⭐'.repeat(review.rating)}</p>
              </div>
              <div>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewInterface;