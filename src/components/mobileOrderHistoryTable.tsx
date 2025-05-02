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
      <div className="p-4 text-center text-muted-foreground">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2 bg-background">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {orders.map((order) => (
          <AccordionItem 
            key={order._id} 
            value={order._id}
            className="border rounded-lg overflow-hidden border-border"
          >
            <AccordionTrigger className="px-3 py-3 bg-card hover:no-underline hover:bg-accent/10">
              <div className="flex flex-col items-start w-full space-y-1">
                <div className="flex justify-between w-full items-center">
                  <span className="font-medium text-sm text-foregroundT">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <Badge 
                    variant={
                      order.status === "delivered" ? "default" : 
                      order.status === "cancelled" ? "destructive" : "secondary"
                    }
                    className="text-sm"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between w-full text-xs">
                  <span className="text-muted-foreground">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </span>
                  <span className="font-medium text-foreground">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-3 py-2 bg-accent/5">
              <div className="space-y-3">
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">Items:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {order.cartItems.slice(0, 3).map((item, index) => (
                      <li key={index} className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                    {order.cartItems.length > 5 && (
                      <li className="text-muted-foreground">+ {order.cartItems.length - 3} more</li>
                    )}
                  </ul>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium text-foreground">Delivery Address:</p>
                  <p className="text-muted-foreground">{order.deliveryDetails?.address}</p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(order._id)}
                    className="flex-1 text-xs gap-1 border-border bg-input hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash className="h-4 w-4"/>
                    Remove
                  </Button>
                  {order.status === "delivered" && (
                    <Button
                      size="sm"
                      onClick={() => handleLocalReviewClick(order)}
                      className="flex-1 text-xs gap-1 bg-input hover:bg-input/60"
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
        <DialogContent className="max-w-[95vw] rounded-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-[95vw] rounded-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Confirm Order Removal
            </DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground">
            Are you sure you want to remove this order from your history?
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              Remove Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}