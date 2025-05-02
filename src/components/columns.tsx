import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import OrderInfo from "@/components/OrderInfo"; // Import the OrderInfo component
import { Order } from "@/store/OrderSlice";
import { Star } from "lucide-react";

const getOrderDateInfo = (createdAt: string | undefined) => {
  if (!createdAt) return "No date";
  const date = new Date(createdAt);
  const day = date.getDate();
  return `${day}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "primary";
    case "placed":
      return "primary";
    case "inProgress":
      return "warning";
    case "outForDelivery":
      return "info";
    case "delivered":
      return "success";
    default:
      return "default";
  }
};

export const columns = (
  handleRemoveOrder: (orderId: string) => void,
  handleReviewClick?: (orderId: string) => void // Make this optional
): ColumnDef<Order>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Chip
          label={status}
          color={getStatusColor(status)}
          variant="outlined"
          className="capitalize"
        />
      );
    },
  },
  {
    accessorKey: "restaurant.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Restaurant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <OrderInfo order={row.original} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => <div>{getOrderDateInfo(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue<number>("totalAmount");
      return <div className="text-left">${(amount / 100).toFixed(2)}</div>;
    },
  },

  {
    id: "review",
    header: "Review",
    cell: ({ row }) => {
      const order = row.original;
      return (
        order.status === "delivered" && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              if (handleReviewClick) {
                handleReviewClick(order._id); // ✅ Call the handler
              }
            }}
          >
            <Star className="h-4 w-4 mr-1" />
            Review
          </Button>
        )
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      const [open, setOpen] = useState(false);

      const handleClickOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const handleConfirm = () => {
        handleRemoveOrder(order._id);
        handleClose();
      };

      return (
        <div className="flex space-x-2">

            {/* Trash Icon for Deletion */}
          <Trash
            className="cursor-pointer text-blue-600 hover:text-red-600 active:text-[#b91c1c] transition-colors duration-200 trash-icon"
            size={20}
            onClick={handleClickOpen}
          />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this order?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No
              </Button>
              <Button onClick={handleConfirm} color="error" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];