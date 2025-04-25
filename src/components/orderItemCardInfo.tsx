import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar } from "@mui/material";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from "date-fns";
import { useAppDispatch } from "@/store/store";
import { Order, Orders, OrderStatus } from "@/store/OrderSlice";
import { OrderService } from "@/lib/orderService";
import { ORDER_STATUS } from "@/config/order-status-config";

type Props = {
  order: Order;
};

const OrderItemCardInfo: React.FC<Props> = ({ order }) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setIsUpdating(true);
      await OrderService.updateRestaurantOrderStatus(dispatch, order._id, newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update order status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  

  

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              src={order.user.avatar}
              alt={order.user.name}
              sx={{ width: 56, height: 56 }}
            >
              {order.user.name.charAt(0)}
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{order.user.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {format(new Date(order.createdAt), "MMM dd, yyyy h:mm a")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="order-status">Status:</Label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="font-medium">Order Items</h3>
          <div className="space-y-6">
            {order.cartItems.map((item) => {
              return (
                <div key={item.menuItemId} className="flex items-start gap-4">
                  <div className="w-20">
                    <AspectRatio ratio={1}>
                      <img
                        src={item.imageUrl|| "/placeholder-food.jpg"}
                        alt={item.name}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      ${(item.price / 100).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-medium">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      

      <CardFooter className="border-t p-6 flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Delivery to:</p>
          <p className="font-medium">{order.deliveryDetails?.name}</p>
          <p className="font-medium">{order.deliveryDetails?.mobile}</p>
          <p className="font-medium">{order.deliveryDetails?.address}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">
            ${(order.totalAmount / 100).toFixed(2)}
          </p>
        </div>
      </CardFooter>
    </Card>
    
  );
};

export default OrderItemCardInfo;
