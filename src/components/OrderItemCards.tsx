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
          <div className="flex items-center gap-3">
            <Avatar src={order.user.avatar} alt={order.user.name} sx={{ width: 40, height: 40 }} />
            <div>
              <div className="font-semibold">{order.deliveryDetails?.name || "Customer"}</div>
              <div className="text-sm text-muted-foreground">{order.deliveryDetails?.email}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{getTime()}</div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 flex justify-between items-center text-sm">
        <div>
          <div>
            <span className="font-medium">Items:</span> {order.cartItems.length}
          </div>
          <div>
            <span className="font-medium">Status:</span> {order.status}
          </div>
        </div>
        <div className="text-right">
          <div>
            <span className="font-medium">Total:</span> ${(order.totalAmount / 100).toFixed(2)}
          </div>
          <div>
            <span className="font-medium">ID:</span> {order._id.slice(-6)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;
