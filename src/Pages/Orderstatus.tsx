import { useCreateReview, useGetOrderReviews } from "@/api/OrderApi";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import ReviewList from "@/components/reviewList";
import ReviewForm from "@/components/ReviewRestaurant";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Order } from "@/types";
import OrderHistoryTable  from "@/components/OrderHistoryTable";

const OrderItem = ({ order }: { order: Order }) => {
  const { createReview, isLoading: isReviewSubmitting } = useCreateReview(order.restaurant._id);
  const { reviews, isLoading: isReviewLoading } = useGetOrderReviews(order.restaurant._id);

  const handleReviewSubmit = async (review: { rating: number; comment: string }) => {
    try {
      await createReview(review);
      // Optionally, you can add some feedback here, like showing a success message
    } catch (error) {
      console.error("Error submitting review:", error);
      // Optionally, you can add some error handling here, like showing an error message
    }
  };

  return (
    <div className="space-y-10 bg-blue-50 p-10 rounded-lg">
      <OrderStatusHeader order={order} />
      <div className="grid gab-10 md:grid-cols-2">
        <OrderStatusDetail order={order} />
        <AspectRatio ratio={16 / 6}>
          <img
            src={order.restaurant.imageUrl}
            className="rounded-md object-cover h-full w-full"
            alt={order.restaurant.restaurantName}
          />
        </AspectRatio>
      </div>
      

      <OrderHistoryTable orders={[order]} />  {/* Add this line */}

      {isReviewLoading ? (
        <p>Loading reviews...</p>
      ) : (
        <ReviewList reviews={reviews || []} />
      )}

      <ReviewForm onSubmit={handleReviewSubmit} />
      {isReviewSubmitting && <p>Submitting your review...</p>}
    </div>
  );
};

export default OrderItem;