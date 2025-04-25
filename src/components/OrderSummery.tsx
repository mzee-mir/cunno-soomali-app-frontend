import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobalContext } from "@/Provider/Global";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { IRestaurant } from "@/store/restaurantSlice";

type Props = {
    restaurant: IRestaurant;
};

const OrderSummary = ({ restaurant }: Props) => {
    const { deleteCartItem, fetchCartItem } = useGlobalContext();
    const { cartItems } = useSelector((state: RootState) => state.cartMenuItem);

    const getTotalCost = () => {
        const totalCents = cartItems.reduce(
            (total, cartItem) => total + (cartItem.menuItemId.price * cartItem.quantity),
            0
        );
        const totalWithDelivery = totalCents + restaurant.deliveryPrice;
        return totalWithDelivery ;
    };

    const handleRemoveItem = async (cartItemId: string) => {
        try {
            await deleteCartItem(cartItemId);
            await fetchCartItem();
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
                    <span>Your Order</span>
                    <span>${getTotalCost()}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {cartItems.map((item) => (
                    <div className="flex justify-between" key={item._id}>
                        <span>
                            <Badge variant="outline" className="mr-2">
                                {item.quantity}
                            </Badge>
                            {item.menuItemId.name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Trash
                                className="cursor-pointer text-blue-600 hover:text-red-600 active:text-[#b91c1c] transition-colors duration-200"
                                size={20}
                                onClick={() => handleRemoveItem(item._id)}
                            />
                            ${(item.menuItemId.price * item.quantity)}
                        </span>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${restaurant.deliveryPrice }</span>
                </div>
                <Separator />
            </CardContent>
        </>
    );
};

export default OrderSummary;
