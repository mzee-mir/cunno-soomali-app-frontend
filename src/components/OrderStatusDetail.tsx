import { Order } from "@/store/OrderSlice";
import { Separator } from "@radix-ui/react-separator";

type Props = {
    order:Order;
}

const OrderStatusDetail = ({order}:Props) => {
    
  return <div className="space-y-5">
    <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails?.name}</span>
        <span>{order.deliveryDetails?.address}</span>
    </div>
    <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
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
        <span className="font-bold">Total</span>
        <span>${(order.totalAmount/ 100).toFixed(2)}</span>
        
    </div>
  </div>
  
}



export default OrderStatusDetail;