import { Order } from "@/store/OrderSlice";
import { Separator } from "@radix-ui/react-separator";
import { useTranslation } from 'react-i18next';

type Props = {
    order:Order;
}

const OrderStatusDetail = ({order}:Props) => {
    const { t } = useTranslation();
    
  return <div className="space-y-5">
    <div className="flex flex-col">
        <span className="font-bold">{t('orderStatusDetail.deliveringTo')}:</span>
        <span>{order.deliveryDetails?.name}</span>
        <span>{order.deliveryDetails?.address}</span>
    </div>
    <div className="flex flex-col">
        <span className="font-bold">{t('orderStatusDetail.yourOrder')}</span>
        <ul>
            {order.cartItems.map((item)=> (
                <li key={item.menuItemId || `${item.name}-${item.quantity}`}>
                {item.name} x {item.quantity}
            </li>
            ))}
        </ul>
    </div>
    <Separator/>
    <div className="flex fle-col">
        <span className="font-bold">{t('orderStatusDetail.total')}</span>
        <span>${(order.totalAmount/ 100).toFixed(2)}</span>
        
    </div>
  </div>
  
}



export default OrderStatusDetail;