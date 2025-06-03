import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FaShoppingCart, FaUtensils, FaClipboardList, FaTachometerAlt } from "react-icons/fa";
import { useState } from "react";
import CartSidebar from "./displaycartmenuItem";
import { useGlobalContext } from "@/Provider/Global";
import NotificationBell from "./NotificationBell";
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const MainNav = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  if (user.loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  

  const { totalQty } = useGlobalContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLoginRedirect = () => {
    navigate("/Login-Page");
  };

  const isRestaurantOwner = user.role === 'RESTAURANT OWNER';
  const isAdmin = user.role === 'ADMIN';
  const isAuthenticated = !!user._id;

  // Common navigation items for all authenticated users
  const commonNavItems = [
    {
      to: "/order-status",
      icon: <FaClipboardList className="h-4 w-4" />,
      text: (t("nav.orders"))
    }
  ];

  // Restaurant owner specific items
  const restaurantOwnerNavItems = [
    {
      to: "/manage-restaurant",
      icon: <FaUtensils className="h-4 w-4" />,
      text: (t("nav.orders"))
    },
    
  ];

  return (
    <div className="flex items-center gap-4">

      <ThemeToggle />

      {/* Cart Icon with Badge */}
      {isAuthenticated && (
        <button 
          className="relative hover:text-primary-500 transition-colors"
          onClick={() => setIsCartOpen(true)}
        >
          <FaShoppingCart className="h-6 w-6" />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      )}

      {/* User/Auth Section */}
      <span className="flex space-x-2 items-center">
        {isAuthenticated ? (
          <>
            {/* Common Navigation Items */}
            {commonNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-bold hover:text-blue-500 flex items-center gap-1"
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}

            {/* Restaurant Owner Specific Items */}
            {isRestaurantOwner && restaurantOwnerNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-bold hover:text-blue-500 flex items-center gap-1"
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}

            {/* Admin Features */}
            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className="font-bold hover:text-blue-500 flex items-center gap-1"
              >
                <FaTachometerAlt className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* User Menu */}
            <UsernameMenu />

            {/* Notification Bell */}
            <NotificationBell />
          </>
        ) : (
          <Button
            variant="ghost"
            className="font-bold hover:text-blue-500 hover:bg-white"
            onClick={handleLoginRedirect}
          >
            {t("nav.login")}
          </Button>
        )}
      </span>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default MainNav;