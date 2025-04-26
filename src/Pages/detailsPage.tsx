import { useGetRestaurant } from "@/api/RestaurentApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummery"; // <-- Make sure filename matches
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { IMenuItem } from "@/store/menuItemSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const DetailPage = () => {
    const { restaurantId } = useParams();
    const { restaurant, isLoading: isLoadingRestaurant } = useGetRestaurant(restaurantId);
    console.log("restaurantData", restaurant);

    const { cartItems } = useSelector((state: RootState) => state.cartMenuItem);


    if (isLoadingRestaurant) {
        return <div className="flex justify-center items-center min-h-screen">Loading restaurant details...</div>;
    }

    if (!restaurant) {
        return <div className="flex justify-center items-center min-h-screen">Restaurant not found</div>;
    }

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16 / 5}>
                <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.city}
                    className="rounded-md object-cover h-full w-full" 
                />
            </AspectRatio>
            <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr] gap-5">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant} />
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {(restaurant.menuItems as IMenuItem[]).map((menuItem) => (
                            <MenuItem 
                                key={menuItem._id} 
                                menuItem={menuItem} 
                            />
                        ))}
                    </div>
                </div>
                
                <div> 
                    <Card>
                        <OrderSummary restaurant={restaurant} />
                        <CardFooter>
                            <CheckoutButton 
                                disabled={cartItems.length === 0}
                                restaurantId= {restaurant._id}
                            />
                        </CardFooter>    
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
