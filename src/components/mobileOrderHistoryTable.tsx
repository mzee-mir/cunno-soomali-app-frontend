import * as React from "react";
import { Order } from "@/store/OrderSlice";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewInterface from "./ReviewInterface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Star, Trash } from "lucide-react";

interface MobileOrderHistoryTableProps {
  orders: Order[];
  handleRemoveOrder: (orderId: string) => void;
  handleReviewClick?: (orderId: string) => void;
}

export function MobileOrderHistoryTable({ 
  orders, 
  handleRemoveOrder,
  handleReviewClick 
}: MobileOrderHistoryTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [showReviewDialog, setShowReviewDialog] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState<string | null>(null);

  const handleLocalReviewClick = (order: Order) => {
    setSelectedOrder(order);
    setShowReviewDialog(true);
    if (handleReviewClick) {
      handleReviewClick(order._id);
    }
  };

  const handleReviewComplete = () => {
    setShowReviewDialog(false);
    setSelectedOrder(null);
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      handleRemoveOrder(orderToDelete);
    }
    setDeleteConfirmOpen(false);
  };

  if (!orders?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {orders.map((order) => (
          <AccordionItem 
            key={order._id} 
            value={order._id}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-3 py-3 bg-gray-50 hover:no-underline hover:bg-gray-100">
              <div className="flex flex-col items-start w-full space-y-1">
                <div className="flex justify-between w-full items-center">
                  <span className="font-medium text-sm">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <Badge 
                    variant={
                      order.status === "delivered" ? "default" : 
                      order.status === "cancelled" ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between w-full text-xs">
                  <span className="text-gray-500">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </span>
                  <span className="font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-3 py-2 bg-gray-100">
              <div className="space-y-3">
                <div className="text-sm space-y-1">
                  <p className="font-medium">Items:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {order.cartItems.slice(0, 3).map((item, index) => (
                      <li key={index} className="text-gray-600">
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                    {order.cartItems.length > 5 && (
                      <li className="text-gray-500">+ {order.cartItems.length - 3} more</li>
                    )}
                  </ul>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">Delivery Address:</p>
                  <p className="text-gray-600">{order.deliveryDetails?.address}</p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(order._id)}
                    className="flex-1 text-xs gap-1"
                  >
                    <Trash/>
                    Remove
                  </Button>
                  {order.status === "delivered" && (
                    <Button
                      size="sm"
                      onClick={() => handleLocalReviewClick(order)}
                      className="flex-1 text-xs gap-1"
                    >
                      <Star className="h-4 w-4" />
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
        <DialogContent className="max-w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              Review Order #{selectedOrder?._id.slice(-6).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <ReviewInterface 
              orderId={selectedOrder._id} 
              onReviewComplete={handleReviewComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}