import { useGetMyOrders } from "@/api/OrderApi";
import { OrderHistoryTable } from "@/components/OrderHistoryTable";


const OrderStatusPage = () => {
  const { orders, isLoading: isOrderLoading } = useGetMyOrders();

  const handleRemoveOrder = (orderId: string) => {
    // Your remove order logic here
    console.log("Removing order:", orderId);
  };

  if (isOrderLoading) {
    return <p>Loading...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>No orders found</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <OrderHistoryTable orders={orders} handleRemoveOrder={handleRemoveOrder}/>  {/* Pass all orders at once */}
    </div>
  );
};

export default OrderStatusPage;