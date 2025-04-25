import { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useEffect, useState } from "react";
import { useUpdateMyRestaurantOrder } from "@/api/MyRestaurantApi";
import { Avatar, Chip } from "@mui/material";
import OrderItemCardInfo from "./orderItemCardInfo";
type Props = {
    order: Order;
}

const OrderItemCard = ({order}: Props)=> {

    const { updateRestaurantStatus, isLoading } = useUpdateMyRestaurantOrder();
    const [status, setStatus] = useState<OrderStatus>(order.status);

    useEffect(() => {
        setStatus(order.status);
    }, [order.status]);

    const getOrderDateInfo = ()=> {
        const date = new Date(order.createdAt);
        date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();
        return `${day}-${date.getMonth() + 1}-${year}`;
    }

    const handleStatusChange = async (newStatus: OrderStatus) => {
        await updateRestaurantStatus({
          orderId: order._id as string,
          status: newStatus,
        });
        setStatus(newStatus);
      };
    

    const getTime = () => {
        const orderDateTime = new Date(order.createdAt);

        const hours = orderDateTime.getHours();

        const minutes = orderDateTime.getMinutes();

        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${paddedMinutes}`;
    }
    return(
        <div >
        <div className="w-full">
            <Card className=" w-full ml-3 mb-4">
            <CardHeader className="pb-4">
                
            <CardTitle className="flex flex-col-2 gap-6">
                <div className="flex flex-row gap-6">
                    <h1 className="">Order Date: {getOrderDateInfo()}</h1>
                    <h1 className="flex-1"></h1>
                    <h1 className="text-right">Order Time: {getTime()}</h1>
                </div>
                
                
            </CardTitle>
            
            </CardHeader>

            <CardContent className="flex flex-col-3 gap-3 pb-3">
                <Avatar 
                src={order.user?.email}
                sx={{ width: 52, height: 52 }}
                />
                <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold">Customer: {order.user.name}</h1>
                <h1 className="text-sm text-gray-600">Items: {order.cartItems.length}</h1>
                </div>
                
                <div className="flex-1"></div>

                <div className="justify-items-end">
                    <Chip label={order.status} />
                </div>
                        
            </CardContent>

            
            <CardFooter className="pb-4">
                <h1 className="pl-12 text-lg font-bold">Total: {(order.totalAmount/100).toFixed(2)}</h1>
            </CardFooter>
            </Card>
        </div>
            
            <Separator/>
        
        </div>
        
    )
}

export default OrderItemCard;