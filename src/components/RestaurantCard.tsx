// components/RestaurantCard.tsx
import { Restaurants } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }: { restaurant: Restaurants }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
      <p className="text-gray-600">{restaurant.description}</p>
      <p className="text-sm mt-2">
        {restaurant.address}, {restaurant.city}, {restaurant.country}
      </p>
      <p className="text-sm">Phone: {restaurant.phone}</p>
      <p className="text-sm">Hours: {restaurant.openingHours}</p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/manage-restaurant/${restaurant._id}`}>Edit</Link>
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default RestaurantCard;