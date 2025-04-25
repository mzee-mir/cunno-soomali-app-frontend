import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dot } from "lucide-react";
import { IRestaurant } from "@/store/restaurantSlice";

type Props = {
    restaurant: IRestaurant;
}

const RestaurantInfo = ({restaurant}: Props) => {
    return (
        <Card className="border-sla" >
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight" >
                    {restaurant.name}
                </CardTitle>
                <CardDescription>
                    {restaurant.city}, {restaurant.country}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4 sm:flex flex-wrap" >
                {restaurant.cuisineType.map((item, index) => (
                    <span key={index} className="flex items-center">
                        <span>{item}</span>
                        {index < restaurant.cuisineType.length -1 && <Dot />}
                    </span>
                ))}
            </CardContent>
        </Card>
    )
}
export default RestaurantInfo;