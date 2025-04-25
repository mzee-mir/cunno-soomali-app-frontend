import { IRestaurant } from "./store/restaurantSlice";

export type User = {
    _id: string;
    email: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
};

export interface MenuItem {
  _id: string;
  name: string;
  price: number; // in cents
  imageUrl?: string;
}

export interface Restaurants {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  openingHours: string;
  cuisineType: string[];
  owner: string; // owner's user ID
  images: string[];
  menuItems: MenuItem[];
  deliveryPrice: number; // in cents
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type Restaurant = {
    imageFile: any;
    _id: string;
    user: string;
    restaurantName: string;
    city: string;
    country: string;
    deliveryPrice: number;
    estimatedDeliveryTime:number;
    cuisines: string[];
    menuItems: MenuItem[];
    imageUrl: string;
    lastUpdated:string;
};
export type RestaurantSearchResponse ={
    data:Restaurant[];
    pagination : {
        total: number;
        page: number;
        pages: number;
    }
}

export type OrderStatus = 
|"Placed"
|"Paid"
|"inProgress"
|"outForDelivery"
|"delivered"

export type Order = {
    _id: string;
    restaurant: Restaurant;
    user: User;
    reviewed: boolean;
    cartItems: {
      menuItemId: string;
      name: string;
      quantity: string;
    }[];
    deliveryDetails: {
      name: string;
      addressLine1: string;
      city: string;
      email: string;
    };
    
    menuItems: MenuItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    restaurantId: string;
  };
  export type Reviews = {
    _id:  string;
    rating: number;
    comment: string;
    user: User;
    restaurant: IRestaurant;
    createdAt: string;
  }

  // types/restaurant.d.ts (frontend type definitions)
export interface MenuItem {
  _id: string;
  name: string;
  price: number; // in cents
  imageUrl?: string;
}


