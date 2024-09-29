import { number } from "zod";

export type User = {
    _id: string;
    email: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
};

export type MenuItems = {
    _id: string;
    name: string;
    price: number;
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
    menuItems: MenuItems[];
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
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    restaurantId: string;
  };
