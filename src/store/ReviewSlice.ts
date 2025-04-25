// store/ReviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  _id: string;
  name: string;
  avatar?: string;
}

interface Restaurant {
    _id: string;
    name: string;
  }

export interface Review {
  _id: string;
  user: UserInfo;
  restaurant: Restaurant;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewState {
  reviews: Review[];
  currentRestaurantReviews: Review[];
  currentOrderReviews: Review[]; // Add this line
  averageRating: number | null;
  loading: boolean;
  error: string | null;
}
  
  const initialState: ReviewState = {
    reviews: [],
    currentRestaurantReviews: [],
    currentOrderReviews: [],
    averageRating: null,
    loading: false,
    error: null,
  };

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    setCurrentRestaurantReviews: (state, action: PayloadAction<Review[]>) => {
      state.currentRestaurantReviews = action.payload;
      // Calculate average rating whenever reviews are set
      if (action.payload.length > 0) {
        const total = action.payload.reduce((sum, review) => sum + review.rating, 0);
        state.averageRating = parseFloat((total / action.payload.length).toFixed(1));
      } else {
        state.averageRating = null;
      }
    },
    setCurrentOrderReviews: (state, action: PayloadAction<Review[]>) => {
      state.currentOrderReviews = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.currentRestaurantReviews.unshift(action.payload);
      // Recalculate average rating
      if (state.currentRestaurantReviews.length > 0) {
        const total = state.currentRestaurantReviews.reduce(
          (sum, review) => sum + review.rating, 0
        );
        state.averageRating = parseFloat(
          (total / state.currentRestaurantReviews.length).toFixed(1)
        );
      }
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.currentRestaurantReviews.findIndex(
        (r) => r._id === action.payload._id
      );
      if (index !== -1) {
        state.currentRestaurantReviews[index] = action.payload;
        // Recalculate average rating
        const total = state.currentRestaurantReviews.reduce(
          (sum, review) => sum + review.rating, 0
        );
        state.averageRating = parseFloat(
          (total / state.currentRestaurantReviews.length).toFixed(1)
        );
      }
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.currentRestaurantReviews = state.currentRestaurantReviews.filter(
        (r) => r._id !== action.payload
      );
      // Recalculate average rating if there are reviews left
      if (state.currentRestaurantReviews.length > 0) {
        const total = state.currentRestaurantReviews.reduce(
          (sum, review) => sum + review.rating, 0
        );
        state.averageRating = parseFloat(
          (total / state.currentRestaurantReviews.length).toFixed(1)
        );
      } else {
        state.averageRating = null;
      }
    },
    setReviewLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setReviewError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearReviews: () => initialState,
  },
});

export const {
  setReviews,
  setCurrentRestaurantReviews,
  addReview,
  updateReview,
  deleteReview,
  setReviewLoading,
  setReviewError,
  clearReviews,
} = reviewSlice.actions;

export default reviewSlice.reducer;