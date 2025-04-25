import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";

type Props = {
    order: Order;
}

const OrderStatusHeader= ({order}:Props) => {

    const getExpectedDelivery = () => {
        const created = new Date(order.createdAt);
        
        created.setMinutes(
            created.getMinutes() + order.restaurant.estimatedDeliveryTime
        );

        const hours = created.getHours();
        const minutes = created.getMinutes();

        const paddedMinutes = minutes< 10? `0${minutes}` : minutes;

        return`${hours}:${paddedMinutes}`;
    };

    const getOrderStatusInfo = () => {
        return ORDER_STATUS.find((o)=> o.value === order.status) || ORDER_STATUS[0]
    }
    const getOrderDateInfo = ()=> {
        const date = new Date(order.createdAt);
        date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();
        return `${day}-${date.getMonth() + 1}-${year}`;
    }
    
    
    

  return (
    <>
    <h1 className="lg:text-4xl font-bold tracking-tighter flex flex-col ap-5 md:flex-row md:justify-between md:text-2xl sm:text-xl sm:flex-row sm:justify-between" >
        <span>order status: {getOrderStatusInfo().label}</span>
        <span>Expected by: {getExpectedDelivery()}</span>
        <span className="lg-text-2xl font-bold md:text-2xl sm:text-xl ">Order Date: {getOrderDateInfo()}</span>
    </h1>
    <Progress className= "animate-pulse" value={getOrderStatusInfo().progressValue}/>
    </>
  )
}

export default OrderStatusHeader