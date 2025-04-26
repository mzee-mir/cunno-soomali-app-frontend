import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useGlobalContext } from '@/Provider/Global';
import AddToCartButton from './AddToCart';
import { DisplayPriceInRupees } from '@/utils/DisplayPriceInRupees';
import toast from 'react-hot-toast';
import CheckoutButton from './CheckoutButton'; // Add this import

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItems = useSelector((state: RootState) => state.cartMenuItem.cartItems);
  const restaurant = useSelector((state: RootState) => state.restaurant.currentRestaurant); // <-- ADD THIS
  const { restaurantId } = useParams();

  // Calculate discounts and totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.menuItemId.price * item.quantity);
  }, 0);

  const totalDiscount = cartItems.reduce((sum, item) => {
    const discount = item.menuItemId.discount || 0;
    return sum + (item.menuItemId.price * (discount / 100) * item.quantity);
  }, 0);

  const deliveryCharge = restaurant?.deliveryPrice || 0;
  const grandTotal = totalPrice + deliveryCharge;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? '' : 'hidden'}`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            {/* Header */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FaShoppingCart />
                  Shopping Cart
                </h2>
                <button
                  type="button"
                  className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="mt-8">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FaShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Start adding some delicious items!</p>
                    <Link
                      to="/"
                      onClick={onClose}
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item._id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <img
                              src={item.menuItemId.imageUrl}
                              alt={item.menuItemId.name}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.menuItemId.name}</h3>
                                <p className="ml-4">
                                  {DisplayPriceInRupees(
                                    item.menuItemId.discount
                                      ? item.menuItemId.price * (1 - (item.menuItemId.discount / 100))
                                      : item.menuItemId.price
                                  )}
                                </p>
                              </div>
                              {item.menuItemId.discount && (
                                <p className="text-sm text-gray-500 line-through">
                                  {DisplayPriceInRupees(item.menuItemId.price)}
                                </p>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <p className="text-gray-500">Qty {item.quantity}</p>
                              <div className="w-32">
                              <AddToCartButton data={item.menuItemId} />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                  <p>Subtotal</p>
                  <p>{DisplayPriceInRupees(subtotal)}</p>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <p>Discount</p>
                    <p>-{DisplayPriceInRupees(totalDiscount)}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <p>Delivery</p>
                  <p>{deliveryCharge === 0 ? 'FREE' : DisplayPriceInRupees(deliveryCharge)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <p>Total</p>
                  <p>{DisplayPriceInRupees(grandTotal)}</p>
                </div>
                <div className="mt-6">
                  <CheckoutButton 
                    disabled={cartItems.length === 0}
                    restaurantId={restaurantId || ""} // Pass restaurantId to CheckoutButton
                  />
                </div>
                <div className="mt-3 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-primary-500 font-medium hover:text-primary-600"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;