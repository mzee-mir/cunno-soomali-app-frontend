import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Order } from "@/store/OrderSlice";
import { Avatar } from "@mui/material";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from 'react-i18next';

type Props = {
  order: Order;
  isSelected?: boolean;
  onClick: () => void;
};

const MobileOrderItemCard: React.FC<Props> = ({ order, isSelected, onClick }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="w-full">
      <Card 
        className={`shadow-sm ${isSelected ? 'border-primary border' : ''}`}
        onClick={onClick}
      >
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={order.user.avatar}
                alt={order.user.name}
                sx={{ width: 36, height: 36 }}
              >
                {order.user.name.charAt(0)}
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">
                  {order.deliveryDetails?.name || t('orderItemCard.customer')}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                toggleDetails();
              }}
            >
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </CardHeader>

        {showDetails && (
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('orderItemCard.items')}</span>
              <span>{order.cartItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('orderItemCard.status')}</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('orderItemCard.total')}</span>
              <span className="font-medium">
                {t('commons.currencyFormat', { amount: (order.totalAmount / 100).toFixed(2) })}
              </span>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const MobileOrderItemCardInfo: React.FC<{ order: Order }> = ({ order }) => {
  const { t } = useTranslation();
  return (
    <Card className="mt-2">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-lg">{t('mobileOrders.orderDetails')}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium mb-2">{t('orderItemCardInfo.orderItems')}</h3>
          <div className="space-y-3">
            {order.cartItems.map((item) => (
              <div key={item.menuItemId} className="flex gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden">
                  <img
                    src={item.imageUrl || "/placeholder-food.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('commons.currencyFormat', { amount: (item.price / 100).toFixed(2) })} × {item.quantity}
                  </p>
                </div>
                <div className="font-medium">
                  {t('commons.currencyFormat', { amount: ((item.price * item.quantity) / 100).toFixed(2) })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">{t('orderItemCardInfo.deliveryTo')}</h3>
          <div className="text-sm">
            <p>{order.deliveryDetails?.name}</p>
            <p className="text-muted-foreground">{order.deliveryDetails?.mobile}</p>
            <p className="text-muted-foreground">{order.deliveryDetails?.address}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{t('orderItemCard.id')}</p>
          <p className="font-medium">{order._id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{t('orderItemCard.total')}</p>
          <p className="text-lg font-bold">
            {t('commons.currencyFormat', { amount: (order.totalAmount / 100).toFixed(2) })}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

const MobileOrdersList = ({ orders }: { orders: Order[] }) => {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="p-3 space-y-3">
      <h2 className="text-lg font-bold">
        {t('mobileOrders.activeOrders', { count: orders.length })}
      </h2>
      
      <div className="space-y-2">
        {orders.map((order) => (
          <MobileOrderItemCard
            key={order._id}
            order={order}
            isSelected={selectedOrder?._id === order._id}
            onClick={() => setSelectedOrder(order)}
          />
        ))}
      </div>

      {selectedOrder && (
        <MobileOrderItemCardInfo order={selectedOrder} />
      )}
    </div>
  );
};

export default MobileOrdersList;