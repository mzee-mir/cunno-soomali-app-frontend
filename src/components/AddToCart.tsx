import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGlobalContext } from '@/Provider/Global';
import Axios from '@/lib/Axios';
import SummaryApi from '@/api/Userauth';
import toast from 'react-hot-toast';
import LoadinButton from './LoadinButton';

interface AddToCartButtonProps {
  data: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: boolean;
    discount?: number | null;
  };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ data }) => {
  const { cartItems } = useSelector((state: RootState) => state.cartMenuItem);
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState<{
    _id: string;
    quantity: number;
  } | null>(null);

  // Check if the menu item is already in the cart
  useEffect(() => {
    const existingItem = cartItems.find(
      (item) => item.menuItemId._id === data._id
    );
    if (existingItem) {
      setCurrentCartItem({
        _id: existingItem._id,
        quantity: existingItem.quantity,
      });
    } else {
      setCurrentCartItem(null);
    }
  }, [cartItems, data._id]);
 
// Handle adding item to cart 
const handleAddToCart = async () => {
        if (!data.stock) {
            toast.error('This item is out of stock');
            return;
        }

        setIsLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.cartMenu.createCart,
                data: { menuItemId: data._id },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to add item to cart');
            }

            toast.success(`${data.name} added to cart`);
            await fetchCartItem();
        } catch (error: any) {
            if(error.response?.status === 400) {
                toast.error('Item is already in cart');
                await fetchCartItem(); // Refresh cart state
            } else {
                toast.error(error.message || 'Failed to add item to cart');
            }
        } finally {
            setIsLoading(false);
        }
    };

  // Handle increasing quantity
  const handleIncreaseQuantity = async () => {
    if (!currentCartItem) return;
    try {
      await updateCartItem(currentCartItem._id, currentCartItem.quantity + 1);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  // Handle decreasing quantity
  const handleDecreaseQuantity = async () => {
    if (!currentCartItem) return;
    
    if (currentCartItem.quantity === 1) {
      // Remove item if quantity would go to 0
      try {
        await deleteCartItem(currentCartItem._id);
        toast.success(`${data.name} removed from cart`);
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      // Decrease quantity
      try {
        await updateCartItem(currentCartItem._id, currentCartItem.quantity - 1);
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    }
  };

  // Render the appropriate button based on cart state
  if (currentCartItem) {
    return (
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          onClick={handleDecreaseQuantity}
          disabled={isLoading}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          -
        </button>
        <span className="px-4 py-1 text-center min-w-[2rem]">
          {currentCartItem.quantity}
        </span>
        <button
          onClick={handleIncreaseQuantity}
          disabled={isLoading || !data.stock}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || !data.stock}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isLoading ? (
        <LoadinButton />
      ) : (
        <span>{data.stock ? 'Add to Cart' : 'Out of Stock'}</span>
      )}
    </button>
  );
};

export default AddToCartButton;