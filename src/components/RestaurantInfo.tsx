import { Restaurant } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dot } from "lucide-react";

type Props = {
    restaurant: Restaurant;
}

const RestaurantInfo = ({restaurant}: Props) => {
    return (
        <Card className="border-sla" >
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight" >
                    {restaurant.restaurantName}
                </CardTitle>
                <CardDescription>
                    {restaurant.city}, {restaurant.country}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4 sm:flex flex-wrap" >
                {restaurant.cuisines.map((item, index) => (
                    <span key={index} className="flex items-center">
                        <span>{item}</span>
                        {index < restaurant.cuisines.length -1 && <Dot />}
                    </span>
                ))}
            </CardContent>
        </Card>
    )
}
export default RestaurantInfo;