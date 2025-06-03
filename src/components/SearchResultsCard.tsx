import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Banknote, Clock, Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import type { IRestaurant } from "@/store/restaurantSlice";
import { useTranslation } from 'react-i18next';

interface SearchResultsCardProps {
  restaurant: IRestaurant;
}

const SearchResultsCard = ({ restaurant }: SearchResultsCardProps) => {
  // Get loading and error states from Redux store
  const { loading, error } = useSelector((state: RootState) => state.restaurant);
  const { t } = useTranslation();

  // Format delivery price
  const formattedDeliveryPrice = restaurant.deliveryPrice;

  if (loading) {
    return <div>{t('searchResults.loading')}</div>;
  }

  if (error) {
    return <div>{t('searchResults.error')}: {error}</div>;
  }

  return (
    <Link 
      to={`/detail/${restaurant._id}`} 
      className="grid lg:grid-cols-[2fr_3fr] gap-5 group"
    >
      <AspectRatio ratio={16 / 6}>
        <img 
          src={restaurant.imageUrl} 
          className="rounded-md w-full h-full object-cover" 
          alt={restaurant.name}
        />
      </AspectRatio>
      <div id="card">
        <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:underline">
          {restaurant.name}
        </h3>
        <div id="card-content" className="grid md:grid-cols-2 gap-2">
          <div className="flex flex-row flex-wrap">
            {restaurant.cuisineType.map((item, index) => (
              <span className="flex" key={index}>
                <span>{item}</span>
                {index < restaurant.cuisineType.length - 1 && <Dot />}
              </span>
            ))}
          </div>

          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1 text-red-600">
              <Clock className="text-red-600" />
              {restaurant.estimatedDeliveryTime} mins
            </div>

            <div className="flex items-center gap-1">
              <Banknote className="text-green-600"/>
              {t("common.deliveryPrice")}: 
              <span className="text-green-600">
                ${formattedDeliveryPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultsCard;