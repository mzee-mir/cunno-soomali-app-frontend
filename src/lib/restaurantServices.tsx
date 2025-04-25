// services/restaurantService.ts
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import { 
    setCurrentRestaurant,
    setRestaurantLoading,
    setRestaurantError,
    clearRestaurantState
} from "@/store/restaurantSlice";
import type { IRestaurant } from "@/store/restaurantSlice";

/**
 * Service for handling restaurant operations
 */
export const RestaurantService = {
    /**
     * Create a new restaurant
     */
    async createRestaurant(
        dispatch: Dispatch,
        restaurantData: Omit<IRestaurant, '_id' | 'createdAt' | 'updatedAt'>
    ): Promise<IRestaurant> {
        try {
            dispatch(setRestaurantLoading(true));
            dispatch(setRestaurantError(null));

            const response = await Axios({
                ...SummaryApi.restaurant.addRestaurants,
                data: restaurantData
            });
            
            

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to create restaurant");
            }

            const newRestaurant = response.data.data as IRestaurant;
            dispatch(setCurrentRestaurant(newRestaurant));
            return newRestaurant;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create restaurant";
            dispatch(setRestaurantError(errorMessage));
            throw error;
        } finally {
            dispatch(setRestaurantLoading(false));
        }
    },

    /**
     * Update an existing restaurant
     */
    async updateRestaurant(
        dispatch: Dispatch,
        restaurantId: string,
        updateData: Partial<IRestaurant>
    ): Promise<IRestaurant> {
        try {
            dispatch(setRestaurantLoading(true));
            dispatch(setRestaurantError(null));

            const endpoint = SummaryApi.restaurant.updateRestaurant.url.replace(':id', restaurantId);
            const response = await Axios({
                ...SummaryApi.restaurant.updateRestaurant,
                url: endpoint,
                data: updateData
            });
            console.log('data', response);
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update restaurant");
            }

            const updatedRestaurant = response.data.data as IRestaurant;
            dispatch(setCurrentRestaurant(updatedRestaurant));
            return updatedRestaurant;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update restaurant";
            dispatch(setRestaurantError(errorMessage));
            throw error;
        } finally {
            dispatch(setRestaurantLoading(false));
        }
    },

    /**
     * Delete a restaurant
     */
    async deleteRestaurant(
        dispatch: Dispatch,
        restaurantId: string
    ): Promise<boolean> {
        try {
            dispatch(setRestaurantLoading(true));
            dispatch(setRestaurantError(null));

            const endpoint = SummaryApi.restaurant.deleteRestaurant.url.replace(':id', restaurantId);
            const response = await Axios({
                ...SummaryApi.restaurant.deleteRestaurant,
                url: endpoint
            });

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete restaurant");
            }

            dispatch(clearRestaurantState());
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete restaurant";
            dispatch(setRestaurantError(errorMessage));
            throw error;
        } finally {
            dispatch(setRestaurantLoading(false));
        }
    },

    /**
     * Get restaurant details
     */
    async getRestaurantDetails(
        dispatch: Dispatch,
        restaurantId: string
    ): Promise<IRestaurant> {
        try {
            dispatch(setRestaurantLoading(true));
            dispatch(setRestaurantError(null));

            const response = await Axios({
                ...SummaryApi.restaurant.getRestaurants,
                url: `${SummaryApi.restaurant.getRestaurants.url}/${restaurantId}`
            });
            
            console.log('data', response);
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch restaurant details");
            }

            const restaurant = response.data.data as IRestaurant;
            dispatch(setCurrentRestaurant(restaurant));
            return restaurant;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch restaurant details";
            dispatch(setRestaurantError(errorMessage));
            throw error;
        } finally {
            dispatch(setRestaurantLoading(false));
        }
    },

    /**
     * Get all restaurants owned by user
     */
    async getUserRestaurants(
        dispatch: Dispatch,
        userId: string
    ): Promise<IRestaurant[]> {
        try {
            dispatch(setRestaurantLoading(true));
            dispatch(setRestaurantError(null));

            const response = await Axios({
                ...SummaryApi.restaurant.getRestaurants,
                params: { owner: userId }
            });
            
            console.log('GUdata', response);

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch user restaurants");
            }

            const restaurants = response.data.data as IRestaurant[];
            if (restaurants.length > 0) {
                dispatch(setCurrentRestaurant(restaurants[0]));
            }
            return restaurants;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch user restaurants";
            dispatch(setRestaurantError(errorMessage));
            throw error;
        } finally {
            dispatch(setRestaurantLoading(false));
        }
    }
};