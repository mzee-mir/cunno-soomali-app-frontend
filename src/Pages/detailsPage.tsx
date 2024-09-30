import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurentApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItem from "@/components/MenuItem";
import OrderSummery from "@/components/OrderSummery";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
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
    const {createCheckoutSession, isLoading:isCheckoutLoading} = useCreateCheckoutSession();

    const [cartItems, setCartItem] = useState<CartItem[]>(()=> {
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
        return storedCartItems ? JSON.parse(storedCartItems): [];
    });

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

            sessionStorage.setItem(`cartItems-${restaurantId}`,
            JSON.stringify(updatedCartItems)
            )

            return updatedCartItems;
        })
    };

    const removeFromCart = (cartItem:CartItem)=> {
        setCartItem((prevCartItem)=>{
            const updatedCartItems = prevCartItem.filter((item) => cartItem._id !== item._id);

            sessionStorage.setItem(`cartItems-${restaurantId}`,
            JSON.stringify(updatedCartItems)
            )

            return updatedCartItems;
        })
    }

    const onCheckout = async (userFormData: UserFormData)=>{

        if (!restaurant) {
            return;
        }

        const checkoutData = {
            cartItems: cartItems.map((cartItem)=> ({
                menuItemId: cartItem._id,
                name: cartItem.name,
                quantity: cartItem.quantity.toString(),
            })),
            restaurantId: restaurant._id,
            deliveryDetails: {
                name: userFormData.name,
                addressLine1: userFormData.addressLine1,
                city: userFormData.city,
                country: userFormData.country,
                email: userFormData.email as string,
            }
        };

        const data = await createCheckoutSession(checkoutData);
        window.location.href = data.url;

    }    

    if(isLoading || !restaurant) {
        return "Loading...";
    }

    return(
        <div className="flex flex-col gap-10 " >
            <AspectRatio ratio={16 / 5} >
                <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
            </AspectRatio>
            <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr] gap-5 md:px-32" >
                <div className="flex flex-col gap-4 " >
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl font-bold tracking-tight ">
                        {restaurant.menuItems.map((menuItem)=> (
                            <MenuItem key={menuItem._id} menuItem={menuItem} addToCart={() =>addToCart(menuItem)} />
                        ))}
                    </span>
                </div>
                
                <div> 
                <Card>
                    <OrderSummery 
                    restaurant={restaurant} 
                    cartItems={cartItems} 
                    removeFromCart={removeFromCart} />
                    <CardFooter>
                        <CheckoutButton 
                        disabled={cartItems.length === 0} 
                        onCheckout={onCheckout}
                        isLoading = {isCheckoutLoading}
                        />
                    </CardFooter>    
                </Card>
                
                </div>
                
            </div>
        </div>
    )
}
export default DetailPage;