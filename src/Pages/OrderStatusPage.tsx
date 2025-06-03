import { useGetMyOrders } from "@/api/OrderApi";
import { OrderHistoryTable } from "@/components/OrderHistoryTable";
import { MobileOrderHistoryTable } from "@/components/mobileOrderHistoryTable";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useTranslation } from "react-i18next";

const OrderStatusPage = () => {
  const { t } = useTranslation();
  const { orders, isLoading: isOrderLoading } = useGetMyOrders();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleRemoveOrder = (orderId: string) => {
    console.log("Removing order:", orderId);
  };

  if (isOrderLoading) {
    return <p>{t("loading")}</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>{t("orderStatus.noOrders")}</p>;
  }

  return (
    <div className="container mx-auto py-4 md:py-10">
      {isMobile ? (
        <MobileOrderHistoryTable 
          orders={orders} 
          handleRemoveOrder={handleRemoveOrder} 
        />
      ) : (
        <OrderHistoryTable 
          orders={orders} 
          handleRemoveOrder={handleRemoveOrder} 
        />
      )}
    </div>
  );
};

export default OrderStatusPage;