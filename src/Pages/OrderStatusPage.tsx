import { useGetMyOrders } from "@/api/OrderApi";
import { OrderHistoryTable } from "@/components/OrderHistoryTable";
import { MobileOrderHistoryTable } from "@/components/mobileOrderHistoryTable";
import { useMediaQuery } from "@/utils/useMediaQuery";


const OrderStatusPage = () => {
  const { orders, isLoading: isOrderLoading } = useGetMyOrders();

  const isMobile = useMediaQuery("(max-width: 768px)");

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
    <div className="container mx-auto py-4 md:py-10">
      {isMobile ? (
        <MobileOrderHistoryTable orders={orders} handleRemoveOrder={handleRemoveOrder} />
      ) : (
        <OrderHistoryTable orders={orders} handleRemoveOrder={handleRemoveOrder} />
      )}
    </div>
  );
};

export default OrderStatusPage;