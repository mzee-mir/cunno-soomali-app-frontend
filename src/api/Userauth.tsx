export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiEndpoint {
  url: string;
  method: string;
}

interface ApiStructure {
  auth: {
    Signup: ApiEndpoint;
    Verifyuser: ApiEndpoint;
    Signin: ApiEndpoint;
    logout: ApiEndpoint;
    refreshToken: ApiEndpoint;
  };
  password: {
    forgotPassword: ApiEndpoint;
    verifyForgotPasswordOtp: ApiEndpoint;
    resetPassword: ApiEndpoint;
  };
  user: {
    userDetails: ApiEndpoint;
    updateUserDetails: ApiEndpoint;
    uploadAvatar: ApiEndpoint;
  };
  cartMenu:{
    createCart: ApiEndpoint;
    getCart: ApiEndpoint;
    updateCart: ApiEndpoint;
    deleteCart: ApiEndpoint;
  },
  analytics:{
    getOverallStats: ApiEndpoint,
    getDailyStats: ApiEndpoint,
    getStatsPerRestaurant: ApiEndpoint,
    getRestaurantDailyStats: ApiEndpoint
  }
  address: {
    createAddress: ApiEndpoint;
    getAddress: ApiEndpoint;
    updateAddress: ApiEndpoint;
    disableAddress: ApiEndpoint;
  },
  order: {
    createOrder: ApiEndpoint;
    getOrder: ApiEndpoint;
    stripeWebhook: ApiEndpoint;
    createReview: ApiEndpoint;
    getRestaurantReviews: ApiEndpoint;
    getOrderReviews: ApiEndpoint;
  },
  notification: {
    getNotifications: ApiEndpoint;
    markAsRead: ApiEndpoint;
    markAllAsRead: ApiEndpoint;
    getUnreadCount: ApiEndpoint;
    deleteNotification: ApiEndpoint;
    deleteAllReadNotification: ApiEndpoint;
  },
  dashboard: {
    getDashboardData: ApiEndpoint;
  },
  restaurant: {
    addRestaurants: ApiEndpoint;
    getRestaurants: ApiEndpoint;
    updateRestaurant: ApiEndpoint;
    uploadImageRestaurant: ApiEndpoint;
    deleteRestaurant: ApiEndpoint;
    getRestaurant: ApiEndpoint;
    searchRestaurants: ApiEndpoint;
  };
  menuItem: {
    addMenuItem: ApiEndpoint;
    getMenuItems: ApiEndpoint;
    updateMenuItem: ApiEndpoint;
    deleteMenuItem: ApiEndpoint;
    uploadMenuItemImage: ApiEndpoint;
  };
  OrdersRestaurant: {
    getOrdersRestaurant: ApiEndpoint;
    updateOrdersRestaurant: ApiEndpoint;
  },
}

const ApiEndpoints: ApiStructure = {
  auth: {
    Signup: { url: "/api/user/signup", method: "POST" },
    Verifyuser: { url: "/api/user/verify-email", method: "POST" },
    Signin: { url: "/api/user/login", method: "POST" },
    logout: { url: "/api/user/logout", method: "GET" },
    refreshToken: { url: "/api/user/refresh-token", method: "POST" },
  },

  password: {
    forgotPassword: { url: "/api/user/forgot-password", method: "PUT" },
    verifyForgotPasswordOtp: { url: "/api/user/verify-otp", method: "PUT" },
    resetPassword: { url: "/api/user/reset-password", method: "PUT" },
  },

  user: {
    userDetails: { url: "/api/user/user-details", method: "GET" },
    updateUserDetails: { url: "/api/user/update-user", method: "PUT" },
    uploadAvatar: { url: "/api/user/upload-avatar", method: "PUT" },
  },

  address: {
    createAddress: {  url: "/api/user/address/create-address", method: "POST" },
    getAddress : {  url: "/api/user/address/get-address", method: "GET" },
    updateAddress : { url: "/api/user/address/update-address", method: "PUT"},
    disableAddress : { url: "/api/user/address/disable-address", method: "DELETE"}
  },

  notification: {
    getNotifications: { url: "/api/notification", method: "GET" },
    markAsRead: { url: "/api/notification/:notificationId/read", method: "PATCH" },
    markAllAsRead: { url: "/api/notification/read-all", method: "PATCH" },
    getUnreadCount: { url: "/api/notification/unread-count", method: "GET" },
    deleteNotification: { url: "/api/notification/:notificationId", method: "DELETE" },
    deleteAllReadNotification: { url: "/api/notification/read/all", method: "DELETE" },
  },

  cartMenu: {
    createCart: { url: "/api/user/cart/create-cart", method: "POST" },
    getCart : {  url: "/api/user/cart/get-cart", method: "GET" },
    updateCart : { url: "/api/user/cart/update-qty", method: "PUT"},
    deleteCart : { url: "/api/user/cart/delete-cart-item", method: "DELETE"},
  },

  OrdersRestaurant: {
    getOrdersRestaurant: { url: "/api/restaurant/orders", method: "GET" },
    updateOrdersRestaurant: { url: "/api/restaurant/order/:orderId/status", method: "PATCH" }
  },

  restaurant: {
    addRestaurants: { url: "/api/restaurant/Add-restaurants", method: "POST" },
    getRestaurants: { url: "/api/restaurant/Get-restaurants", method: "GET" },
    updateRestaurant: { url: "/api/restaurant/Updating-restaurants/:id", method: "PUT" },
    uploadImageRestaurant: { url: "/api/restaurant/upload-restaurant-image/:restaurantId", method: "PUT" },
    deleteRestaurant: { url: "/api/restaurant/Deleting-restaurants/:id", method: "DELETE" },
    getRestaurant: { url: "/api/restaurant/:restaurantId", method: "GET" },
    searchRestaurants: { url: "/api/restaurant/search", method: "GET" },
  },

  order: {
    createOrder: { url: "/api/order/checkout/create-checkout-session", method: "POST" },
    getOrder: { url: "/api/order/fetch-Order", method: "GET" },
    stripeWebhook: { url: "/api/order/checkout/webhook", method: "POST" },
    createReview: { url: "/api/order/:orderId/reviews", method: "POST" }, // Changed from restaurant to order
    getOrderReviews: { url: "/api/order/:orderId/reviews", method: "GET" }, // New endpoint
    getRestaurantReviews: { url: "/api/order/restaurants/:restaurantId/reviews", method: "GET"
    },
  },

  analytics:{
    getOverallStats: {url: "/api/analytics/overview", method: "GET"},
    getDailyStats: {url: "/api/analytics/daily", method: "GET"},
    getStatsPerRestaurant: {url: "/api/analytics/per-restaurant", method: "GET"},
    getRestaurantDailyStats: {url: "/api/analytics/:restaurantId/daily", method: "GET"}
  },

  menuItem: {
    addMenuItem: { url: "/api/restaurant/:restaurantId/menu", method: "POST" },
    getMenuItems: { url: "/api/restaurant/:restaurantId/menu", method: "GET" },
    updateMenuItem: { url: "/api/restaurant/:restaurantId/menu/:menuItemId", method: "PUT" },
    deleteMenuItem: { url: "/api/restaurant/menu/:menuItemId/soft-delete", method: "DELETE" },
    uploadMenuItemImage: { 
      url: "/api/restaurant/:restaurantId/menuImage/:menuItemId", 
      method: "PUT" 
    }
  },
  dashboard: {
    getDashboardData: { url: "/api/dashboard/", method: "GET" }
  }
};

export default ApiEndpoints;
