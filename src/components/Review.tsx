// components/RestaurantReviews.tsx
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
  setCurrentRestaurantReviews, 
  addReview, 
  setReviewLoading, 
  setReviewError, 
  Review
} from '@/store/ReviewSlice';
import { useCreateOrderReview, useGetOrderReviews } from '@/api/OrderApi';
import { Star, StarHalf, StarOutline } from '@mui/icons-material';
import { Button, TextField, CircularProgress, Alert, Avatar, Box, Typography } from '@mui/material';
import { Axios } from 'axios';

interface ReviewFormProps {
  restaurantId: string;
  onReviewSubmit: () => void;
}

const ReviewForm = ({ restaurantId, onReviewSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const { mutateAsync: createReview, isLoading } = useCreateOrderReview(restaurantId);

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      dispatch(setReviewError('Please select a rating'));
      return;
    }

    try {
      const newReview = await createReview({ rating, comment });
      dispatch(addReview(newReview));
      onReviewSubmit();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add Your Review
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const currentRating = hoverRating || rating;
          return (
            <Box 
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              sx={{ cursor: 'pointer' }}
            >
              {currentRating >= star ? (
                <Star color="primary" />
              ) : currentRating >= star - 0.5 ? (
                <StarHalf color="primary" />
              ) : (
                <StarOutline color="primary" />
              )}
            </Box>
          );
        })}
      </Box>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Your Review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        Submit Review
      </Button>
    </Box>
  );
};

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar src={review.user.avatar} alt={review.user.name} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {review.user.name}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                color={i < review.rating ? 'primary' : 'disabled'} 
                fontSize="small" 
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {new Date(review.createdAt).toLocaleDateString()}
      </Typography>
      <Typography variant="body1">{review.comment}</Typography>
    </Box>
  );
};

const RestaurantReviews = ({ restaurantId }: { restaurantId: string }) => {
  const dispatch = useAppDispatch();
  const { reviews, averageRating, loading, error } = useAppSelector(
    (state) => state.review
  );
  const { data: apiReviews, isLoading, error: apiError } = useGetOrderReviews(restaurantId);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (apiReviews) {
      dispatch(setCurrentRestaurantReviews(apiReviews));
    }
  }, [apiReviews, dispatch]);

  useEffect(() => {
    if (apiError && typeof apiError === 'object' && 'message' in apiError) {
      dispatch(setReviewError((apiError as any).message));
    }
  }, [apiError, dispatch]);

  const handleReviewSubmit = () => {
    setShowForm(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
      
      {averageRating !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ mr: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                color={i < Math.floor(averageRating) ? 'primary' : 'disabled'} 
              />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviews.length} reviews)
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!showForm && (
        <Button 
          variant="outlined" 
          onClick={() => setShowForm(true)}
          sx={{ mb: 3 }}
        >
          Write a Review
        </Button>
      )}
      
      {showForm && (
        <ReviewForm 
          restaurantId={restaurantId} 
          onReviewSubmit={handleReviewSubmit} 
        />
      )}
      
      {loading || isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No reviews yet. Be the first to review!
        </Typography>
      ) : (
        <Box>
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RestaurantReviews;