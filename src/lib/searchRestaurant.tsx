// src/api/RestaurantApi.ts
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { useQuery } from "react-query";

export const useGetRestaurantById = (restaurantId?: string) => {
  return useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      
      const endpoint = SummaryApi.restaurant.getRestaurants.url + `/${restaurantId}`;
      const response = await Axios({
        ...SummaryApi.restaurant.getRestaurants,
        url: endpoint,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch restaurant");
      }

      return response.data.data;
    },
    enabled: !!restaurantId,
  });
};

export const useSearchRestaurants = (
  city?: string,
  searchQuery?: string,
  selectedCuisines?: string[],
  sortOption?: string,
  page?: number
) => {
  return useQuery({
    queryKey: ["searchRestaurants", city, searchQuery, selectedCuisines, sortOption, page],
    queryFn: async () => {
      if (!city) return null;

      const params = new URLSearchParams();
      if (searchQuery) params.append("searchQuery", searchQuery);
      if (selectedCuisines?.length) params.append("selectedCuisines", selectedCuisines.join(","));
      if (sortOption) params.append("sortOption", sortOption);
      if (page) params.append("page", page.toString());

      const response = await Axios.get(`/restaurant/search/${city}?${params.toString()}`);

      // Remove the success check since your API returns data directly
      return response.data;
    },
    enabled: !!city,
  });
};