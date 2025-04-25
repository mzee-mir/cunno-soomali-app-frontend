// GlobalProvider.tsx
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { CartMenuItemService } from '@/lib/cartmenuitemService';
import { AddressService } from '@/lib/AddressService';
import { clearCart } from '@/store/cartMenuItem';
import { clearAddresses } from '@/store/addressSlice';
import { logout } from '@/store/userSlice';
import { OrderService } from '@/lib/orderService';

interface GlobalContextType {
  totalQty: number;
  totalPrice: number;
  notDiscountTotalPrice: number;
  fetchCartItem: () => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  deleteCartItem: (cartItemId: string) => Promise<void>;
  fetchAddress: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  handleLogoutOut: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, totalItems, subtotal } = useSelector((state: RootState) => state.cartMenuItem);
  const  user  = useSelector((state: RootState) => state.user);

  // Calculate not discounted total price
  const notDiscountTotalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.menuItemId.price * item.quantity);
    }, 0);
  }, [cartItems]);

  // Fetch user's cart items
  const fetchCartItem = async () => {
    try {
      await CartMenuItemService.getCartItems(dispatch);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      await CartMenuItemService.updateItemQuantity(dispatch, cartItemId, quantity);
      // Refresh cart to ensure consistency
      await fetchCartItem();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  // Delete cart item
  const deleteCartItem = async (cartItemId: string) => {
    try {
      await CartMenuItemService.removeItemFromCart(dispatch, cartItemId);
      // Refresh cart to ensure consistency
      await fetchCartItem();
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      throw error;
    }
  };

  // Fetch user addresses
  const fetchAddress = async () => {
    try {
      await AddressService.getAddresses(dispatch);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  // Add this function inside the GlobalProvider component, before the contextValue
const fetchOrders = async () => {
  try {
    if (user?._id && user?.role === 'RESTAURANT OWNER') {
      await OrderService.getRestaurantOrders(dispatch);
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

  // Handle logout
  const handleLogoutOut = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearAddresses());
  };

  // Effect to handle user changes (login/logout)
  useEffect(() => {
    if (user?._id) {
      // User is logged in, fetch their cart and addresses
      fetchCartItem();
      fetchAddress();
      fetchOrders();
    } else {
      // User logged out, clear cart
      dispatch(clearCart());
    }
  }, [user?._id, dispatch]);

  const contextValue: GlobalContextType = {
    totalQty: totalItems,
    totalPrice: subtotal,
    notDiscountTotalPrice,
    fetchCartItem,
    updateCartItem,
    deleteCartItem,
    fetchAddress,
    fetchOrders,
    handleLogoutOut,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};