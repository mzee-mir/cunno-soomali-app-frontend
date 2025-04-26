import { useQuery } from "react-query";
import { SearchState } from "@/Pages/SearchPage";
import Axios from "@/lib/Axios";
import ApiEndpoints from "./Userauth";
import { IRestaurant, SearchRestaurantsResponse } from "@/store/restaurantSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = (restaurantId?: string) => {
  const getRestaurantByIdRequest = async (): Promise<IRestaurant> => {
    try {
      const response = await Axios({
        ...ApiEndpoints.restaurant.getRestaurant,
        url: ApiEndpoints.restaurant.getRestaurant.url.replace(
          ":restaurantId", 
          restaurantId || ""
        ),
      });
  
      const data = response.data;
      console.log("Fetched restaurant:", data);
  
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format");
      }
      
      if (!data.menuItems) {
        data.menuItems = [];
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      throw error;
    }
  };
  
  const { data: restaurant, isLoading, error } = useQuery(
    ["restaurant", restaurantId],
    getRestaurantByIdRequest,
    {
      enabled: !!restaurantId,
      retry: 1,
    }
  );
  
  return { restaurant, isLoading, error };
};

export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<SearchRestaurantsResponse> => {
    const params = new URLSearchParams();
    if (searchState.searchQuery) {
      params.set("searchQuery", searchState.searchQuery);
    }
    params.set("page", searchState.page.toString());
    if (searchState.selectedCuisines.length > 0) {
      params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    }
    if (searchState.sortOption) {
      params.set("sortOption", searchState.sortOption);
    }

    const response = await Axios({
      ...ApiEndpoints.restaurant.searchRestaurants,
      url: `${ApiEndpoints.restaurant.searchRestaurants.url}/${city}?${params.toString()}`
    });

    if (!response.data) {
      throw new Error("Failed to get restaurants");
    }

    return response.data;
  };

  const { data: results, isLoading } = useQuery(
    ["searchRestaurants", searchState, city],
    createSearchRequest,
    { enabled: !!city }
  );

  return {
    results,
    isLoading,
  };
};