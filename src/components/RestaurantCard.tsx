// components/RestaurantCard.tsx
import { Restaurants } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const RestaurantCard = ({ restaurant }: { restaurant: Restaurants }) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
      <p className="text-gray-600">{restaurant.description}</p>
      <p className="text-sm mt-2">
        {restaurant.address}, {restaurant.city}, {restaurant.country}
      </p>
      <p className="text-sm">{t('restaurantcard.phone')}: {restaurant.phone}</p>
      <p className="text-sm">{t('restaurantcard.hours')}: {restaurant.openingHours}</p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/manage-restaurant/${restaurant._id}`}>{t('restaurantcard.edit')}</Link>
        </Button>
        <Button variant="destructive" size="sm">
        {t('restaurantcard.delete')}
        </Button>
      </div>
    </div>
  );
};

export default RestaurantCard;