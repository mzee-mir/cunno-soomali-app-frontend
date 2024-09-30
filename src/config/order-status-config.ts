type OrderStatusInfo = {
    label: string;
    value: string;
    progressValue: number;
}

export const ORDER_STATUS: OrderStatusInfo[] = [
    {
        label:"Placed",
        value: "placed",
        progressValue:0,
    },
    {
        label:"Awaiting Confirmation",
        value: "paid",
        progressValue:25,
    },
    {
        label:"in Progress",
        value: "inProgress",
        progressValue:50
    },
    {
        label:"Out for delivery",
        value: "outForDelivery",
        progressValue:75,
    },
    {
        label:"Delivered",
        value: "delivered",
        progressValue:100,
    }
]