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
import { Order, OrderStatus } from "@/store/OrderSlice";
import { OrderService } from "@/lib/orderService";
import { ORDER_STATUS } from "@/config/order-status-config";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from 'react-i18next';

type Props = {
  order: Order;
};

const MobileOrderItemCardInfo: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Card className="w-full mx-auto shadow-sm">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={order.user.avatar}
              alt={order.user.name}
              sx={{ width: 40, height: 40 }}
            >
              {order.user.name.charAt(0)}
            </Avatar>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">{order.user.name}</CardTitle>
              <p className="text-xs text-gray-500">
                {format(new Date(order.createdAt), "MMM dd, h:mm a")}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDetails}
            className="p-1"
          >
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </CardHeader>

      {showDetails && (
        <>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="order-status" className="text-sm text-foreground">
                  {t('orderItemCardInfo.status')}
                </Label>
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[150px] bg-input/40 text-foreground">
                    <SelectValue placeholder={t('orderItemCardInfo.selectStatusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-input/100">
                    {ORDER_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2 text-foreground">
                  {t('orderItemCardInfo.orderItems')}
                </h3>
                <div className="space-y-3 ">
                  {order.cartItems.map((item) => (
                    <div key={item.menuItemId} className="flex items-start text-foreground gap-3">
                      <div className="w-12">
                        <AspectRatio ratio={1}>
                          <img
                            src={item.imageUrl || "/placeholder-food.jpg"}
                            alt={item.name}
                            className="rounded-md object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">
                          {t('commons.currencyFormat', { amount: (item.price / 100).toFixed(2) })} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium text-sm">
                        {t('commons.currencyFormat', { amount: ((item.price * item.quantity) / 100).toFixed(2) })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t flex flex-col gap-3">
            <div className="w-full">
              <p className="text-xs text-gray-500">{t('orderItemCardInfo.deliveryTo')}</p>
              <p className="font-medium text-sm text-foreground">{order.deliveryDetails?.name}</p>
              <p className="font-medium text-sm text-foreground">{order.deliveryDetails?.mobile}</p>
              <p className="font-medium text-sm text-foreground">{order.deliveryDetails?.address}</p>
            </div>
            <div className="w-full text-right">
              <p className="text-xs text-gray-500">{t('orderItemCardInfo.total')}</p>
              <p className="text-lg font-bold text-foreground">
                {t('commons.currencyFormat', { amount: (order.totalAmount / 100).toFixed(2) })}
              </p>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default MobileOrderItemCardInfo;