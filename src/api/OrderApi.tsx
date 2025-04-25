import { useQuery, useQueryClient } from 'react-query';
import Axios from '@/lib/Axios';
import SummaryApi from '@/api/Userauth';
import { useAppDispatch } from '@/store/store';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import type { ICartMenuItem } from '@/store/cartMenuItem';
import ApiEndpoints from '@/api/Userauth';
import { setOrderLoading, setOrderError, setOrders } from '@/store/OrderSlice';
import { addReview, setCurrentRestaurantReviews  } from '@/store/ReviewSlice';


interface IOrder {
  // Define order structure based on your backend response
  _id: string;
  items: Array<{ menuItemId: string; quantity: number }>;
  total: number;
  status: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Review {
  _id: string;
  user: UserInfo;
  restaurant: {
    _id: string;
    name: string;
  };
  order: {
    _id: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export const useGetMyOrders = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useQuery<IOrder[]>(
    'fetchMyOrders',
    async () => {
      dispatch(setOrderLoading(true));
      try {
        const response = await Axios(SummaryApi.order.getOrder);
        
        // Remove success check - directly use the response data
        dispatch(setOrders(response.data));  // Changed from response.data.data
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
        dispatch(setOrderError(errorMessage));
        throw new Error(errorMessage);
      } finally {
        dispatch(setOrderLoading(false));
      }
    },
    { refetchInterval: 5000 }
  );

  return { orders: data || [], isLoading, error };
};

interface CheckoutSessionRequest {
  cartItems: ICartMenuItem[];
  deliveryDetails: {
    addressId: string;
    instructions?: string;
  };
  restaurantId: string;
}

export const useCreateCheckoutSession = () => {
  const mutation = useMutation(
    (checkoutData: CheckoutSessionRequest) =>
      Axios({
        ...SummaryApi.order.createOrder,
        data: checkoutData,
      }),
    {
      onSuccess: (response) => {
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
        window.location.href = response.data.sessionUrl; // Redirect to Stripe
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Checkout failed';
        toast.error(errorMessage);
        mutation.reset();
      },
    }
  );

  return {
    createCheckoutSession: mutation.mutateAsync,
    isLoading: mutation.isLoading,
  };
};

// Update the useCreateOrderReview hook
export const useCreateOrderReview = (orderId: string) => {
  const dispatch = useAppDispatch();

  const createReviewRequest = async (reviewData: { 
    rating: number; 
    comment: string 
  }): Promise<Review> => {
    const response = await Axios({
      ...ApiEndpoints.order.createReview,
      url: ApiEndpoints.order.createReview.url.replace(":orderId", orderId),
      data: reviewData,
    });
    return response.data;
  };

  return useMutation(createReviewRequest, {
    onSuccess: (data) => {
      dispatch(addReview(data));
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    }
  });
};

// Update the useGetOrderReviews hook
export const useGetOrderReviews = (orderId: string) => {
  const dispatch = useAppDispatch();

  const getOrderReviewsRequest = async (): Promise<Review[]> => {
    const response = await Axios({
      ...ApiEndpoints.order.getOrderReviews,
      url: ApiEndpoints.order.getOrderReviews.url.replace(":orderId", orderId),
    });
    return response.data.reviews || [];
  };

  return useQuery(
    ["fetchOrderReviews", orderId],
    getOrderReviewsRequest,
    {
      enabled: !!orderId,
      onSuccess: (data) => {
        dispatch(setCurrentRestaurantReviews(data));
      },
      onError: (error) => {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews. Please try again later.");
      },
    }
  );
};