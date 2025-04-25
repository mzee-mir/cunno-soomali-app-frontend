import { useCreateReview, useGetOrderReviews, useGetMyOrders } from "@/api/OrderApi";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import ReviewInterface from '@/components/ReviewInterface';
import OrderInfo from "@/components/OrderInfo";
import { ORDER_STATUS } from "@/config/order-status-config"; // Import ORDER_STATUS
import { useState } from "react"; // Import useState
import { Trash } from "lucide-react";

const OrderStatusPage = () => {
  const { orders: initialOrders, isLoading: isOrderLoading } = useGetMyOrders();
  const [orders, setOrders] = useState(initialOrders); // Manage orders state

  const handleRemoveOrder = (orderId: string) => {
    setOrders((prevOrders =[]) => prevOrders.filter(order => order._id !== orderId)); // Remove order from state
  };

  if (isOrderLoading) {
    return <p>Loading...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>No orders found</p>;
  }

  return (
    <div className="space-y-10">
      {orders.map((order) => {
        const orderStatus = ORDER_STATUS.find((status) => status.value === order.status); // Get the order status

        return (
          <div className="space-y-4 bg-gray-50 p-10 rounded-lg" key={order.createdAt}>
            <OrderStatusHeader order={order} />
            <div className="grid grid-1 justify-center">
              <OrderInfo order={order} />
            </div>
            {/* Conditionally render ReviewInterface based on order status */}
            {(orderStatus?.value === "delivered") && (
              <ReviewInterface orderId={order._id} onReviewComplete={() => handleRemoveOrder(order._id)} />
            )}
            {/* Button to remove the order from the frontend view */}
            <Trash 
            className="cursor-pointer text-blue-600 hover:text-red-600 active:text-[#b91c1c] transition-colors duration-200" 
            size={20} 
            onClick={() => handleRemoveOrder(order._id)}/>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusPage;