// components/OrderItemCard.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Order } from "@/store/OrderSlice";
import { Avatar } from "@mui/material";
import { format } from "date-fns";

type Props = {
  order: Order;
};

const OrderItemCard: React.FC<Props> = ({ order }) => {
  const getTime = () => {
    const orderDate = new Date(order.createdAt);
    return format(orderDate, "HH:mm - MMM d, yyyy");
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-foreground">
            <Avatar src={order.user.avatar} alt={order.user.name} sx={{ width: 40, height: 40 }} />
            <div>
              <div className="font-semibold text-foreground">{order.deliveryDetails?.name || "Customer"}</div>
              <div className="text-sm text-foreground">{order.deliveryDetails?.email}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{getTime()}</div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 flex justify-between items-center text-sm">
        <div>
          <div className="text-gray-300">
            <span className="font-medium text-foreground">Items:</span> {order.cartItems.length}
          </div>
          <div className="text-gray-300">
            <span className="font-medium text-foreground">Status:</span> {order.status}
          </div>
        </div>
        <div className="text-right text-gray-300">
          <div>
            <span className="font-medium text-foreground">Total:</span> ${(order.totalAmount / 100).toFixed(2)}
          </div>
          <div className="text-gray-300">
            <span className="font-medium text-foreground">ID:</span> {order._id.slice(-6)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;
