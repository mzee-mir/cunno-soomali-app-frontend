import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { columns } from "@/components/columns";
import { Order } from "@/store/OrderSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewInterface from "./ReviewInterface";
import { useTranslation } from 'react-i18next';

interface OrderHistoryTableProps {
  orders: Order[];
  handleRemoveOrder: (orderId: string) => void;
}

export function OrderHistoryTable({ orders, handleRemoveOrder }: OrderHistoryTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [showReviewDialog, setShowReviewDialog] = React.useState(false);
  const { t } = useTranslation();

  const handleReviewClick = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowReviewDialog(true);
    }
  };

  const table = useReactTable({
    data: orders,
    columns: columns(handleRemoveOrder, handleReviewClick),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRowClick = (order: Order) => {
    console.log("Order selected:", order._id);
  };

  const handleReviewComplete = () => {
    setShowReviewDialog(false);
    setSelectedOrder(null);
  };

  return (
    <div className="w-full bg-background text-foreground">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto border-border hover:bg-accent hover:text-accent-foreground">
            {t('orderHistory.columns')} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize hover:bg-accent hover:text-accent-foreground"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border border-border">
        <Paper className="bg-card">
          <TableContainer>
            <Table>
              <TableHead className="bg-accent/80">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} >
                    {headerGroup.headers.map((header) => (
                      <TableCell 
                        key={header.id}
                        
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const order = row.original as Order;
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={`
                          hover:bg-accent/10 cursor-pointer transition-colors
                          ${order.status === "delivered" ? "hover:bg-primary/5" : ""}
                          ${row.getIsSelected() ? "bg-primary/10" : ""}
                        `}
                        onClick={() => handleRowClick(order)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-foreground">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {t('orderHistory.noResults')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-border hover:bg-accent hover:text-accent-foreground"
        >
          {t('orderHistory.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-border hover:bg-accent hover:text-accent-foreground"
        >
          {t('orderHistory.next')}
        </Button>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[425px] bg-accent border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('orderHistory.orderReview')}</DialogTitle>
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