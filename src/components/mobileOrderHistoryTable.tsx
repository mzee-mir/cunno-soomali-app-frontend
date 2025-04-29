import * as React from "react";
import { Order } from "@/store/OrderSlice";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewInterface from "./ReviewInterface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface MobileOrderHistoryTableProps {
  orders: Order[];
  handleRemoveOrder: (orderId: string) => void;
}

export function MobileOrderHistoryTable({ orders, handleRemoveOrder }: MobileOrderHistoryTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [showReviewDialog, setShowReviewDialog] = React.useState(false);

  const handleReviewClick = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowReviewDialog(true);
    }
  };

  const handleReviewComplete = () => {
    setShowReviewDialog(false);
    setSelectedOrder(null);
  };

  if (!orders || orders.length === 0) {
    return <p className="p-4 text-center text-gray-500">No orders found</p>;
  }

  return (
    <div className="w-full p-2">
      <Accordion type="single" collapsible className="w-full">
        {orders.map((order) => (
          <AccordionItem key={order._id} value={order._id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col items-start w-full">
                <div className="flex justify-between w-full">
                  <span className="font-medium">Order #{order._id}</span>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </span>
                <span className="text-sm font-medium mt-1">${order.totalAmount.toFixed(2)}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 p-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span>{order.cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="text-right">{order.deliveryDetails?.address}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveOrder(order._id)}
                    className="flex-1"
                  >
                    Remove
                  </Button>
                  {order.status === "delivered" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReviewClick(order._id)}
                      className="flex-1"
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Review</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4">
              <ReviewInterface 
                orderId={selectedOrder._id} 
                onReviewComplete={handleReviewComplete}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}