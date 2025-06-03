import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Order } from "@/store/OrderSlice";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import { useTranslation } from 'react-i18next';

type Props = {
  order: Order;
};

const OrderInfo = ({ order }: Props) => {
  const getOrderDateInfo = () => {
    const date = new Date(order.createdAt);
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day}-${date.getMonth() + 1}-${year}`;
  };
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
          {order.restaurant.name}
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <div className="space-y-10 bg-blue-50 p-10 rounded-lg" key={order.createdAt}>
          <span className="text-2xl font-bold"> {t('orderInfo.orderDate')} : {getOrderDateInfo()}</span>
          <span>{ t('orderInfo.orderDate')}: {order.restaurant.name}</span>
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderInfo;