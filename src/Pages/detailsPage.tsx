import { useGetRestaurant } from "@/api/RestaurentApi";
import MenuItem from "@/components/MenuItem";
import OrderSummery from "@/components/OrderSummery";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { MenuItems } from "@/types";
import { useState } from "react";

import { useParams } from "react-router-dom"

export type CartItem = {
    _id: string;
    name:string;
    price: number;
    quantity: number;

}



const DetailPage = () => {
    const { restaurantId } = useParams();
    const { restaurant, isLoading } = useGetRestaurant(restaurantId);

    const [cartItems, setCartItem] = useState<CartItem[]>([]);

    const addToCart = (menuItem: MenuItems) => {
        setCartItem((prevCartItem) => {
            //1. check if the item is already in the cart
            const existingCartItem = prevCartItem.find((cartItem)=> cartItem._id === menuItem._id);

            let updatedCartItems;
            // 2. if item is in cart, update the quantity
            if (existingCartItem) {
                updatedCartItems = prevCartItem.map((cartItem)=> 
                    cartItem._id === menuItem._id? 
                    { ...cartItem, quantity: cartItem.quantity + 1}: cartItem);
            } else{
                updatedCartItems = [
                    ...prevCartItem,
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1,
                    },
                ];
            }

            return updatedCartItems;
        })
    };

    const removeFromCart = (cartItem:CartItem)=> {
        setCartItem((prevCartItem)=>{
            const updatedCartItems = prevCartItem.filter((item) => cartItem._id !== item._id);

            return updatedCartItems;
        })
    }

    if(isLoading || !restaurant) {
        return "Loading...";
    }

    return(
        <div className="flex flex-col gap-10" >
            <AspectRatio ratio={16 / 5} >
                <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32" >
                <div className="flex flex-col gap-4" >
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl font-bold tracking-tight">
                        {restaurant.menuItems.map((menuItem)=> (
                            <MenuItem menuItem={menuItem} addToCart={() =>addToCart(menuItem)} />
                        ))}
                    </span>
                </div>
                
                <div>
                <OrderSummery restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart} />
                </div>
                
            </div>
        </div>
    )
}
export default DetailPage;